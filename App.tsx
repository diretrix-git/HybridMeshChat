import React, { useState } from 'react';
import { View, Text, StyleSheet, Button, TextInput, FlatList, Alert, ScrollView } from 'react-native';

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
    Alert.alert('Connected!', 'Ready to chat in offline mode');
    
    setMessages([
      {
        id: '1',
        senderId: 'system',
        content: 'Welcome to HybridMeshChat!',
        timestamp: Date.now(),
      },
      {
        id: '2',
        senderId: 'system',
        content: 'This is a simplified version for testing the build.',
        timestamp: Date.now() + 1000,
      },
      {
        id: '3',
        senderId: 'system',
        content: 'Full WiFi/Bluetooth features will be added after successful build.',
        timestamp: Date.now() + 2000,
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
  };

  const renderMessage = ({ item }: { item: any }) => (
    <View style={[
      styles.messageBubble,
      item.senderId === deviceId ? styles.myMessage : styles.otherMessage
    ]}>
      <Text style={styles.senderText}>
        {item.senderId === 'system' ? 'System' : 
         item.senderId === deviceId ? 'You' : 
         item.senderId.substring(0, 10)}
      </Text>
      <Text style={styles.messageText}>{item.content}</Text>
      <Text style={styles.timestampText}>
        {new Date(item.timestamp).toLocaleTimeString()}
      </Text>
    </View>
  );

  if (!connected) {
    return (
      <ScrollView style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.title}>🔗 HybridMeshChat</Text>
          <Text style={styles.subtitle}>Offline-First P2P Messaging</Text>
          <Text style={styles.versionLabel}>v1.0 - Build Test</Text>
          
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

            <View style={styles.buttonContainer}>
              <Button title="Connect to Room" onPress={handleConnect} color="#667eea" />
            </View>
          </View>

          <View style={styles.infoBox}>
            <Text style={styles.infoTitle}>📱 Build Status</Text>
            <Text style={styles.infoText}>✅ Native Android app</Text>
            <Text style={styles.infoText}>✅ UI working</Text>
            <Text style={styles.infoText}>✅ Ready for testing</Text>
            <Text style={styles.infoText}>Device ID: {deviceId}</Text>
          </View>

          <View style={styles.noteBox}>
            <Text style={styles.noteTitle}>📝 Note:</Text>
            <Text style={styles.noteText}>
              This is a simplified version to test the build process.
              Full features (WiFi, Bluetooth, encryption, etc.) will be
              added after confirming the build works successfully.
            </Text>
          </View>
        </View>
      </ScrollView>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Room: {roomId}</Text>
          <Text style={styles.headerSubtitle}>Device: {deviceId.substring(0, 10)}</Text>
        </View>
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
        <Button title="Send" onPress={handleSendMessage} color="#667eea" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    padding: 20,
    paddingTop: 50,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: '#667eea',
  },
  subtitle: {
    fontSize: 18,
    textAlign: 'center',
    color: '#666',
    marginBottom: 5,
  },
  versionLabel: {
    fontSize: 12,
    textAlign: 'center',
    color: '#28a745',
    fontWeight: 'bold',
    backgroundColor: '#d4edda',
    paddingVertical: 5,
    marginBottom: 20,
    borderRadius: 4,
  },
  form: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 15,
    marginBottom: 5,
    color: '#333',
  },
  input: {
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    fontSize: 16,
  },
  buttonContainer: {
    marginTop: 20,
  },
  infoBox: {
    backgroundColor: '#e3f2fd',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#1976d2',
  },
  infoText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 5,
  },
  noteBox: {
    backgroundColor: '#fff3cd',
    padding: 15,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#ffc107',
  },
  noteTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#856404',
  },
  noteText: {
    fontSize: 13,
    color: '#856404',
    lineHeight: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    paddingTop: 50,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
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
    borderWidth: 1,
    borderColor: '#ddd',
  },
  senderText: {
    fontSize: 10,
    opacity: 0.7,
    marginBottom: 4,
    color: '#fff',
  },
  messageText: {
    fontSize: 16,
    color: '#fff',
  },
  timestampText: {
    fontSize: 10,
    opacity: 0.6,
    marginTop: 4,
    color: '#fff',
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
    fontSize: 16,
  },
});
