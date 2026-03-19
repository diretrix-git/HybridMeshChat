import React, { useState } from 'react';
import { View, StyleSheet, Button } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { CameraView, useCameraPermissions } from 'expo-camera';

interface RoomInvite {
  roomId: string;
  serverUrl: string;
  encryptionKey: string;
}

export const QRJoinScreen: React.FC = () => {
  const [mode, setMode] = useState<'generate' | 'scan'>('generate');
  const [permission, requestPermission] = useCameraPermissions();
  const [roomData] = useState<RoomInvite>({
    roomId: 'room-123',
    serverUrl: 'http://192.168.1.100:3000',
    encryptionKey: 'generated-key',
  });

  const handleBarCodeScanned = ({ data }: { data: string }) => {
    try {
      const parsed: RoomInvite = JSON.parse(data);
      console.log('Scanned room:', parsed);
      // Navigate to join room with data
    } catch (error) {
      console.error('Invalid QR code');
    }
  };

  const handleScanMode = async () => {
    if (!permission?.granted) {
      await requestPermission();
    }
    setMode('scan');
  };

  return (
    <View style={styles.container}>
      {mode === 'generate' ? (
        <View style={styles.qrContainer}>
          <QRCode value={JSON.stringify(roomData)} size={250} />
          <Button title="Scan Instead" onPress={handleScanMode} />
        </View>
      ) : (
        <View style={styles.scanContainer}>
          <CameraView
            style={styles.camera}
            onBarcodeScanned={handleBarCodeScanned}
            barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
          />
          <Button title="Generate Instead" onPress={() => setMode('generate')} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  qrContainer: { alignItems: 'center', gap: 20 },
  scanContainer: { flex: 1, width: '100%' },
  camera: { flex: 1 },
});
