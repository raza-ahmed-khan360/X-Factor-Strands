'use server';

import { sendContactFormEmail, ContactFormParams } from '@/lib/email';

export async function submitContactFormAction(formData: ContactFormParams) {
  try {
    const res = await sendContactFormEmail(formData);
    return res;
  } catch (err: any) {
    console.error('Contact form action error:', err);
    return { success: false, error: err?.message || 'Failed to send message' };
  }
}
