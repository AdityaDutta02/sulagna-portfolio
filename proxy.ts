import { NextRequest, NextResponse } from 'next/server';
import { createHmac, timingSafeEqual } from 'crypto';

/**
 * Verifies the admin session cookie inline (no external imports) for edge runtime compatibility.
 * Uses timing-safe comparison to prevent timing attacks.
 */
function verifySessionCookie(cookieValue: string): boolean {
  const password = process.env.ADMIN_PASSWORD;
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!password || !secret) return false;
  const expected = createHmac('sha256', secret).update(password).digest('hex');
  try {
    return timingSafeEqual(Buffer.from(cookieValue, 'hex'), Buffer.from(expected, 'hex'));
  } catch {
    return false;
  }
}

export function proxy(request: NextRequest): NextResponse {
  const { pathname } = request.nextUrl;

  // Allow login page through unconditionally
  if (pathname === '/admin/login') return NextResponse.next();

  const sessionCookie = request.cookies.get('admin-session')?.value ?? '';
  if (!verifySessionCookie(sessionCookie)) {
    return NextResponse.redirect(new URL('/admin/login', request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
  runtime: 'nodejs',
};
