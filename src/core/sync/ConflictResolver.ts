import { Message } from '../storage/schemas';
import { VectorClock } from './VectorClock';

export class ConflictResolver {
  // Last-Write-Wins with vector clock causality
  static resolveConflict(local: Message, remote: Message): Message {
    const localVC = new VectorClock(local.senderId);
    Object.assign(localVC, { clock: local.vectorClock });

    const comparison = localVC.compare(remote.vectorClock);

    // If remote causally follows local, take remote
    if (comparison === -1) return remote;

    // If local causally follows remote, keep local
    if (comparison === 1) return local;

    // Concurrent: use Lamport timestamp, then UUID as tiebreaker
    if (remote.lamportTimestamp > local.lamportTimestamp) {
      return remote;
    } else if (remote.lamportTimestamp < local.lamportTimestamp) {
      return local;
    } else {
      // Same Lamport timestamp: lexicographic UUID comparison
      return remote.uuid > local.uuid ? remote : local;
    }
  }

  static deduplicateMessages(messages: Message[]): Message[] {
    const messageMap = new Map<string, Message>();

    for (const msg of messages) {
      const existing = messageMap.get(msg.uuid);
      if (!existing) {
        messageMap.set(msg.uuid, msg);
      } else {
        const resolved = this.resolveConflict(existing, msg);
        messageMap.set(msg.uuid, resolved);
      }
    }

    return Array.from(messageMap.values()).sort((a, b) => a.timestamp - b.timestamp);
  }
}
