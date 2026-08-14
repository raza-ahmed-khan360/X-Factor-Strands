import { NextResponse, type NextRequest } from 'next/server';
import { updateSession } from '@/utils/supabase/middleware';

export async function proxy(request: NextRequest) {
  // 1. Check for Admin routes protection
  if (request.nextUrl.pathname.startsWith('/x-factor-admin')) {
    // Exclude the login page itself and API routes
    if (
      request.nextUrl.pathname === '/x-factor-admin/login' ||
      request.nextUrl.pathname.startsWith('/api/')
    ) {
      return await updateSession(request);
    }

    const adminToken = request.cookies.get('admin_session')?.value;
    const adminSessionToken = request.cookies.get('admin_session_token')?.value;

    const isAuthorized =
      adminToken === 'authenticated' ||
      adminToken === 'true' ||
      adminSessionToken === 'authenticated_admin_xfactor_2026';

    if (!isAuthorized) {
      const loginUrl = new URL('/x-factor-admin/login', request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  // 2. Default Supabase session update for all other routes
  return await updateSession(request);
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
