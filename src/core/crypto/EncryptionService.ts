import CryptoJS from 'crypto-js';

export class EncryptionService {
  static encrypt(content: string, key: string): string {
    return CryptoJS.AES.encrypt(content, key).toString();
  }

  static decrypt(encryptedContent: string, key: string): string {
    const bytes = CryptoJS.AES.decrypt(encryptedContent, key);
    return bytes.toString(CryptoJS.enc.Utf8);
  }

  static hashPassword(password: string): string {
    return CryptoJS.SHA256(password).toString();
  }

  static generateRoomKey(): string {
    return CryptoJS.lib.WordArray.random(32).toString();
  }

  static verifyPassword(password: string, hash: string): boolean {
    return this.hashPassword(password) === hash;
  }
}
