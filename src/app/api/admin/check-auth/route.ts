import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const cookieStore = await cookies();
    const cookieToken = cookieStore.get('admin_session_token')?.value;
    const authHeader = request.headers.get('Authorization')?.replace('Bearer ', '');

    if (
      cookieToken === 'authenticated_admin_xfactor_2026' ||
      authHeader === 'authenticated_admin_xfactor_2026'
    ) {
      return NextResponse.json(
        { authenticated: true },
        { headers: { 'Cache-Control': 'no-store, no-cache, max-age=0' } }
      );
    }

    return NextResponse.json(
      { authenticated: false },
      { status: 401, headers: { 'Cache-Control': 'no-store, no-cache, max-age=0' } }
    );
  } catch (e: any) {
    return NextResponse.json({ authenticated: false, error: e?.message }, { status: 401 });
  }
}
