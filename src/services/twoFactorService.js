import speakeasy from 'speakeasy';
import QRCode from 'qrcode';

class TwoFactorService {
  constructor() {
    this.storageKey = 'gameswap_2fa_data';
  }

  generateSecret(userEmail) {
    const secret = speakeasy.generateSecret({
      name: `GameSwap (${userEmail})`,
      issuer: 'GameSwap',
      length: 20
    });
    this.saveToStorage({
      secret: secret.base32,
      otpauth_url: secret.otpauth_url
    });
    return secret;
  }

  async generateQRCode(otpauthUrl) {
    try {
      return await QRCode.toDataURL(otpauthUrl);
    } catch (error) {
      console.error('Erro ao gerar QR Code:', error);
      return null;
    }
  }

  verifyToken(token) {
    const storedData = this.getFromStorage();
    if (!storedData || !storedData.secret) {
      return false;
    }
    return speakeasy.totp.verify({
      secret: storedData.secret,
      encoding: 'base32',
      token: token,
      window: 2
    });
  }

  generateBackupCodes() {
    const codes = [];
    for (let i = 0; i < 10; i++) {
      codes.push(Math.random().toString(36).substr(2, 8).toUpperCase());
    }
    const storedData = this.getFromStorage();
    this.saveToStorage({
      ...storedData,
      backupCodes: codes
    });
    return codes;
  }

  verifyBackupCode(code) {
    const storedData = this.getFromStorage();
    if (!storedData || !storedData.backupCodes) {
      return false;
    }
    const isValid = storedData.backupCodes.includes(code);
    if (isValid) {
      const updatedCodes = storedData.backupCodes.filter(c => c !== code);
      this.saveToStorage({
        ...storedData,
        backupCodes: updatedCodes
      });
    }
    return isValid;
  }

  activate2FA() {
    const storedData = this.getFromStorage();
    this.saveToStorage({
      ...storedData,
      enabled: true
    });
  }

  is2FAEnabled() {
    const storedData = this.getFromStorage();
    return storedData && storedData.enabled;
  }

  disable2FA() {
    localStorage.removeItem(this.storageKey);
  }

  saveToStorage(data) {
    localStorage.setItem(this.storageKey, JSON.stringify(data));
  }

  getFromStorage() {
    const data = localStorage.getItem(this.storageKey);
    return data ? JSON.parse(data) : null;
  }

  async simulateNetworkDelay(ms = 1000) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export default new TwoFactorService(); 