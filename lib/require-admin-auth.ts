import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { verifySession } from './auth';

/**
 * Guards an API route handler by verifying the admin session cookie.
 * Returns a NextResponse error if auth fails, or null if auth passes.
 * Usage: const authError = await requireAdminAuth(); if (authError) return authError;
 */
export async function requireAdminAuth(): Promise<NextResponse | null> {
  const password = process.env.ADMIN_PASSWORD;
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!password || !secret) {
    return NextResponse.json({ error: 'Auth not configured' }, { status: 500 });
  }
  const cookieStore = await cookies();
  const session = cookieStore.get('admin-session')?.value ?? '';
  if (!verifySession(session, password, secret)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  return null;
}
