# HybridMeshChat - Quick Start Guide

## ✅ What's Been Built

A complete offline-first P2P messaging system with:
- Automatic WiFi/Bluetooth switching
- Vector clock synchronization
- AES encryption
- Leader election
- File transfer support
- No cloud dependencies

## 📁 Project Structure

```
HybridMeshChat/
├── src/
│   ├── core/
│   │   ├── network/          # Transport layer (WiFi + Bluetooth)
│   │   ├── sync/             # Vector clocks & conflict resolution
│   │   ├── storage/          # SQLite database
│   │   ├── crypto/           # AES encryption
│   │   └── election/         # Leader election (Bully algorithm)
│   ├── components/           # React Native UI components
│   └── utils/                # File transfer utilities
├── server/                   # Optional Socket.io server
├── App.tsx                   # Main application
└── Documentation files
```

## 🚀 Running the Application

### Option 1: Run Demo (Already Working!)
```bash
node test-demo.js
```
This demonstrates:
- Vector clock operations
- State machine transitions
- Conflict resolution
- Performance metrics
- System architecture

### Option 2: Run Full React Native App

#### Prerequisites
- Node.js 20+ installed ✓
- Android Studio (for Android) or Xcode (for iOS)
- Physical device or emulator

#### Steps
```bash
# 1. Start Expo development server
npm start

# 2. Choose platform:
# - Press 'a' for Android
# - Press 'i' for iOS
# - Press 'w' for web (limited functionality)

# 3. Optional: Start WiFi server (in another terminal)
cd server
npm install
npm start
```

### Option 3: View Architecture Demo
Open `demo.html` in your browser to see:
- Complete system architecture
- Network switching flow
- Performance comparisons
- Feature overview

## 🔧 Configuration

### WiFi Mode
Edit `App.tsx` to set your server URL:
```typescript
const [serverUrl, setServerUrl] = useState('http://YOUR_IP:3000');
```

Find your local IP:
- Windows: `ipconfig` (look for IPv4)
- Mac/Linux: `ifconfig` (look for inet)

### Bluetooth Mode
Bluetooth automatically activates when WiFi is unavailable. No configuration needed!

## 📱 Testing on Real Devices

### Android
1. Enable Developer Mode on your phone
2. Enable USB Debugging
3. Connect via USB
4. Run: `npm run android`

### iOS
1. Open Xcode
2. Select your device
3. Run: `npm run ios`

### Permissions Required
- Android: Bluetooth, Location, Network
- iOS: Bluetooth, Local Network

## 🎯 Key Features Demonstrated

### 1. Network Switching
```
WiFi Available → Use Socket.io (fast)
WiFi Lost → Switch to Bluetooth (offline)
WiFi Returns → Switch back to WiFi
```

### 2. Message Synchronization
- Vector clocks track causality
- Lamport timestamps provide ordering
- Automatic conflict resolution
- UUID-based deduplication

### 3. Security
- AES encryption for all messages
- Room password protection
- Local-only storage
- No data leaves devices

### 4. Leader Election
- Bully algorithm implementation
- Automatic re-election on failure
- Admin role management

## 📊 Performance Expectations

| Transport | Latency | Throughput | Max Users |
|-----------|---------|------------|-----------|
| WiFi      | 10ms    | 100 MB/s   | 50+       |
| Bluetooth | 100ms   | 500 KB/s   | 7-8       |

## 🐛 Troubleshooting

### "Cannot connect to server"
- Check server is running: `cd server && npm start`
- Verify IP address is correct
- Ensure devices are on same WiFi network
- Check firewall settings

### "Bluetooth not working"
- Enable Bluetooth on device
- Grant location permissions (Android requirement)
- Ensure devices are within 10-30 meters
- Check app permissions in device settings

### "Database error"
- Clear app data and restart
- Check storage permissions
- Verify SQLite is supported

## 📚 Documentation

- `README.md` - Overview and usage
- `ARCHITECTURE.md` - Detailed system design
- `PERFORMANCE.md` - Performance analysis
- `FOLDER_STRUCTURE.md` - Project organization

## 🔍 Code Examples

### Send a Message
```typescript
const transport = new TransportManager(deviceId, db);
await transport.connect(roomId, serverUrl, password);
await transport.sendMessage('Hello!', 'text');
```

### Create Encrypted Room
```typescript
const room = {
  id: 'room-123',
  name: 'My Room',
  passwordHash: EncryptionService.hashPassword('password'),
  encryptionKey: EncryptionService.generateRoomKey(),
  createdAt: Date.now(),
  isHost: true,
  hostId: deviceId
};
await db.saveRoom(room);
```

### Transfer File
```typescript
const chunks = await FileTransfer.chunkFile(filePath, encryptionKey);
for (const chunk of chunks) {
  await transport.sendMessage(chunk, 'file');
}
```

## 🎓 Learning Resources

### Understanding Vector Clocks
Vector clocks track the logical time of events in distributed systems:
- Each device maintains a counter
- Counters increment on local events
- Clocks merge on message receipt
- Enables causality detection

### Understanding Conflict Resolution
When two devices edit the same message:
1. Check vector clocks for causality
2. If concurrent, use Lamport timestamp
3. If still tied, use UUID comparison
4. Result: deterministic resolution

### Understanding Leader Election
Bully algorithm ensures one coordinator:
1. Device detects leader failure
2. Sends election message to higher IDs
3. If no response, becomes leader
4. Announces victory to lower IDs

## 🚧 Known Limitations

1. **Bluetooth Range**: 10-30 meters typical
2. **BLE Connections**: Limited to 7-8 simultaneous
3. **File Size**: Large files slow on Bluetooth
4. **Battery**: Continuous scanning drains battery
5. **Platform**: Full features require native build

## 🔮 Future Enhancements

- Multi-hop Bluetooth mesh routing
- WebRTC for direct peer connections
- Voice message support
- End-to-end per-user encryption
- Message reactions and threading
- Group video calls (WiFi only)

## ✨ Success Indicators

You'll know it's working when:
- ✓ Demo script runs without errors
- ✓ App connects to room
- ✓ Messages appear in real-time
- ✓ Switching between WiFi/BLE is seamless
- ✓ Messages persist after restart
- ✓ Multiple devices can communicate

## 🆘 Getting Help

1. Check documentation files
2. Review code comments
3. Run demo script for examples
4. Check console logs for errors
5. Verify network connectivity

## 🎉 You're Ready!

The system is fully implemented and ready to use. Start with the demo script to see it in action, then deploy to mobile devices for the full experience.

Happy meshing! 🔗
