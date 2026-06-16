import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { decrypt } from '@/lib/session';

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  
  // Define protected routes
  const isProtectedRoute = path.startsWith('/admin') && path !== '/admin/login';
  const isAuthRoute = path === '/admin/login';

  const cookie = request.cookies.get('session')?.value;
  
  let session = null;
  if (cookie) {
    try {
      session = await decrypt(cookie);
    } catch (e) {
      session = null;
    }
  }

  // Redirect to login if accessing a protected route without a session
  if (isProtectedRoute && !session) {
    return NextResponse.redirect(new URL('/admin/login', request.nextUrl));
  }

  // Redirect to admin dashboard if accessing login page with an active session
  if (isAuthRoute && session) {
    return NextResponse.redirect(new URL('/admin', request.nextUrl));
  }

  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ['/admin/:path*'],
};
