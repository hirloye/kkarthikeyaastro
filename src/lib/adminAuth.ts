import crypto from 'crypto';

const ADMIN_SECRET = process.env.ADMIN_AUTH_SECRET || 'astro_secure_planetary_secret_2026';
export const EXPECTED_ADMIN_USER = process.env.ADMIN_USERNAME || 'kkarthikeya';
export const EXPECTED_ADMIN_PASS = process.env.ADMIN_PASSWORD || 'astrotalk2026@';

export function createAdminToken(username: string): string {
  const timestamp = Date.now();
  const payload = `${username}:${timestamp}`;
  const hmac = crypto.createHmac('sha256', ADMIN_SECRET).update(payload).digest('hex');
  return Buffer.from(`${payload}:${hmac}`).toString('base64');
}

export function verifyAdminToken(token: string | null): boolean {
  if (!token) return false;
  try {
    const decoded = Buffer.from(token, 'base64').toString('utf8');
    const [username, timestampStr, hmac] = decoded.split(':');
    if (!username || !timestampStr || !hmac) return false;

    // Check if username matches
    if (username !== EXPECTED_ADMIN_USER) return false;

    // Check expiry (7 days)
    const timestamp = parseInt(timestampStr, 10);
    if (isNaN(timestamp) || Date.now() - timestamp > 7 * 24 * 60 * 60 * 1000) {
      return false;
    }

    const expectedHmac = crypto.createHmac('sha256', ADMIN_SECRET).update(`${username}:${timestampStr}`).digest('hex');
    return crypto.timingSafeEqual(Buffer.from(hmac), Buffer.from(expectedHmac));
  } catch {
    return false;
  }
}
