import { NextResponse, type NextRequest } from 'next/server'
import { updateSession } from '@/utils/supabase/middleware'

export async function proxy(request: NextRequest) {
  // 1. Check for Admin routes protection
  if (request.nextUrl.pathname.startsWith('/x-factor-admin')) {
    // Exclude the login page itself
    if (request.nextUrl.pathname === '/x-factor-admin/login') {
      return await updateSession(request)
    }

    const adminToken = request.cookies.get('admin_session');

    if (!adminToken || adminToken.value !== 'authenticated') {
      const loginUrl = new URL('/x-factor-admin/login', request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  // 2. Default Supabase session update for all other routes
  return await updateSession(request)
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
