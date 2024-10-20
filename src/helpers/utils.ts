import * as bcrypt from 'bcrypt';

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

export function generateOTP(length: number): string {
  const characters = '0123456789';

  let otp = '';
  for (let o = 0; o < length; o++) {
    const getRandomIndex = Math.floor(Math.random() * characters.length);
    otp += characters[getRandomIndex];
  }

  return otp;
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
