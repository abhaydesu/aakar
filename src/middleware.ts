// src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export const config = {
  matcher: ['/dashboard/:path*', '/recruiter-dashboard/:path*'],
  runtime: 'nodejs',
};

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const publicPaths = ['/', '/signin', '/select-role', '/about', '/contact', '/api', '/_next', '/favicon'];
  if (publicPaths.some(path => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token) {
    return NextResponse.redirect(new URL('/signin', req.url));
  }

  const userRole = (token as any).role || null;

  if (!userRole) {
    return NextResponse.redirect(new URL('/select-role', req.url));
  }

  if (pathname.startsWith('/dashboard') && userRole !== 'user') {
    return NextResponse.redirect(new URL('/recruiter-dashboard', req.url));
  }

  if (pathname.startsWith('/recruiter-dashboard') && userRole !== 'recruiter') {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  return NextResponse.next();
}
