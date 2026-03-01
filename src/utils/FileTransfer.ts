import RNFS from 'react-native-fs';
import { EncryptionService } from '../core/crypto/EncryptionService';

const CHUNK_SIZE = 512; // bytes

export class FileTransfer {
  static async chunkFile(filePath: string, encryptionKey: string): Promise<string[]> {
    const fileContent = await RNFS.readFile(filePath, 'base64');
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

    await RNFS.writeFile(outputPath, fileContent, 'base64');
  }

  static async saveImage(base64Data: string, fileName: string): Promise<string> {
    const path = `${RNFS.DocumentDirectoryPath}/${fileName}`;
    await RNFS.writeFile(path, base64Data, 'base64');
    return path;
  }

  static async loadImage(filePath: string): Promise<string> {
    return await RNFS.readFile(filePath, 'base64');
  }

  static async deleteFile(filePath: string): Promise<void> {
    const exists = await RNFS.exists(filePath);
    if (exists) {
      await RNFS.unlink(filePath);
    }
  }
}
