import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(req: NextRequest) {
  const secret = process.env.NEXTAUTH_SECRET;
  const token = await getToken({ 
    req, 
    secret
  });
  const { pathname } = req.nextUrl;

  // Paths requiring user session
  const isCustomerProtected = 
    pathname.startsWith('/customer/account') ||
    pathname.startsWith('/customer/bookings') ||
    pathname.startsWith('/customer/messages') ||
    pathname.startsWith('/customer/notifications') ||
    pathname.startsWith('/customer/settings');

  const isDashboardProtected = 
    pathname.startsWith('/manager') || 
    pathname.startsWith('/captain') || 
    pathname.startsWith('/superadmin');

  if ((isDashboardProtected || isCustomerProtected) && !token) {
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
    '/superadmin/:path*',
    '/customer/account/:path*',
    '/customer/bookings/:path*',
    '/customer/messages/:path*',
    '/customer/notifications/:path*',
    '/customer/settings/:path*'
  ]
};

