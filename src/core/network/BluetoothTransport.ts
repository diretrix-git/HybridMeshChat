import { BleManager, Device, Characteristic } from 'react-native-ble-plx';
import { Message } from '../storage/schemas';
import { TransportEvents } from './WiFiTransport';

const SERVICE_UUID = '0000fff0-0000-1000-8000-00805f9b34fb';
const MESSAGE_CHAR_UUID = '0000fff1-0000-1000-8000-00805f9b34fb';
const SYNC_CHAR_UUID = '0000fff2-0000-1000-8000-00805f9b34fb';

export class BluetoothTransport {
  private bleManager: BleManager;
  private deviceId: string;
  private events: TransportEvents;
  private connectedDevices: Map<string, Device> = new Map();
  private isScanning: boolean = false;
  private isAdvertising: boolean = false;

  constructor(deviceId: string, events: TransportEvents) {
    this.bleManager = new BleManager();
    this.deviceId = deviceId;
    this.events = events;
  }

  async initialize(): Promise<boolean> {
    const state = await this.bleManager.state();
    if (state !== 'PoweredOn') {
      console.error('Bluetooth not powered on');
      return false;
    }
    return true;
  }

  async startAdvertising(roomId: string): Promise<void> {
    // Note: BLE advertising as peripheral requires native modules
    // This is a simplified version - full implementation needs:
    // react-native-ble-advertiser or custom native code
    this.isAdvertising = true;
    console.log('Started BLE advertising for room:', roomId);
  }

  async startScanning(roomId: string): Promise<void> {
    if (this.isScanning) return;

    this.isScanning = true;
    this.bleManager.startDeviceScan([SERVICE_UUID], null, (error, device) => {
      if (error) {
        console.error('Scan error:', error);
        return;
      }

      if (device && device.name?.includes(roomId)) {
        this.connectToDevice(device);
      }
    });
  }

  private async connectToDevice(device: Device): Promise<void> {
    try {
      const connected = await device.connect();
      await connected.discoverAllServicesAndCharacteristics();

      this.connectedDevices.set(device.id, connected);
      this.events.onPeerConnected(device.id);

      // Monitor for incoming messages
      connected.monitorCharacteristicForService(
        SERVICE_UUID,
        MESSAGE_CHAR_UUID,
        (error, characteristic) => {
          if (error) {
            console.error('Monitor error:', error);
            return;
          }

          if (characteristic?.value) {
            const message = this.decodeMessage(characteristic.value);
            if (message) {
              this.events.onMessage(message);
            }
          }
        }
      );

      // Handle disconnection
      device.onDisconnected(() => {
        this.connectedDevices.delete(device.id);
        this.events.onPeerDisconnected(device.id);
      });
    } catch (error) {
      console.error('Connection error:', error);
    }
  }

  async sendMessage(message: Message): Promise<void> {
    const encoded = this.encodeMessage(message);

    for (const [deviceId, device] of this.connectedDevices) {
      try {
        await device.writeCharacteristicWithResponseForService(
          SERVICE_UUID,
          MESSAGE_CHAR_UUID,
          encoded
        );
      } catch (error) {
        console.error(`Failed to send to ${deviceId}:`, error);
      }
    }
  }

  async requestSync(lastTimestamp: number): Promise<void> {
    const data = JSON.stringify({ type: 'sync-request', lastTimestamp });
    const encoded = Buffer.from(data).toString('base64');

    for (const device of this.connectedDevices.values()) {
      try {
        await device.writeCharacteristicWithResponseForService(
          SERVICE_UUID,
          SYNC_CHAR_UUID,
          encoded
        );
      } catch (error) {
        console.error('Sync request failed:', error);
      }
    }
  }

  stopScanning(): void {
    if (this.isScanning) {
      this.bleManager.stopDeviceScan();
      this.isScanning = false;
    }
  }

  disconnect(): void {
    this.stopScanning();
    this.isAdvertising = false;

    for (const device of this.connectedDevices.values()) {
      device.cancelConnection();
    }
    this.connectedDevices.clear();
  }

  private encodeMessage(message: Message): string {
    // BLE has MTU limits (~512 bytes), chunk if needed
    const json = JSON.stringify(message);
    return Buffer.from(json).toString('base64');
  }

  private decodeMessage(base64: string): Message | null {
    try {
      const json = Buffer.from(base64, 'base64').toString('utf-8');
      return JSON.parse(json);
    } catch (error) {
      console.error('Decode error:', error);
      return null;
    }
  }

  getConnectionStatus(): boolean {
    return this.connectedDevices.size > 0;
  }
}
