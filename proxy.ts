import { NextRequest, NextResponse } from 'next/server';
import { verifySession } from './lib/auth';

export const config = {
  matcher: ['/admin/:path*'],
  runtime: 'nodejs',
};

export function proxy(request: NextRequest): NextResponse {
  const { pathname } = request.nextUrl;

  // Allow login page through unconditionally
  if (pathname === '/admin/login') return NextResponse.next();

  const password = process.env.ADMIN_PASSWORD ?? '';
  const secret = process.env.ADMIN_SESSION_SECRET ?? '';
  const sessionCookie = request.cookies.get('admin-session')?.value ?? '';

  if (!verifySession(sessionCookie, password, secret)) {
    return NextResponse.redirect(new URL('/admin/login', request.url));
  }
  return NextResponse.next();
}
