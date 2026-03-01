# HybridMeshChat - WiFi Hotspot Setup Guide

## Overview
HybridMeshChat can work in **WiFi Hotspot mode** where one user creates a hotspot and others connect to chat without internet.

## Setup Methods

### Method 1: WiFi Hotspot with Server (Recommended)

#### Host Device Setup:
1. **Enable WiFi Hotspot** on your phone
   - Android: Settings → Network & Internet → Hotspot & tethering → WiFi hotspot
   - iOS: Settings → Personal Hotspot → Turn On
   - Note your hotspot name and password

2. **Find Your Hotspot IP Address**
   - Android: Usually `192.168.43.1` or `192.168.137.1`
   - iOS: Usually `172.20.10.1`
   - Or check in hotspot settings

3. **Run the Socket.io Server**
   ```bash
   cd server
   npm install
   npm start
   ```
   Server will run on port 3000

4. **Open the App**
   - Server URL: `http://192.168.43.1:3000` (use your hotspot IP)
   - Room ID: `my-room`
   - Password: `password123`
   - Click Connect

#### Guest Devices Setup:
1. **Connect to Host's WiFi Hotspot**
   - Use the hotspot name and password from host

2. **Open the App**
   - Server URL: `http://192.168.43.1:3000` (same as host)
   - Room ID: `my-room` (same as host)
   - Password: `password123` (same as host)
   - Click Connect

3. **Start Messaging!**
   - All messages are encrypted
   - No internet required
   - Works completely local

### Method 2: Pure Bluetooth Mode (No Server)

If you don't want to run a server:

1. **All Devices:**
   - Open the app
   - App automatically tries WiFi first
   - When WiFi fails, switches to Bluetooth
   - Devices discover each other via BLE
   - Start messaging!

**Limitations:**
- 7-8 devices maximum
- 10-30 meter range
- Slower than WiFi (100ms vs 10ms latency)

## Network Architecture

```
┌─────────────────────────────────────────┐
│         WiFi Hotspot Mode               │
├─────────────────────────────────────────┤
│                                         │
│  Host Device (192.168.43.1)            │
│  ├── WiFi Hotspot ON                   │
│  ├── Socket.io Server Running          │
│  └── HybridMeshChat App                │
│                                         │
│  Guest Device 1                         │
│  ├── Connected to Hotspot              │
│  └── HybridMeshChat App                │
│                                         │
│  Guest Device 2                         │
│  ├── Connected to Hotspot              │
│  └── HybridMeshChat App                │
│                                         │
│  All messages route through host        │
└─────────────────────────────────────────┘
```

## Common Hotspot IP Addresses

| Platform | Default Hotspot IP |
|----------|-------------------|
| Android  | 192.168.43.1      |
| Windows  | 192.168.137.1     |
| iOS      | 172.20.10.1       |
| Linux    | 10.42.0.1         |

## Troubleshooting

### "Cannot connect to server"
- Verify hotspot is ON
- Check you're using correct IP address
- Ensure server is running on host device
- Check firewall isn't blocking port 3000

### "Connection timeout"
- Guest devices must be connected to host's hotspot
- Try pinging host: `ping 192.168.43.1`
- Restart the server

### "Wrong password"
- All devices must use same room password
- Password is case-sensitive

## Advanced: Peer-to-Peer Without Server

For true P2P without a central server, you can modify the architecture:

### Option A: WebRTC Data Channels
- Direct peer-to-peer connections
- No server needed after initial handshake
- Better performance

### Option B: Pure Bluetooth Mesh
- Already implemented!
- Just don't start the server
- App automatically uses Bluetooth

## Security Notes

- All messages are AES encrypted
- Hotspot password protects network access
- Room password protects chat access
- No data leaves the local network
- No internet connection used

## Performance

| Mode | Latency | Throughput | Max Users |
|------|---------|------------|-----------|
| WiFi Hotspot | 10-20ms | 50 MB/s | 50+ |
| Bluetooth | 100ms | 500 KB/s | 7-8 |

## Example: 3 Friends Chatting

**Friend 1 (Host):**
1. Enables hotspot: "MyChat"
2. Runs server on phone
3. Opens app, connects to `http://192.168.43.1:3000`

**Friend 2:**
1. Connects to "MyChat" hotspot
2. Opens app, connects to `http://192.168.43.1:3000`

**Friend 3:**
1. Connects to "MyChat" hotspot
2. Opens app, connects to `http://192.168.43.1:3000`

All three can now chat without internet!

## Running Server on Mobile Device

To run the Node.js server on a mobile device:

### Android:
1. Install Termux from F-Droid
2. Install Node.js: `pkg install nodejs`
3. Copy server files to phone
4. Run: `cd server && npm install && npm start`

### iOS:
1. Use iSH app from App Store
2. Install Node.js: `apk add nodejs npm`
3. Copy server files
4. Run: `cd server && npm install && npm start`

## Simplified Setup (No Server)

If running a server is too complex:

1. **All devices just open the app**
2. **App tries WiFi, fails, switches to Bluetooth**
3. **Devices auto-discover each other**
4. **Start chatting!**

This is the easiest mode but limited to 7-8 devices.
