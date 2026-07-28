import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(req: NextRequest) {
  const token = await getToken({ 
    req, 
    secret: process.env.NEXTAUTH_SECRET || 'd3c1a967f62d854ea0134bc57b290dfc' 
  });
  const { pathname } = req.nextUrl;

  const isProtectedDashboard = 
    pathname.startsWith('/manager') || 
    pathname.startsWith('/captain') || 
    pathname.startsWith('/superadmin');

  if (isProtectedDashboard && !token) {
    const loginUrl = new URL('/login', req.url);
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (token) {
    const role = token.role as string;

    if (pathname.startsWith('/superadmin') && role !== 'superadmin') {
      return NextResponse.redirect(new URL('/login', req.url));
    }
    if (pathname.startsWith('/captain') && role !== 'captain' && role !== 'superadmin') {
      return NextResponse.redirect(new URL('/login', req.url));
    }
    if (pathname.startsWith('/manager') && role !== 'owner' && role !== 'manager' && role !== 'superadmin') {
      return NextResponse.redirect(new URL('/login', req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/manager/:path*',
    '/captain/:path*',
    '/superadmin/:path*'
  ]
};
