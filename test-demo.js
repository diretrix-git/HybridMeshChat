// Simple demonstration of HybridMeshChat core concepts
console.log('\n🔗 HybridMeshChat - System Demonstration\n');
console.log('=' .repeat(60));

// Simulate Vector Clock
class VectorClock {
  constructor(deviceId) {
    this.clock = { [deviceId]: 0 };
  }
  
  increment(deviceId) {
    this.clock[deviceId] = (this.clock[deviceId] || 0) + 1;
  }
  
  merge(other) {
    for (const [deviceId, timestamp] of Object.entries(other)) {
      this.clock[deviceId] = Math.max(this.clock[deviceId] || 0, timestamp);
    }
  }
  
  getClock() {
    return { ...this.clock };
  }
}

// Simulate Message Creation
class MessageSimulator {
  constructor(deviceId) {
    this.deviceId = deviceId;
    this.vectorClock = new VectorClock(deviceId);
    this.lamportTimestamp = 0;
  }
  
  createMessage(content) {
    this.lamportTimestamp++;
    this.vectorClock.increment(this.deviceId);
    
    return {
      uuid: `${this.deviceId}-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      senderId: this.deviceId,
      content: content,
      timestamp: Date.now(),
      lamportTimestamp: this.lamportTimestamp,
      vectorClock: this.vectorClock.getClock(),
      type: 'text',
      syncStatus: 'pending'
    };
  }
}

// Simulate Connection State Machine
class ConnectionStateMachine {
  constructor() {
    this.state = 'DISCONNECTED';
  }
  
  transition(event) {
    const transitions = {
      'DISCONNECTED': {
        'WIFI_AVAILABLE': 'CONNECTING_WIFI',
        'BLUETOOTH_AVAILABLE': 'CONNECTING_BLUETOOTH'
      },
      'CONNECTING_WIFI': {
        'CONNECTION_SUCCESS': 'CONNECTED_WIFI',
        'CONNECTION_FAILED': 'CONNECTING_BLUETOOTH'
      },
      'CONNECTED_WIFI': {
        'WIFI_UNAVAILABLE': 'SWITCHING'
      },
      'SWITCHING': {
        'CONNECTION_SUCCESS': 'CONNECTED_BLUETOOTH'
      }
    };
    
    const nextState = transitions[this.state]?.[event];
    if (nextState) {
      console.log(`  State: ${this.state} --[${event}]--> ${nextState}`);
      this.state = nextState;
    }
    return this.state;
  }
}

// Demo 1: Message Creation with Vector Clocks
console.log('\n📝 Demo 1: Message Creation with Vector Clocks');
console.log('-'.repeat(60));

const device1 = new MessageSimulator('device-A');
const device2 = new MessageSimulator('device-B');

const msg1 = device1.createMessage('Hello from Device A');
console.log(`\nDevice A sends: "${msg1.content}"`);
console.log(`  UUID: ${msg1.uuid}`);
console.log(`  Lamport: ${msg1.lamportTimestamp}`);
console.log(`  Vector Clock: ${JSON.stringify(msg1.vectorClock)}`);

// Device B receives and merges
device2.vectorClock.merge(msg1.vectorClock);
const msg2 = device2.createMessage('Hi from Device B');
console.log(`\nDevice B sends: "${msg2.content}"`);
console.log(`  UUID: ${msg2.uuid}`);
console.log(`  Lamport: ${msg2.lamportTimestamp}`);
console.log(`  Vector Clock: ${JSON.stringify(msg2.vectorClock)}`);

// Demo 2: Connection State Machine
console.log('\n\n🔄 Demo 2: Network Switching State Machine');
console.log('-'.repeat(60));

const stateMachine = new ConnectionStateMachine();
console.log('\nSimulating network transitions:');
stateMachine.transition('WIFI_AVAILABLE');
stateMachine.transition('CONNECTION_SUCCESS');
console.log('\n  ✓ Connected via WiFi (high speed)');

stateMachine.transition('WIFI_UNAVAILABLE');
console.log('\n  ⚠ WiFi lost, switching to Bluetooth...');
stateMachine.transition('CONNECTION_SUCCESS');
console.log('  ✓ Connected via Bluetooth (offline mode)');

// Demo 3: Conflict Resolution
console.log('\n\n⚔️  Demo 3: Conflict Resolution');
console.log('-'.repeat(60));

const localMsg = {
  uuid: 'msg-123',
  lamportTimestamp: 5,
  vectorClock: { 'device-A': 3, 'device-B': 2 },
  content: 'Local version'
};

const remoteMsg = {
  uuid: 'msg-123',
  lamportTimestamp: 7,
  vectorClock: { 'device-A': 2, 'device-B': 4 },
  content: 'Remote version'
};

console.log('\nConflict detected (same UUID):');
console.log(`  Local:  Lamport=${localMsg.lamportTimestamp}, VC=${JSON.stringify(localMsg.vectorClock)}`);
console.log(`  Remote: Lamport=${remoteMsg.lamportTimestamp}, VC=${JSON.stringify(remoteMsg.vectorClock)}`);

if (remoteMsg.lamportTimestamp > localMsg.lamportTimestamp) {
  console.log('\n  ✓ Resolution: Remote wins (higher Lamport timestamp)');
} else {
  console.log('\n  ✓ Resolution: Local wins (higher Lamport timestamp)');
}

// Demo 4: Performance Comparison
console.log('\n\n⚡ Demo 4: Performance Comparison');
console.log('-'.repeat(60));

const comparison = [
  { transport: 'WiFi LAN', latency: '10ms', throughput: '100 MB/s', users: '50+' },
  { transport: 'Bluetooth', latency: '100ms', throughput: '500 KB/s', users: '7-8' }
];

console.log('\n  Transport    | Latency | Throughput  | Max Users');
console.log('  ' + '-'.repeat(56));
comparison.forEach(c => {
  console.log(`  ${c.transport.padEnd(12)} | ${c.latency.padEnd(7)} | ${c.throughput.padEnd(11)} | ${c.users}`);
});

// Demo 5: System Architecture
console.log('\n\n🏗️  Demo 5: System Architecture');
console.log('-'.repeat(60));

const architecture = {
  'Network Layer': ['WiFi Transport (Socket.io)', 'Bluetooth Transport (BLE)', 'Connection State Machine'],
  'Sync Engine': ['Vector Clocks', 'Lamport Timestamps', 'Conflict Resolution'],
  'Storage': ['SQLite Database', 'Local-First', 'Indexed Queries'],
  'Security': ['AES Encryption', 'SHA-256 Hashing', 'Room Passwords'],
  'Coordination': ['Leader Election', 'Bully Algorithm', 'Admin Roles']
};

for (const [layer, components] of Object.entries(architecture)) {
  console.log(`\n  ${layer}:`);
  components.forEach(c => console.log(`    → ${c}`));
}

// Summary
console.log('\n\n✅ System Summary');
console.log('='.repeat(60));
console.log(`
  ✓ Automatic WiFi/Bluetooth switching
  ✓ Offline-first with local SQLite storage
  ✓ AES encryption for all messages
  ✓ Vector clocks for causality tracking
  ✓ Conflict resolution with Lamport timestamps
  ✓ Leader election using Bully algorithm
  ✓ File transfer with chunking
  ✓ No cloud dependencies
  
  📱 Ready for React Native deployment
  📚 Full documentation in README.md, ARCHITECTURE.md, PERFORMANCE.md
`);

console.log('='.repeat(60));
console.log('\n🚀 To run the full app:');
console.log('   npm start          # Start Expo dev server');
console.log('   npm run android    # Run on Android');
console.log('   npm run ios        # Run on iOS\n');
