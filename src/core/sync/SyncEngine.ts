import { DatabaseManager } from '../storage/DatabaseManager';
import { Message } from '../storage/schemas';
import { ConflictResolver } from './ConflictResolver';
import { VectorClock } from './VectorClock';

export class SyncEngine {
  private db: DatabaseManager;
  private deviceId: string;
  private vectorClock: VectorClock;
  private lamportTimestamp: number = 0;

  constructor(db: DatabaseManager, deviceId: string) {
    this.db = db;
    this.deviceId = deviceId;
    this.vectorClock = new VectorClock(deviceId);
  }

  async syncWithPeer(roomId: string, peerMessages: Message[]): Promise<Message[]> {
    // Get local messages since peer's last sync
    const lastLocalTimestamp = await this.db.getLastMessageTimestamp(roomId);
    
    // Merge vector clocks from peer messages
    for (const msg of peerMessages) {
      this.vectorClock.merge(msg.vectorClock);
      this.lamportTimestamp = Math.max(this.lamportTimestamp, msg.lamportTimestamp);
    }

    // Get all local messages for comparison
    const localMessages = await this.db.getMessagesSince(roomId, 0);

    // Combine and deduplicate
    const allMessages = [...localMessages, ...peerMessages];
    const deduplicated = ConflictResolver.deduplicateMessages(allMessages);

    // Save resolved messages
    for (const msg of deduplicated) {
      await this.db.saveMessage({ ...msg, syncStatus: 'synced' });
    }

    // Return messages peer doesn't have
    const peerUUIDs = new Set(peerMessages.map(m => m.uuid));
    return deduplicated.filter(m => !peerUUIDs.has(m.uuid));
  }

  createMessage(content: string, type: Message['type'], roomId: string, filePath?: string): Message {
    this.lamportTimestamp++;
    this.vectorClock.increment(this.deviceId);

    return {
      uuid: this.generateUUID(),
      senderId: this.deviceId,
      content,
      timestamp: Date.now(),
      lamportTimestamp: this.lamportTimestamp,
      vectorClock: this.vectorClock.getClock(),
      type,
      filePath,
      syncStatus: 'pending',
      roomId,
    };
  }

  private generateUUID(): string {
    return `${this.deviceId}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}
