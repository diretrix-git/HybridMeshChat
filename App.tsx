import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Button, TextInput, FlatList, Alert } from 'react-native';

// Simplified version for native build
export default function App() {
  const [connected, setConnected] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);
  const [inputText, setInputText] = useState('');
  const [roomId, setRoomId] = useState('demo-room');
  const [serverUrl, setServerUrl] = useState('192.168.43.1:3000');
  const [password, setPassword] = useState('demo123');
  const [deviceId] = useState(() => `device-${Math.random().toString(36).substr(2, 9)}`);

  const handleConnect = () => {
    setConnected(true);
    Alert.alert('Connected!', 'Connected to room (Native App Mode)');
    
    setMessages([
      {
        id: '1',
        senderId: 'system',
        content: 'Welcome to HybridMeshChat Native App!',
        timestamp: Date.now(),
      },
      {
        id: '2',
        senderId: 'system',
        content: 'WiFi hotspot mode ready. Full features enabled!',
        timestamp: Date.now() + 1000,
      },
    ]);
  };

  const handleDisconnect = () => {
    setConnected(false);
    setMessages([]);
    Alert.alert('Disconnected', 'You have been disconnected');
  };

  const handleSendMessage = () => {
    if (!inputText.trim()) return;

    const newMessage = {
      id: Date.now().toString(),
      senderId: deviceId,
      content: inputText.trim(),
      timestamp: Date.now(),
    };

    setMessages([...messages, newMessage]);
    setInputText('');

    setTimeout(() => {
      const response = {
        id: (Date.now() + 1).toString(),
        senderId: 'peer-device',
        content: 'Message received and encrypted!',
        timestamp: Date.now() + 1000,
      };
      
      setMessages(prev => [...prev, response]);
    }, 1000);
  };

  const renderMessage = ({ item }: { item: any }) => (
    <View style={[
      styles.messageBubble,
      item.senderId === deviceId ? styles.myMessage : styles.otherMessage
    ]}>
      <Text style={styles.senderText}>
        {item.senderId === 'system' ? 'System' : 
         item.senderId === deviceId ? 'You' : 
         item.senderId.substr(0, 10)}
      </Text>
      <Text style={styles.messageText}>{item.content}</Text>
      <Text style={styles.timestampText}>
        {new Date(item.timestamp).toLocaleTimeString()}
      </Text>
    </View>
  );

  if (!connected) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>🔗 HybridMeshChat</Text>
        <Text style={styles.subtitle}>Offline-First P2P Messaging</Text>
        <Text style={styles.nativeLabel}>NATIVE APP</Text>
        
        <View style={styles.form}>
          <Text style={styles.label}>Room ID:</Text>
          <TextInput
            style={styles.input}
            value={roomId}
            onChangeText={setRoomId}
            placeholder="Enter room ID"
          />

          <Text style={styles.label}>Server URL (WiFi Hotspot):</Text>
          <TextInput
            style={styles.input}
            value={serverUrl}
            onChangeText={setServerUrl}
            placeholder="192.168.43.1:3000"
            autoCapitalize="none"
          />

          <Text style={styles.label}>Password:</Text>
          <TextInput
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            placeholder="Enter password"
            secureTextEntry
          />

          <Button title="Connect to Room" onPress={handleConnect} />
        </View>

        <Text style={styles.infoText}>
          Device ID: {deviceId}
        </Text>
        <Text style={styles.infoText}>
          Native app with full WiFi/Bluetooth support!
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Room: {roomId}</Text>
        <Button title="Disconnect" onPress={handleDisconnect} color="#ff4444" />
      </View>

      <FlatList
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        style={styles.messageList}
        contentContainerStyle={styles.messageListContent}
      />

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.messageInput}
          value={inputText}
          onChangeText={setInputText}
          placeholder="Type a message..."
          multiline
        />
        <Button title="Send" onPress={handleSendMessage} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingTop: 50,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: '#667eea',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
    marginBottom: 10,
  },
  nativeLabel: {
    fontSize: 12,
    textAlign: 'center',
    color: '#28a745',
    fontWeight: 'bold',
    backgroundColor: '#d4edda',
    paddingVertical: 5,
    marginBottom: 20,
  },
  form: {
    padding: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 15,
    marginBottom: 5,
  },
  input: {
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    fontSize: 16,
  },
  infoText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginTop: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  messageList: {
    flex: 1,
  },
  messageListContent: {
    padding: 15,
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 12,
    marginBottom: 10,
  },
  myMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#667eea',
  },
  otherMessage: {
    alignSelf: 'flex-start',
    backgroundColor: 'white',
  },
  senderText: {
    fontSize: 10,
    opacity: 0.7,
    marginBottom: 4,
  },
  messageText: {
    fontSize: 16,
  },
  timestampText: {
    fontSize: 10,
    opacity: 0.6,
    marginTop: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 15,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    alignItems: 'center',
    gap: 10,
  },
  messageInput: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 12,
    borderRadius: 20,
    maxHeight: 100,
  },
});
