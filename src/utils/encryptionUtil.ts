import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';

const rounds = 10;
const PASSWORD = 'jGSXhcrHkWVNQHr8exdZ';
const IV_LENGTH = 16; // For AES, this is always 16
const ENCRYPTION_KEY = crypto.scryptSync(PASSWORD, 'MyWallet', 32);

export async function hashPassword(password: string) {
  const salt = bcrypt.genSaltSync(rounds);
  return await bcrypt.hash(password, salt);
}

export async function comparePassword(rawPassword: string, passwordHash: string) {
  return await bcrypt.compare(rawPassword, passwordHash);
}


export function encrypt(text: string) {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv);
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return iv.toString('hex') + ':' + encrypted.toString('hex');
}

export function decrypt(text: string) {
  const textParts = text.split(':');
  // @ts-ignore
  const iv = Buffer.from(textParts.shift(), 'hex');
  const encryptedText = Buffer.from(textParts.join(':'), 'hex');
  const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv);
  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
}

function randomString(length: number) {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}
