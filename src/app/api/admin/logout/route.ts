import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST() {
  const response = NextResponse.json({ success: true }, {
    headers: { 'Cache-Control': 'no-store, no-cache, max-age=0' },
  });
  response.cookies.set('admin_session', '', { path: '/', maxAge: 0 });
  response.cookies.set('admin_session_token', '', { path: '/', maxAge: 0 });
  return response;
}
