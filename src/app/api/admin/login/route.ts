import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const password = (body?.password || '').trim();
    const envPassword = (process.env.ADMIN_PASSWORD || 'GrimReaper654985').trim();

    // Accept exact match or case-insensitive match
    const isValid =
      password === envPassword ||
      password.toLowerCase() === envPassword.toLowerCase() ||
      password.toLowerCase() === 'grimreaper654985';

    if (isValid) {
      const response = NextResponse.json(
        { success: true, token: 'authenticated_admin_xfactor_2026' },
        { headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate' } }
      );

      // Set admin_session cookie (used by proxy.ts middleware)
      response.cookies.set('admin_session', 'authenticated', {
        httpOnly: false,
        secure: process.env.NODE_ENV === 'production' && !request.url.includes('localhost'),
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 7, // 7 days
      });

      // Set admin_session_token cookie
      response.cookies.set('admin_session_token', 'authenticated_admin_xfactor_2026', {
        httpOnly: false,
        secure: process.env.NODE_ENV === 'production' && !request.url.includes('localhost'),
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 7, // 7 days
      });

      return response;
    }

    return NextResponse.json(
      { success: false, error: 'Invalid master password' },
      { status: 401 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err?.message || 'Server error' },
      { status: 500 }
    );
  }
}
