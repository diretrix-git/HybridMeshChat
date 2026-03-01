# HybridMeshChat - Detailed Architecture

## System Components

### 1. Transport Layer

#### WiFiTransport
- Uses Socket.io client for WebSocket communication
- Connects to local server (e.g., 192.168.1.x:3000)
- Handles room authentication
- Emits/receives: messages, sync requests, peer events
- Automatic reconnection with exponential backoff

#### BluetoothTransport
- Uses react-native-ble-plx for BLE operations
- Implements GATT server/client roles
- Custom service UUID for app identification
- Two characteristics: message channel, sync channel
- Handles MTU negotiation and chunking

#### TransportManager (Orchestrator)
- Owns both transport instances
- Manages ConnectionStateMachine
- Routes messages to active transport
- Maintains message queue for reliability
- Triggers sync on reconnection

### 2. Synchronization Layer

#### VectorClock
- Tracks logical time per device
- Merge operation for clock updates
- Compare operation returns causality relationship
- Used to detect concurrent vs sequential events

#### ConflictResolver
- Implements Last-Write-Wins strategy
- Uses vector clocks for causality
- Falls back to Lamport timestamps
- UUID as final tiebreaker
- Deduplication by UUID

#### SyncEngine
- Creates messages with metadata
- Manages local vector clock
- Increments Lamport timestamp
- Orchestrates sync protocol:
  1. Exchange last timestamps
  2. Send missing messages
  3. Resolve conflicts
  4. Update local database

### 3. Storage Layer

#### DatabaseManager
- SQLite wrapper using expo-sqlite
- Three tables: messages, rooms, devices
- Indexed queries for performance
- Batch operations for sync
- Transaction support

#### Schemas
- Message: Full metadata including vector clock
- Room: Encryption key and password hash
- Device: Peer information and roles

### 4. Security Layer

#### EncryptionService
- AES encryption using crypto-js
- Room-level encryption key
- SHA-256 password hashing
- Key derivation for room passwords

### 5. Coordination Layer

#### LeaderElection
- Bully algorithm implementation
- Highest device ID wins
- Handles election messages
- Coordinator announcements
- Re-election on leader failure

## Data Flow

### Message Send Flow
```
User Input
    ↓
SyncEngine.createMessage()
    ↓
EncryptionService.encrypt()
    ↓
TransportManager.sendMessage()
    ↓
[WiFiTransport OR BluetoothTransport]
    ↓
Network
```

### Message Receive Flow
```
Network
    ↓
[WiFiTransport OR BluetoothTransport]
    ↓
TransportManager.handleIncomingMessage()
    ↓
SyncEngine.syncWithPeer()
    ↓
ConflictResolver.deduplicateMessages()
    ↓
DatabaseManager.saveMessage()
    ↓
UI Update
```

### Sync Protocol
```
Device A                          Device B
   |                                 |
   |--- sync-request (timestamp) --->|
   |                                 |
   |<-- sync-response (messages) ----|
   |                                 |
   |--- sync-response (messages) --->|
   |                                 |
   [Both resolve conflicts locally]
```

## State Management

### Connection States
- DISCONNECTED: No active transport
- CONNECTING_WIFI: Attempting WiFi connection
- CONNECTED_WIFI: WiFi active
- CONNECTING_BLUETOOTH: Attempting BLE connection
- CONNECTED_BLUETOOTH: BLE active
- SWITCHING: Transitioning between transports

### State Transitions
- WiFi available → Try WiFi first
- WiFi fails → Fallback to Bluetooth
- WiFi returns while on BLE → Switch to WiFi
- Both unavailable → Queue messages

## Scalability Analysis

### WiFi Mode
- Server-mediated: O(1) per client
- Broadcast to N peers: O(N) server load
- Suitable for 50+ users in same room

### Bluetooth Mode
- Direct connections: O(N²) complexity
- Limited to 7-8 simultaneous connections
- Requires mesh routing for larger groups

### Hybrid Approach
- Use WiFi for large groups
- Use BLE for small offline groups
- Automatic selection based on availability

## Security Model

### Threat Model
- Assumes local network is semi-trusted
- Protects against eavesdropping
- Prevents unauthorized room access
- Does not protect against malicious room members

### Encryption
- Room key generated on creation
- Shared via QR code or password
- All messages encrypted before transmission
- Keys never leave device

### Authentication
- Password-based room access
- SHA-256 hash stored in database
- No central authentication server

## Performance Optimization

### Database
- Indexes on timestamp and roomId
- Batch inserts during sync
- Prepared statements
- WAL mode for concurrency

### Network
- Message batching (100ms window)
- Compression for large payloads
- Connection pooling
- Adaptive retry intervals

### Memory
- Paginated message loading
- LRU cache for recent messages
- Lazy image loading
- Periodic garbage collection

## Error Handling

### Network Errors
- Automatic reconnection
- Exponential backoff
- Message queue persistence
- Graceful degradation

### Sync Errors
- Conflict resolution always succeeds
- Partial sync recovery
- Timestamp validation
- Duplicate detection

### Storage Errors
- Transaction rollback
- Integrity constraints
- Backup on corruption
- Migration support

## Testing Strategy

### Unit Tests
- VectorClock operations
- ConflictResolver logic
- EncryptionService
- LeaderElection algorithm

### Integration Tests
- TransportManager switching
- SyncEngine protocol
- DatabaseManager operations

### E2E Tests
- Multi-device scenarios
- Network failure simulation
- Conflict resolution
- Leader election

## Deployment Considerations

### iOS
- Background BLE requires capabilities
- Network permissions
- Local network discovery

### Android
- Location permission for BLE
- Foreground service for background operation
- Battery optimization exemption

### Server (Optional)
- Node.js Socket.io server
- Minimal state (just routing)
- Can run on Raspberry Pi
- No database required
