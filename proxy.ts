import { NextRequest, NextResponse } from 'next/server';
import { verifySession } from './lib/auth';

export function proxy(request: NextRequest): NextResponse {
  const { pathname } = request.nextUrl;

  // Only guard /admin/* routes
  if (!pathname.startsWith('/admin')) return NextResponse.next();

  // Allow login page through unconditionally
  if (pathname === '/admin/login') return NextResponse.next();

  const password = process.env.ADMIN_PASSWORD;
  const secret = process.env.ADMIN_SESSION_SECRET;
  const sessionCookie = request.cookies.get('admin-session')?.value ?? '';

  // Fail closed: reject if env vars missing or session invalid
  if (!password || !secret || !verifySession(sessionCookie, password, secret)) {
    return NextResponse.redirect(new URL('/admin/login', request.url));
  }
  return NextResponse.next();
}

export const config = { matcher: ['/admin/:path*'] };
