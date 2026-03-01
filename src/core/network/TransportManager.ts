import { WiFiTransport, TransportEvents } from './WiFiTransport';
import { BluetoothTransport } from './BluetoothTransport';
import { ConnectionStateMachine, ConnectionState, ConnectionEvent } from './ConnectionStateMachine';
import { Message } from '../storage/schemas';
import { SyncEngine } from '../sync/SyncEngine';
import { DatabaseManager } from '../storage/DatabaseManager';
import { LeaderElection } from '../election/LeaderElection';

export class TransportManager {
  private wifiTransport: WiFiTransport;
  private bluetoothTransport: BluetoothTransport;
  private stateMachine: ConnectionStateMachine;
  private syncEngine: SyncEngine;
  private leaderElection: LeaderElection;
  private deviceId: string;
  private roomId: string;
  private messageQueue: Message[] = [];
  private syncInterval: NodeJS.Timeout | null = null;

  constructor(deviceId: string, db: DatabaseManager) {
    this.deviceId = deviceId;
    this.syncEngine = new SyncEngine(db, deviceId);

    const events: TransportEvents = {
      onMessage: this.handleIncomingMessage.bind(this),
      onPeerConnected: this.handlePeerConnected.bind(this),
      onPeerDisconnected: this.handlePeerDisconnected.bind(this),
      onSyncRequest: this.handleSyncRequest.bind(this),
    };

    this.wifiTransport = new WiFiTransport(deviceId, events);
    this.bluetoothTransport = new BluetoothTransport(deviceId, events);

    this.stateMachine = new ConnectionStateMachine(this.handleStateChange.bind(this));

    this.leaderElection = new LeaderElection(deviceId, (leaderId) => {
      console.log('New leader elected:', leaderId);
    });
  }

  async connect(roomId: string, serverUrl: string, password: string): Promise<boolean> {
    this.roomId = roomId;

    // Try WiFi first
    this.stateMachine.transition(ConnectionEvent.WIFI_AVAILABLE);
    const wifiSuccess = await this.wifiTransport.connect(serverUrl, roomId, password);

    if (wifiSuccess) {
      this.stateMachine.transition(ConnectionEvent.CONNECTION_SUCCESS);
      this.startPeriodicSync();
      return true;
    }

    // Fallback to Bluetooth
    this.stateMachine.transition(ConnectionEvent.CONNECTION_FAILED);
    const bleReady = await this.bluetoothTransport.initialize();

    if (bleReady) {
      await this.bluetoothTransport.startAdvertising(roomId);
      await this.bluetoothTransport.startScanning(roomId);
      this.stateMachine.transition(ConnectionEvent.CONNECTION_SUCCESS);
      this.startPeriodicSync();
      return true;
    }

    this.stateMachine.transition(ConnectionEvent.CONNECTION_FAILED);
    return false;
  }

  async sendMessage(content: string, type: Message['type'], filePath?: string): Promise<void> {
    const message = this.syncEngine.createMessage(content, type, this.roomId, filePath);

    // Queue message for reliability
    this.messageQueue.push(message);

    const state = this.stateMachine.getState();

    if (state === ConnectionState.CONNECTED_WIFI) {
      this.wifiTransport.sendMessage(message);
    } else if (state === ConnectionState.CONNECTED_BLUETOOTH) {
      await this.bluetoothTransport.sendMessage(message);
    }

    // Remove from queue after successful send
    this.messageQueue = this.messageQueue.filter(m => m.uuid !== message.uuid);
  }

  private async handleIncomingMessage(message: Message): Promise<void> {
    await this.syncEngine.syncWithPeer(this.roomId, [message]);
  }

  private handlePeerConnected(peerId: string): void {
    this.leaderElection.addDevice(peerId);
    // Trigger sync on new peer
    this.requestSync();
  }

  private handlePeerDisconnected(peerId: string): void {
    this.leaderElection.removeDevice(peerId);
  }

  private async handleSyncRequest(peerId: string, lastTimestamp: number): Promise<void> {
    const messages = await this.syncEngine.syncWithPeer(this.roomId, []);
    
    const state = this.stateMachine.getState();
    if (state === ConnectionState.CONNECTED_WIFI) {
      this.wifiTransport.sendSyncResponse(peerId, messages);
    }
  }

  private handleStateChange(state: ConnectionState): void {
    console.log('Connection state changed to:', state);

    if (state === ConnectionState.SWITCHING) {
      // Graceful switch: flush queue before switching
      this.flushMessageQueue();
    }

    if (state === ConnectionState.CONNECTED_WIFI || state === ConnectionState.CONNECTED_BLUETOOTH) {
      this.requestSync();
    }
  }

  private async flushMessageQueue(): Promise<void> {
    for (const message of this.messageQueue) {
      const state = this.stateMachine.getState();
      if (state === ConnectionState.CONNECTED_WIFI) {
        this.wifiTransport.sendMessage(message);
      } else if (state === ConnectionState.CONNECTED_BLUETOOTH) {
        await this.bluetoothTransport.sendMessage(message);
      }
    }
    this.messageQueue = [];
  }

  private requestSync(): void {
    const state = this.stateMachine.getState();
    if (state === ConnectionState.CONNECTED_WIFI) {
      this.wifiTransport.requestSync(Date.now());
    } else if (state === ConnectionState.CONNECTED_BLUETOOTH) {
      this.bluetoothTransport.requestSync(Date.now());
    }
  }

  private startPeriodicSync(): void {
    if (this.syncInterval) clearInterval(this.syncInterval);

    this.syncInterval = setInterval(() => {
      this.requestSync();
    }, 30000); // Sync every 30 seconds
  }

  disconnect(): void {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
      this.syncInterval = null;
    }

    this.wifiTransport.disconnect();
    this.bluetoothTransport.disconnect();
    this.stateMachine.reset();
  }

  getConnectionState(): ConnectionState {
    return this.stateMachine.getState();
  }

  isLeader(): boolean {
    return this.leaderElection.isLeader();
  }
}
