'use server';

import { sendContactFormEmail, ContactFormParams } from '@/lib/email';
import { sanitizeString, sanitizeEmail } from '@/lib/security';

export async function submitContactFormAction(rawFormData: ContactFormParams) {
  try {
    if (!rawFormData) {
      return { success: false, error: 'Invalid form submission' };
    }

    const email = sanitizeEmail(rawFormData.email);
    const firstName = sanitizeString(rawFormData.firstName, 60);
    const lastName = sanitizeString(rawFormData.lastName, 60);
    const subject = sanitizeString(rawFormData.subject, 120);
    const message = sanitizeString(rawFormData.message, 3000);

    if (!firstName || !email || !message) {
      return { success: false, error: 'First name, email, and message are required.' };
    }

    const cleanData: ContactFormParams = {
      firstName,
      lastName,
      email,
      subject: subject || 'General Enquiry',
      message,
    };

    const res = await sendContactFormEmail(cleanData);
    return res;
  } catch (err: any) {
    console.error('Contact form action error:', err);
    return { success: false, error: err?.message || 'Failed to send message' };
  }
}
