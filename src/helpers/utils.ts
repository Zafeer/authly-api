import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';

/**
 * generate hash from password or string
 * @param {string} password
 * @returns {string}
 */
export async function generateHash(password: string): Promise<string> {
  const salt = await bcrypt.genSalt();
  return bcrypt.hash(password, salt);
}

/**
 * validate text with hash
 * @param {string} password
 * @param {string} hash
 * @returns {Promise<boolean>}
 */
export async function validateHash(
  password: string | undefined,
  hash: string | undefined | null,
): Promise<boolean> {
  if (!password || !hash) {
    return Promise.resolve(false);
  }
  return bcrypt.compare(password, hash);
}

export function generateOTP(length: number = 6): string {
  const max = Math.pow(10, length);
  const randomNumber = crypto.randomInt(0, max);
  return randomNumber.toString().padStart(length, '0');
}

export function redactSensitiveFields(body: any, keysToRedact: string[]): any {
  const redactedBody = { ...body };
  keysToRedact.forEach((key) => {
    if (redactedBody[key]) {
      redactedBody[key] = '[REDACTED]';
    }
  });
  return redactedBody;
}
