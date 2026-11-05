# HybridMeshChat

Expo/React Native messaging prototype with a Socket.IO relay and experimental offline sync and Bluetooth modules. This repository does not yet establish a complete offline mesh chat application.

## Current source scope

This description is based on source at [`393053ee430b10d66da1c08071a84bb38df82acb`](https://github.com/diretrix-git/HybridMeshChat/tree/393053ee430b10d66da1c08071a84bb38df82acb). No fresh build, benchmark, or physical-device test was performed for this documentation update.

| Component | Implemented source and limitations |
| --- | --- |
| App entrypoint | `App.tsx` is a local demo: Connect changes React state and Send appends local messages. It does not connect the transport, sync, database, or encryption modules. [Source](https://github.com/diretrix-git/HybridMeshChat/blob/393053ee430b10d66da1c08071a84bb38df82acb/App.tsx#L1-L57) |
| Wi-Fi/LAN relay | A separate Node server joins Socket.IO rooms and relays messages and sync events. The client transport connects to a supplied server URL. This is a server-mediated path, not implemented multi-hop mesh routing. [Server](https://github.com/diretrix-git/HybridMeshChat/blob/393053ee430b10d66da1c08071a84bb38df82acb/server/index.js#L1-L69), [client](https://github.com/diretrix-git/HybridMeshChat/blob/393053ee430b10d66da1c08071a84bb38df82acb/src/core/network/WiFiTransport.ts#L23-L91) |
| BLE | Scanning, connecting, characteristic writes, and monitoring are sketched. Peripheral advertising only sets a flag and logs a message. `react-native-ble-plx` is imported but absent from the root manifest. BLE discovery between two copies of this app is not established. [Advertising and imports](https://github.com/diretrix-git/HybridMeshChat/blob/393053ee430b10d66da1c08071a84bb38df82acb/src/core/network/BluetoothTransport.ts#L1-L53), [manifest](https://github.com/diretrix-git/HybridMeshChat/blob/393053ee430b10d66da1c08071a84bb38df82acb/package.json#L1-L28) |
| Transport selection | `TransportManager` attempts Wi-Fi first, then BLE initialization/scanning, and contains state/queue helpers. This does not establish seamless switching or lossless delivery: messages are removed from its queue without peer acknowledgement, and BLE initialization success does not prove a peer connection. [Source](https://github.com/diretrix-git/HybridMeshChat/blob/393053ee430b10d66da1c08071a84bb38df82acb/src/core/network/TransportManager.ts#L41-L86) |
| Sync and storage | SQLite storage, vector-clock merging, Lamport counters, and UUID-based conflict/deduplication helpers exist. End-to-end convergence and causality guarantees remain unverified. The Wi-Fi transport sends sync responses but has no receiving `sync-response` handler. [Sync engine](https://github.com/diretrix-git/HybridMeshChat/blob/393053ee430b10d66da1c08071a84bb38df82acb/src/core/sync/SyncEngine.ts#L18-L60), [conflict resolver](https://github.com/diretrix-git/HybridMeshChat/blob/393053ee430b10d66da1c08071a84bb38df82acb/src/core/sync/ConflictResolver.ts#L4-L43), [storage](https://github.com/diretrix-git/HybridMeshChat/blob/393053ee430b10d66da1c08071a84bb38df82acb/src/core/storage/DatabaseManager.ts#L1-L47), [transport](https://github.com/diretrix-git/HybridMeshChat/blob/393053ee430b10d66da1c08071a84bb38df82acb/src/core/network/WiFiTransport.ts#L49-L91) |

## Security boundaries

`EncryptionService` provides AES encrypt/decrypt and SHA-256 password helpers. Their presence does not mean chat messages are encrypted: `TransportManager.sendMessage` creates and sends message content without calling encryption, and the demo UI does not use these helpers. Do not treat this as verified end-to-end encrypted messaging. [Crypto helpers](https://github.com/diretrix-git/HybridMeshChat/blob/393053ee430b10d66da1c08071a84bb38df82acb/src/core/crypto/EncryptionService.ts#L1-L24), [send path](https://github.com/diretrix-git/HybridMeshChat/blob/393053ee430b10d66da1c08071a84bb38df82acb/src/core/network/TransportManager.ts#L70-L89).

The separate Node relay compares supplied room passwords. The embedded `HotspotServer` accepts a password argument without checking it. Neither relay's message handler checks that the sender belongs to the supplied room. Room-password helpers therefore do not establish authenticated message/sync access. The embedded server also imports Node `http` and server-side Socket.IO in mobile source; mobile runtime compatibility needs work and verification. [Node relay](https://github.com/diretrix-git/HybridMeshChat/blob/393053ee430b10d66da1c08071a84bb38df82acb/server/index.js#L17-L51), [embedded server](https://github.com/diretrix-git/HybridMeshChat/blob/393053ee430b10d66da1c08071a84bb38df82acb/src/core/network/HotspotServer.ts#L4-L56).

## File transfer scope

`FileTransfer` can read a file as Base64, split that string into 512-character pieces, encrypt/decrypt pieces, and write a reconstructed file. These are utility methods, not a completed transfer protocol. Encrypted pieces are not guaranteed to fit a BLE MTU, and `BluetoothTransport` encodes each entire message as Base64 without chunking/reassembly. No automatic orphan-file cleanup is established by these helpers. [File utility](https://github.com/diretrix-git/HybridMeshChat/blob/393053ee430b10d66da1c08071a84bb38df82acb/src/utils/FileTransfer.ts#L4-L58), [BLE send and encoding](https://github.com/diretrix-git/HybridMeshChat/blob/393053ee430b10d66da1c08071a84bb38df82acb/src/core/network/BluetoothTransport.ts#L93-L155).

## Development setup

The manifests provide these commands. They are starting points for development, not evidence of a successful mobile build or working cross-device messaging.

```bash
# Expo client, from the repository root
npm install
npx expo prebuild
npm run android  # or npm run ios
```

```bash
# Separate Node relay, from the repository root
cd server
npm install
npm start
```

The client command currently opens the local demo. Wiring it to the transport stack requires resolving missing native dependencies and platform support first. The relay defaults to port 3000. [Client scripts/dependencies](https://github.com/diretrix-git/HybridMeshChat/blob/393053ee430b10d66da1c08071a84bb38df82acb/package.json#L5-L25), [relay scripts](https://github.com/diretrix-git/HybridMeshChat/blob/393053ee430b10d66da1c08071a84bb38df82acb/server/package.json#L1-L12).

## Remaining work

- Integrate the UI with a buildable transport/storage dependency graph.
- Implement BLE peripheral advertising/services and payload framing before claiming BLE chat or mesh support.
- Complete sync-response handling, peer authorization, encryption integration, and acknowledged retry/persistence behavior.
- Add automated tests and verify two physical devices, reconnects, sync conflicts, and file transfers.
- Measure latency, throughput, battery use, and peer limits before publishing performance claims.

No automated test suite was found in the inspected source tree. Originality and sole authorship have not been independently verified. The architecture and hotspot guide documents describe design intent; use the source scope above when evaluating current capabilities.
