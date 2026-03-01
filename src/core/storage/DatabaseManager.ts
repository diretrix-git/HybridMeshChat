import * as SQLite from 'expo-sqlite';
import { Message, Room, Device, CREATE_TABLES } from './schemas';

export class DatabaseManager {
  private db: SQLite.SQLiteDatabase;

  async initialize() {
    this.db = await SQLite.openDatabaseAsync('hybridmesh.db');
    await this.db.execAsync(CREATE_TABLES);
  }

  async saveMessage(message: Message): Promise<void> {
    await this.db.runAsync(
      `INSERT OR REPLACE INTO messages VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        message.uuid,
        message.senderId,
        message.content,
        message.timestamp,
        message.lamportTimestamp,
        JSON.stringify(message.vectorClock),
        message.type,
        message.filePath || null,
        message.syncStatus,
        message.roomId,
      ]
    );
  }

  async getMessagesSince(roomId: string, timestamp: number): Promise<Message[]> {
    const result = await this.db.getAllAsync<any>(
      `SELECT * FROM messages WHERE roomId = ? AND timestamp > ? ORDER BY timestamp ASC`,
      [roomId, timestamp]
    );
    return result.map(row => ({
      ...row,
      vectorClock: JSON.parse(row.vectorClock),
    }));
  }

  async getLastMessageTimestamp(roomId: string): Promise<number> {
    const result = await this.db.getFirstAsync<{ maxTime: number }>(
      `SELECT MAX(timestamp) as maxTime FROM messages WHERE roomId = ?`,
      [roomId]
    );
    return result?.maxTime || 0;
  }

  async saveRoom(room: Room): Promise<void> {
    await this.db.runAsync(
      `INSERT OR REPLACE INTO rooms VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [room.id, room.name, room.passwordHash, room.encryptionKey, room.createdAt, room.isHost ? 1 : 0, room.hostId]
    );
  }

  async getRoom(roomId: string): Promise<Room | null> {
    const result = await this.db.getFirstAsync<any>(
      `SELECT * FROM rooms WHERE id = ?`,
      [roomId]
    );
    if (!result) return null;
    return { ...result, isHost: result.isHost === 1 };
  }

  async saveDevice(device: Device): Promise<void> {
    await this.db.runAsync(
      `INSERT OR REPLACE INTO devices VALUES (?, ?, ?, ?, ?)`,
      [device.id, device.name, device.role, device.lastSeen, device.publicKey]
    );
  }

  async getDevices(): Promise<Device[]> {
    return await this.db.getAllAsync<Device>(`SELECT * FROM devices`);
  }
}
