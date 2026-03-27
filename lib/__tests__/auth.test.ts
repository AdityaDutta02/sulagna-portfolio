// @vitest-environment node

import { describe, it, expect } from 'vitest';
import { signSession, verifySession } from '../auth';

describe('signSession', () => {
  it('returns a 64-character hex string', () => {
    const token = signSession('mypassword', 'mysecret');
    expect(token).toHaveLength(64);
    expect(token).toMatch(/^[0-9a-f]+$/);
  });

  it('is deterministic for the same inputs', () => {
    expect(signSession('pw', 'sec')).toBe(signSession('pw', 'sec'));
  });

  it('differs when password changes', () => {
    expect(signSession('pw1', 'sec')).not.toBe(signSession('pw2', 'sec'));
  });

  it('differs when secret changes', () => {
    expect(signSession('pw', 'sec1')).not.toBe(signSession('pw', 'sec2'));
  });
});

describe('verifySession', () => {
  it('returns true for a valid session token', () => {
    const token = signSession('pw', 'sec');
    expect(verifySession(token, 'pw', 'sec')).toBe(true);
  });

  it('returns false for a wrong token', () => {
    expect(verifySession('0'.repeat(64), 'pw', 'sec')).toBe(false);
  });

  it('returns false for the wrong password', () => {
    const token = signSession('pw', 'sec');
    expect(verifySession(token, 'wrongpw', 'sec')).toBe(false);
  });

  it('returns false for an empty string', () => {
    expect(verifySession('', 'pw', 'sec')).toBe(false);
  });

  it('returns false when verified with the wrong secret', () => {
    const token = signSession('pw', 'sec');
    expect(verifySession(token, 'pw', 'wrongsec')).toBe(false);
  });

  it('returns false for a non-hex 64-character string', () => {
    expect(verifySession('z'.repeat(64), 'pw', 'sec')).toBe(false);
  });
});
