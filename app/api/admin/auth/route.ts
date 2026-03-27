import { timingSafeEqual } from 'crypto';
import { NextRequest, NextResponse } from 'next/server';
import { signSession } from '@/lib/auth';

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict' as const,
  path: '/',
};

export async function POST(request: NextRequest): Promise<NextResponse> {
  const action = request.nextUrl.searchParams.get('action');

  if (action === 'logout') {
    const res = NextResponse.json({ ok: true });
    res.cookies.set('admin-session', '', { ...COOKIE_OPTIONS, maxAge: 0 });
    return res;
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const submitted =
    typeof body === 'object' && body !== null
      ? (body as Record<string, unknown>)['password']
      : undefined;

  const adminPassword = process.env.ADMIN_PASSWORD;
  if (typeof submitted !== 'string' || !adminPassword) {
    return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
  }
  const submittedBuf = Buffer.from(submitted, 'utf8');
  const passwordBuf = Buffer.from(adminPassword, 'utf8');
  let passwordMatches = false;
  if (submittedBuf.length === passwordBuf.length) {
    try {
      passwordMatches = timingSafeEqual(submittedBuf, passwordBuf);
    } catch {
      passwordMatches = false;
    }
  }
  if (!passwordMatches) {
    return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
  }

  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret) {
    return NextResponse.json({ error: 'Auth not configured' }, { status: 500 });
  }

  const token = signSession(submitted, secret);
  const res = NextResponse.json({ ok: true });
  res.cookies.set('admin-session', token, COOKIE_OPTIONS);
  return res;
}
