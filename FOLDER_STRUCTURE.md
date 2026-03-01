# HybridMeshChat - Complete Folder Structure

```
HybridMeshChat/
│
├── src/
│   ├── core/                          # Core business logic
│   │   ├── network/                   # Transport layer
│   │   │   ├── TransportManager.ts    # Main orchestrator
│   │   │   ├── WiFiTransport.ts       # Socket.io implementation
│   │   │   ├── BluetoothTransport.ts  # BLE implementation
│   │   │   └── ConnectionStateMachine.ts # State management
│   │   │
│   │   ├── sync/                      # Synchronization logic
│   │   │   ├── SyncEngine.ts          # Message sync orchestrator
│   │   │   ├── ConflictResolver.ts    # LWW + vector clocks
│   │   │   └── VectorClock.ts         # Logical clock implementation
│   │   │
│   │   ├── storage/                   # Data persistence
│   │   │   ├── DatabaseManager.ts     # SQLite wrapper
│   │   │   └── schemas.ts             # Database schemas
│   │   │
│   │   ├── crypto/                    # Security
│   │   │   ├── EncryptionService.ts   # AES encryption
│   │   │   └── KeyManager.ts          # Key generation/storage
│   │   │
│   │   └── election/                  # Coordination
│   │       └── LeaderElection.ts      # Bully algorithm
│   │
│   ├── components/                    # React components
│   │   ├── QRJoinScreen.tsx           # QR code generation/scanning
│   │   ├── ChatScreen.tsx             # Main chat interface
│   │   ├── RoomList.tsx               # Room selection
│   │   └── ConnectionStatus.tsx       # Network indicator
│   │
│   ├── screens/                       # Screen containers
│   │   ├── HomeScreen.tsx
│   │   ├── CreateRoomScreen.tsx
│   │   └── JoinRoomScreen.tsx
│   │
│   ├── utils/                         # Utilities
│   │   ├── FileTransfer.ts            # File chunking/reconstruction
│   │   ├── ImageCompression.ts        # Image optimization
│   │   └── DeviceInfo.ts              # Device identification
│   │
│   ├── hooks/                         # React hooks
│   │   ├── useTransport.ts            # Transport management
│   │   ├── useMessages.ts             # Message state
│   │   └── useSync.ts                 # Sync status
│   │
│   └── types/                         # TypeScript types
│       └── index.ts
│
├── server/                            # Optional WiFi server
│   ├── index.js                       # Socket.io server
│   └── package.json
│
├── android/                           # Android native code
│   └── app/
│       └── src/
│           └── main/
│               └── AndroidManifest.xml # Permissions
│
├── ios/                               # iOS native code
│   └── HybridMeshChat/
│       └── Info.plist                 # Permissions
│
├── assets/                            # Static assets
│   ├── images/
│   └── fonts/
│
├── docs/                              # Documentation
│   ├── ARCHITECTURE.md                # System design
│   ├── API.md                         # API reference
│   └── DEPLOYMENT.md                  # Deployment guide
│
├── tests/                             # Test files
│   ├── unit/
│   │   ├── VectorClock.test.ts
│   │   ├── ConflictResolver.test.ts
│   │   └── EncryptionService.test.ts
│   │
│   ├── integration/
│   │   ├── TransportManager.test.ts
│   │   └── SyncEngine.test.ts
│   │
│   └── e2e/
│       └── messaging.test.ts
│
├── .gitignore
├── package.json
├── tsconfig.json
├── babel.config.js
├── metro.config.js
├── app.json                           # Expo configuration
└── README.md
```

## Key Directories Explained

### `/src/core/`
Contains all business logic independent of UI framework. This allows for:
- Easy testing without UI dependencies
- Potential code reuse in other platforms
- Clear separation of concerns

### `/src/core/network/`
Transport layer abstraction:
- `TransportManager`: Decides which transport to use
- `WiFiTransport`: Socket.io client wrapper
- `BluetoothTransport`: BLE operations
- `ConnectionStateMachine`: State transitions

### `/src/core/sync/`
Distributed systems logic:
- `SyncEngine`: Coordinates message synchronization
- `VectorClock`: Tracks causality
- `ConflictResolver`: Resolves concurrent updates

### `/src/core/storage/`
Data persistence:
- `DatabaseManager`: SQLite operations
- `schemas.ts`: Table definitions and types

### `/src/core/crypto/`
Security primitives:
- `EncryptionService`: AES encryption/decryption
- `KeyManager`: Key generation and storage

### `/src/core/election/`
Coordination algorithms:
- `LeaderElection`: Bully algorithm for leader selection

### `/src/components/`
Reusable React Native components:
- Presentational components
- No business logic
- Props-based API

### `/src/screens/`
Screen-level containers:
- Compose components
- Handle navigation
- Connect to state management

### `/src/utils/`
Helper functions:
- File operations
- Image processing
- Device utilities

### `/src/hooks/`
Custom React hooks:
- Encapsulate stateful logic
- Reusable across components
- Clean component code

### `/server/`
Optional Node.js server for WiFi mode:
- Minimal routing logic
- No data storage
- Can run on local device or Raspberry Pi

### `/tests/`
Comprehensive test suite:
- Unit tests for algorithms
- Integration tests for subsystems
- E2E tests for user flows

## File Naming Conventions

- **PascalCase**: Classes and React components (`TransportManager.ts`, `ChatScreen.tsx`)
- **camelCase**: Utilities and hooks (`useTransport.ts`, `fileTransfer.ts`)
- **UPPERCASE**: Constants and environment files (`.ENV`, `CONSTANTS.ts`)
- **kebab-case**: Configuration files (`babel.config.js`, `metro.config.js`)

## Import Path Aliases

Configure in `tsconfig.json`:
```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@core/*": ["src/core/*"],
      "@components/*": ["src/components/*"],
      "@utils/*": ["src/utils/*"],
      "@hooks/*": ["src/hooks/*"]
    }
  }
}
```

Usage:
```typescript
import { TransportManager } from '@core/network/TransportManager';
import { ChatScreen } from '@components/ChatScreen';
```

## Module Dependencies

```
UI Layer (components/screens)
    ↓
Hooks Layer (hooks/)
    ↓
Core Layer (core/)
    ↓
Utils Layer (utils/)
```

Rules:
- Core never imports from UI
- Utils never import from Core
- Hooks can import from Core and Utils
- UI can import from all layers
