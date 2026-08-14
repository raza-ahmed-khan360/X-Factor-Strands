import { NextResponse } from 'next/server';
import { sendNewsletterSubscriptionEmail } from '@/lib/email';
import { sanitizeEmail } from '@/lib/security';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const rawEmail = body?.email;

    if (!rawEmail) {
      return NextResponse.json({ success: false, error: 'Email is required' }, { status: 400 });
    }

    let cleanEmail = '';
    try {
      cleanEmail = sanitizeEmail(rawEmail);
    } catch {
      return NextResponse.json({ success: false, error: 'Invalid email address format' }, { status: 400 });
    }

    const emailRes = await sendNewsletterSubscriptionEmail(cleanEmail);

    if (!emailRes.success) {
      console.warn('Newsletter subscription email warning:', emailRes.error);
    }

    return NextResponse.json({ success: true, email: cleanEmail });
  } catch (err: any) {
    console.error('Newsletter API error:', err);
    return NextResponse.json({ success: false, error: err?.message || 'Internal server error' }, { status: 500 });
  }
}
