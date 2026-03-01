# HybridMeshChat

Offline-first P2P messaging app with automatic WiFi/Bluetooth switching.

## Architecture Overview

### Network Layer
- **WiFi LAN Transport**: Socket.io for high-bandwidth communication
- **Bluetooth BLE Transport**: Mesh networking for offline scenarios
- **Automatic Switching**: Seamless transition based on availability
- **Connection State Machine**: Manages transport lifecycle

### Data Synchronization
- **Vector Clocks**: Tracks causality between messages
- **Lamport Timestamps**: Provides total ordering
- **Conflict Resolution**: Last-Write-Wins with UUID tiebreaker
- **Deduplication**: UUID-based message uniqueness

### Security
- **AES Encryption**: All messages encrypted with room key
- **Password Protection**: SHA-256 hashed room passwords
- **Local Storage**: No cloud dependencies

### Leader Election
- **Bully Algorithm**: Automatic coordinator selection
- **Fault Tolerance**: Re-election on host disconnect
- **Admin Roles**: Permission-based actions

## Network Switching Strategy

```
┌─────────────────────────────────────────┐
│         Connection Priority             │
├─────────────────────────────────────────┤
│ 1. WiFi LAN (if available)              │
│ 2. Bluetooth BLE (fallback)             │
│ 3. Queue messages if both unavailable   │
└─────────────────────────────────────────┘

State Transitions:
DISCONNECTED → CONNECTING_WIFI → CONNECTED_WIFI
                     ↓
              CONNECTING_BLUETOOTH → CONNECTED_BLUETOOTH
                     
CONNECTED_WIFI ←→ SWITCHING ←→ CONNECTED_BLUETOOTH
```

### Switching Logic
1. Monitor WiFi availability continuously
2. On WiFi loss: Enter SWITCHING state
3. Flush message queue to ensure no loss
4. Activate Bluetooth transport
5. Sync with peers via BLE
6. On WiFi recovery: Reverse process

## Bluetooth Integration

### BLE Architecture
- **Service UUID**: Custom GATT service for mesh
- **Characteristics**:
  - Message Channel: Encrypted message transfer
  - Sync Channel: Timestamp exchange
- **MTU Handling**: Chunking for large messages
- **Discovery**: Continuous scanning for room peers

### Limitations
- Range: ~10-30 meters
- Throughput: ~1 Mbps (vs WiFi ~100 Mbps)
- Connections: Limited to 7-8 simultaneous peers
- Battery: Higher consumption than WiFi

### Optimization
- Adaptive scanning intervals
- Connection pooling
- Message batching
- Compression for large payloads

## Conflict Resolution Algorithm

```typescript
function resolveConflict(local: Message, remote: Message): Message {
  // 1. Check vector clock causality
  if (remote causally follows local) return remote;
  if (local causally follows remote) return local;
  
  // 2. Concurrent: use Lamport timestamp
  if (remote.lamportTimestamp > local.lamportTimestamp) return remote;
  if (local.lamportTimestamp > remote.lamportTimestamp) return local;
  
  // 3. Tiebreaker: lexicographic UUID
  return remote.uuid > local.uuid ? remote : local;
}
```

### Guarantees
- **Eventual Consistency**: All peers converge to same state
- **Causality Preservation**: Happens-before relationships maintained
- **Deterministic**: Same input always produces same result

## Performance Considerations

### WiFi Transport
- **Latency**: <10ms local network
- **Throughput**: 10-100 MB/s
- **Scalability**: 50+ concurrent users
- **Reliability**: TCP guarantees

### Bluetooth Transport
- **Latency**: 50-200ms
- **Throughput**: 100-500 KB/s
- **Scalability**: 7-8 direct connections
- **Reliability**: Requires retry logic

### Database Optimization
- **Indexes**: timestamp, roomId for fast queries
- **Batch Writes**: Reduce I/O overhead
- **Vacuum**: Periodic cleanup
- **WAL Mode**: Better concurrency

### Memory Management
- **Message Pagination**: Load messages in chunks
- **Image Compression**: Reduce file sizes
- **Cache Eviction**: LRU for old messages
- **Connection Pooling**: Reuse BLE connections

## File Transfer

### Strategy
1. Chunk file into 512-byte segments
2. Encrypt each chunk with room key
3. Transfer via active transport
4. Store locally with UUID reference
5. Reconstruct on receiver side

### Storage
- Files stored in app's document directory
- Database stores file path reference
- Automatic cleanup of orphaned files

## Installation

```bash
npm install
npx expo prebuild
npm run android  # or npm run ios
```

## Usage

```typescript
import { TransportManager } from './src/core/network/TransportManager';
import { DatabaseManager } from './src/core/storage/DatabaseManager';

const db = new DatabaseManager();
await db.initialize();

const transport = new TransportManager('device-123', db);
await transport.connect('room-abc', 'http://192.168.1.100:3000', 'password');

await transport.sendMessage('Hello mesh!', 'text');
```

## Future Enhancements
- Multi-hop Bluetooth mesh routing
- WebRTC for direct peer connections
- Differential sync for large histories
- End-to-end encryption per user
- Voice message support
