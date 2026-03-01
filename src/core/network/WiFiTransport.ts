import io, { Socket } from 'socket.io-client';
import { Message } from '../storage/schemas';

export interface TransportEvents {
  onMessage: (message: Message) => void;
  onPeerConnected: (peerId: string) => void;
  onPeerDisconnected: (peerId: string) => void;
  onSyncRequest: (peerId: string, lastTimestamp: number) => void;
}

export class WiFiTransport {
  private socket: Socket | null = null;
  private roomId: string | null = null;
  private deviceId: string;
  private events: TransportEvents;
  private isConnected: boolean = false;

  constructor(deviceId: string, events: TransportEvents) {
    this.deviceId = deviceId;
    this.events = events;
  }

  async connect(serverUrl: string, roomId: string, password: string): Promise<boolean> {
    return new Promise((resolve) => {
      this.socket = io(serverUrl, {
        transports: ['websocket'],
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionAttempts: 5,
      });

      this.roomId = roomId;

      this.socket.on('connect', () => {
        this.socket!.emit('join-room', { roomId, deviceId: this.deviceId, password });
      });

      this.socket.on('room-joined', () => {
        this.isConnected = true;
        resolve(true);
      });

      this.socket.on('room-error', (error: string) => {
        console.error('Room error:', error);
        this.isConnected = false;
        resolve(false);
      });

      this.socket.on('peer-connected', (peerId: string) => {
        this.events.onPeerConnected(peerId);
      });

      this.socket.on('peer-disconnected', (peerId: string) => {
        this.events.onPeerDisconnected(peerId);
      });

      this.socket.on('message', (message: Message) => {
        this.events.onMessage(message);
      });

      this.socket.on('sync-request', (data: { peerId: string; lastTimestamp: number }) => {
        this.events.onSyncRequest(data.peerId, data.lastTimestamp);
      });

      this.socket.on('disconnect', () => {
        this.isConnected = false;
      });

      setTimeout(() => {
        if (!this.isConnected) resolve(false);
      }, 5000);
    });
  }

  sendMessage(message: Message): void {
    if (this.socket && this.isConnected) {
      this.socket.emit('message', { roomId: this.roomId, message });
    }
  }

  requestSync(lastTimestamp: number): void {
    if (this.socket && this.isConnected) {
      this.socket.emit('sync-request', { roomId: this.roomId, lastTimestamp });
    }
  }

  sendSyncResponse(peerId: string, messages: Message[]): void {
    if (this.socket && this.isConnected) {
      this.socket.emit('sync-response', { peerId, messages });
    }
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
    }
  }

  getConnectionStatus(): boolean {
    return this.isConnected;
  }
}
