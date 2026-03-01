export interface Message {
  uuid: string;
  senderId: string;
  content: string; // encrypted
  timestamp: number;
  lamportTimestamp: number;
  vectorClock: Record<string, number>;
  type: 'text' | 'image' | 'file';
  filePath?: string;
  syncStatus: 'pending' | 'synced' | 'failed';
  roomId: string;
}

export interface Room {
  id: string;
  name: string;
  passwordHash: string;
  encryptionKey: string;
  createdAt: number;
  isHost: boolean;
  hostId: string;
}

export interface Device {
  id: string;
  name: string;
  role: 'admin' | 'member';
  lastSeen: number;
  publicKey: string;
}

export const CREATE_TABLES = `
  CREATE TABLE IF NOT EXISTS messages (
    uuid TEXT PRIMARY KEY,
    senderId TEXT NOT NULL,
    content TEXT NOT NULL,
    timestamp INTEGER NOT NULL,
    lamportTimestamp INTEGER NOT NULL,
    vectorClock TEXT NOT NULL,
    type TEXT NOT NULL,
    filePath TEXT,
    syncStatus TEXT NOT NULL,
    roomId TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS rooms (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    passwordHash TEXT NOT NULL,
    encryptionKey TEXT NOT NULL,
    createdAt INTEGER NOT NULL,
    isHost INTEGER NOT NULL,
    hostId TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS devices (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    role TEXT NOT NULL,
    lastSeen INTEGER NOT NULL,
    publicKey TEXT NOT NULL
  );

  CREATE INDEX IF NOT EXISTS idx_messages_timestamp ON messages(timestamp);
  CREATE INDEX IF NOT EXISTS idx_messages_room ON messages(roomId);
`;
