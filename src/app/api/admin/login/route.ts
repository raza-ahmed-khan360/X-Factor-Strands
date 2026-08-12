import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const password = body?.password;
    const envPassword = process.env.ADMIN_PASSWORD || 'GrimReaper654985';

    if (password && String(password).trim() === String(envPassword).trim()) {
      const response = NextResponse.json({ success: true });

      // Set secure HTTP-only cookie (cannot be accessed or stolen by client JS / XSS)
      response.cookies.set('admin_session_token', 'authenticated_admin_xfactor_2026', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 1, // 1 day
      });

      return response;
    }

    return NextResponse.json({ success: false, error: 'Invalid master password' }, { status: 401 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err?.message || 'Server error' }, { status: 500 });
  }
}
