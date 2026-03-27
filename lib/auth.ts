import { createHmac, timingSafeEqual } from 'crypto';

/**
 * Signs a session password using HMAC-SHA256.
 * Returns a 64-character hex string (SHA256 digest).
 * @param password - The admin password to sign
 * @param secret - The session secret key
 * @returns Hex-encoded HMAC signature
 */
export function signSession(password: string, secret: string): string {
  return createHmac('sha256', secret).update(password).digest('hex');
}

/**
 * Verifies a session token using timing-safe comparison.
 * Prevents timing attacks by always comparing the full expected vs actual signatures.
 * @param cookieValue - The token from the session cookie
 * @param password - The admin password to verify against
 * @param secret - The session secret key
 * @returns true if the token is valid, false otherwise
 */
export function verifySession(
  cookieValue: string,
  password: string,
  secret: string
): boolean {
  if (!password || !secret) return false;
  const expected = signSession(password, secret);
  // Compare the hex strings as UTF-8 buffers — both are ASCII, fixed 64 chars.
  // Using 'hex' decoding on cookieValue silently drops non-hex chars, which
  // could allow a shorter input to pass timingSafeEqual; utf8 avoids that.
  if (cookieValue.length !== expected.length) return false;
  try {
    return timingSafeEqual(
      Buffer.from(cookieValue, 'utf8'),
      Buffer.from(expected, 'utf8')
    );
  } catch {
    return false;
  }
}
