import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const password = body?.password;
    const envPassword = process.env.ADMIN_PASSWORD || 'GrimReaper654985';

    console.log('[API Admin Login Attempt] Submitted:', password, '| Expected:', envPassword);

    if (password && String(password).trim() === String(envPassword).trim()) {
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ success: false, error: 'Invalid master password' }, { status: 401 });
  } catch (err: any) {
    console.error('API Admin Login Error:', err);
    return NextResponse.json({ success: false, error: err?.message || 'Server error' }, { status: 500 });
  }
}
