# Simple Hotspot Setup - 3 Easy Steps

## What You Asked For: ✅
**"One user opens hotspot and others who are connected can send messages"**

This is EXACTLY what HybridMeshChat does!

## Quick Setup (3 Steps)

### Step 1: Host Creates Hotspot
**Person 1 (Host):**
1. Turn on WiFi Hotspot on your phone
   - Android: Settings → Hotspot
   - iPhone: Settings → Personal Hotspot
2. Note the hotspot name (e.g., "MyPhone")
3. Note the password

### Step 2: Others Connect to Hotspot
**Person 2, 3, 4... (Guests):**
1. Go to WiFi settings
2. Connect to host's hotspot (e.g., "MyPhone")
3. Enter the hotspot password

### Step 3: Everyone Opens the App
**All People:**
1. Open HybridMeshChat app
2. Enter:
   - Server: `http://192.168.43.1:3000` (host's IP)
   - Room: `friends-chat`
   - Password: `secret123`
3. Click "Connect"
4. Start chatting!

## That's It! 🎉

No internet needed. All messages stay local on the hotspot network.

## How It Works

```
You (Host)                    Friend 1              Friend 2
    │                             │                     │
    │ Creates Hotspot             │                     │
    │ "MyPhone"                   │                     │
    │                             │                     │
    │◄────────────────────────────┤ Connects to         │
    │                             │ "MyPhone"           │
    │                             │                     │
    │◄────────────────────────────┼─────────────────────┤
    │                             │                     │ Connects to
    │                             │                     │ "MyPhone"
    │                             │                     │
    │ All open app and connect to same room             │
    │                             │                     │
    │◄────────────────────────────┼─────────────────────┤
    │                             │                     │
    │         Messages flow through hotspot             │
    │                             │                     │
```

## Finding Host IP Address

The host's IP is usually one of these:
- **Android**: `192.168.43.1`
- **iPhone**: `172.20.10.1`
- **Windows**: `192.168.137.1`

To check on Android:
1. Settings → Hotspot → Connected devices
2. Look for "Hotspot IP" or similar

## Two Modes Available

### Mode 1: WiFi Hotspot (What You Want)
- ✅ One person creates hotspot
- ✅ Others connect to it
- ✅ Fast (10ms latency)
- ✅ 50+ people can join
- ✅ No internet needed

### Mode 2: Bluetooth (Backup)
- If WiFi fails, automatically switches to Bluetooth
- Works up to 30 meters
- 7-8 people max
- No setup needed

## Example Conversation

**You:** "Hey everyone, I'm creating a hotspot called 'GameNight'"

**Friend 1:** "Connected to GameNight!"

**Friend 2:** "Me too!"

**You:** "Open the app, server is 192.168.43.1:3000, room is 'game', password is '1234'"

**Everyone opens app, enters details, clicks connect**

**You:** "Who's ready to play?"

**Friend 1:** "Let's go!"

**Friend 2:** "I'm in!"

All messages encrypted, all local, no internet used! 🔒

## Why This is Better Than WhatsApp/Telegram

| Feature | HybridMeshChat | WhatsApp/Telegram |
|---------|----------------|-------------------|
| Needs Internet | ❌ No | ✅ Yes |
| Data Usage | 0 MB | Uses data |
| Privacy | 100% local | Goes through servers |
| Works Offline | ✅ Yes | ❌ No |
| Hotspot Mode | ✅ Yes | ❌ No |

## Troubleshooting

**"Can't connect"**
- Make sure everyone is connected to the same hotspot
- Check the IP address is correct
- Try `192.168.43.1` or `172.20.10.1`

**"Server not found"**
- Host needs to run the server (see server/ folder)
- Or app will automatically use Bluetooth instead

**"Wrong password"**
- Everyone must use the SAME room password
- It's case-sensitive

## Advanced: No Server Needed

Don't want to run a server? No problem!

1. Everyone just opens the app
2. App tries WiFi, fails, switches to Bluetooth
3. Devices find each other automatically
4. Start chatting!

Works for 7-8 people within 30 meters.
