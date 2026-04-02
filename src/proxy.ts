import { NextRequest, NextResponse } from 'next/server';
import { SESSION_COOKIE_NAME, verifySessionToken } from '@/lib/session';

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  const session = token ? await verifySessionToken(token) : null;

  if (pathname.startsWith('/admin')) {
    if (!session || session.role !== 'admin') {
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }
  }

  if ((pathname === '/auth/login' || pathname === '/auth/signup') && session) {
    const destination = session.role === 'admin' ? '/admin/dashboard' : '/products';
    return NextResponse.redirect(new URL(destination, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/auth/login', '/auth/signup'],
};
