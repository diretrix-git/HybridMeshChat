import * as FileSystem from 'expo-file-system';
import { EncryptionService } from '../core/crypto/EncryptionService';

const CHUNK_SIZE = 512; // bytes

export class FileTransfer {
  static async chunkFile(filePath: string, encryptionKey: string): Promise<string[]> {
    const fileContent = await FileSystem.readAsStringAsync(filePath, {
      encoding: FileSystem.EncodingType.Base64,
    });
    const chunks: string[] = [];

    for (let i = 0; i < fileContent.length; i += CHUNK_SIZE) {
      const chunk = fileContent.slice(i, i + CHUNK_SIZE);
      const encrypted = EncryptionService.encrypt(chunk, encryptionKey);
      chunks.push(encrypted);
    }

    return chunks;
  }

  static async reconstructFile(
    chunks: string[],
    outputPath: string,
    encryptionKey: string
  ): Promise<void> {
    let fileContent = '';

    for (const chunk of chunks) {
      const decrypted = EncryptionService.decrypt(chunk, encryptionKey);
      fileContent += decrypted;
    }

    await FileSystem.writeAsStringAsync(outputPath, fileContent, {
      encoding: FileSystem.EncodingType.Base64,
    });
  }

  static async saveImage(base64Data: string, fileName: string): Promise<string> {
    const path = `${FileSystem.documentDirectory}${fileName}`;
    await FileSystem.writeAsStringAsync(path, base64Data, {
      encoding: FileSystem.EncodingType.Base64,
    });
    return path;
  }

  static async loadImage(filePath: string): Promise<string> {
    return await FileSystem.readAsStringAsync(filePath, {
      encoding: FileSystem.EncodingType.Base64,
    });
  }

  static async deleteFile(filePath: string): Promise<void> {
    const info = await FileSystem.getInfoAsync(filePath);
    if (info.exists) {
      await FileSystem.deleteAsync(filePath);
    }
  }
}
