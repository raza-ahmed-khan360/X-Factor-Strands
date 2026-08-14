import nodemailer from 'nodemailer';
import { escapeHtml } from '@/lib/security';

export interface EmailParams {
  orderNumber: string;
  customerEmail: string;
  customerName: string;
  status: 'pending' | 'confirmed' | 'on_its_way' | 'delivered' | 'cancelled';
  totalAmount?: number;
  paymentMethod?: string;
  items?: { name: string; size: string; quantity: number; price: number }[];
}

export interface AdminAlertParams {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: string;
  city: string;
  postalCode: string;
  totalAmount: number;
  paymentMethod?: string;
  items: { name: string; size: string; quantity: number; price: number }[];
}

export interface PaymentProofAlertParams {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  paymentMethod: string;
  proofUrl: string;
  transactionId?: string;
  senderName?: string;
  totalAmount: number;
}

export interface ContactFormParams {
  firstName: string;
  lastName: string;
  email: string;
  subject: string;
  message: string;
}

export async function sendOrderStatusEmail(params: EmailParams) {
  const { orderNumber, customerEmail, customerName, status, totalAmount, paymentMethod, items } = params;

  const smtpHost = process.env.SMTP_HOST || 'smtp.hostinger.com';
  const smtpPort = Number(process.env.SMTP_PORT) || 465;
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASSWORD;
  const resendApiKey = process.env.RESEND_API_KEY;

  const pMethod = paymentMethod || 'Cash App / Venmo / Zelle';

  let subject = '';
  let heading = '';
  let message = '';
  let badgeColor = '#3b82f6'; // blue

  switch (status) {
    case 'pending':
      subject = `Order Placed: ${orderNumber} (Pending Payment Verification)`;
      heading = 'Your Order Has Been Created';
      message = `Thank you for ordering with X-Factor Peptides! Your order has been registered under payment method <b>${pMethod}</b>. Please ensure you have completed payment and uploaded your payment receipt screenshot on the confirmation page so our team can verify and process your shipment.`;
      badgeColor = '#f59e0b'; // amber
      break;

    case 'confirmed':
      subject = `Payment Verified & Order Confirmed: ${orderNumber} - X-Factor Peptides`;
      heading = 'Payment Verified & Order Confirmed!';
      message = `Great news! Your payment proof for order <b>${orderNumber}</b> has been verified by our team. Your research peptides are now being packaged and prepared for immediate dispatch.`;
      badgeColor = '#10b981'; // green
      break;

    case 'on_its_way':
      subject = `Order Dispatched: ${orderNumber} is On Its Way!`;
      heading = 'Your Order Has Been Dispatched!';
      message = `Your package for order <b>${orderNumber}</b> has been handed over to our express courier partner and is on its way to your specified delivery address.`;
      badgeColor = '#8b5cf6'; // purple
      break;

    case 'delivered':
      subject = `Order Delivered: ${orderNumber} - X-Factor Peptides`;
      heading = 'Your Order Has Been Delivered!';
      message = `Your research peptides order <b>${orderNumber}</b> has been successfully delivered. Thank you for choosing X-Factor Peptides!`;
      badgeColor = '#059669'; // emerald
      break;

    case 'cancelled':
      subject = `Order Cancellation Notice: ${orderNumber}`;
      heading = 'Your Order Has Been Cancelled';
      message = `Your order <b>${orderNumber}</b> has been cancelled. If you believe this was in error or need assistance, please contact support.`;
      badgeColor = '#ef4444'; // red
      break;
  }

  const itemsHtml = (items || [])
    .map(
      (item) => `
        <tr style="border-bottom: 1px solid #1e293b;">
          <td style="padding: 12px 0; color: #f8fafc; font-size: 14px;">
            <b>${item.name}</b> <span style="color: #94a3b8; font-size: 12px;">(${item.size})</span>
          </td>
          <td style="padding: 12px 0; text-align: center; color: #94a3b8; font-size: 14px;">x${item.quantity}</td>
          <td style="padding: 12px 0; text-align: right; color: #38bdf8; font-weight: bold; font-size: 14px;">$${(item.price * item.quantity).toFixed(2)}</td>
        </tr>
      `
    )
    .join('');

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>${subject}</title>
      </head>
      <body style="background-color: #0b0f19; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; margin: 0; padding: 40px 20px; color: #f8fafc;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #0f172a; border: 1px solid #1e293b; border-radius: 16px; overflow: hidden; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5);">
          <!-- Header -->
          <div style="background-color: #030712; padding: 24px; text-align: center; border-bottom: 1px solid #1e293b;">
            <h1 style="color: #38bdf8; margin: 0; font-size: 24px; letter-spacing: 1px; font-weight: 800;">X-FACTOR PEPTIDES</h1>
            <p style="color: #64748b; font-size: 11px; margin-top: 4px; text-transform: uppercase; letter-spacing: 1px;">Research Use Only</p>
          </div>

          <!-- Body -->
          <div style="padding: 32px 24px;">
            <div style="display: inline-block; background-color: ${badgeColor}20; border: 1px solid ${badgeColor}40; color: ${badgeColor}; padding: 6px 12px; border-radius: 9999px; font-size: 12px; font-weight: 700; text-transform: uppercase; margin-bottom: 16px;">
              Status: ${status.replace(/_/g, ' ')}
            </div>

            <h2 style="color: #ffffff; font-size: 22px; margin-top: 0; margin-bottom: 12px;">Hi ${customerName},</h2>
            <p style="color: #94a3b8; font-size: 15px; line-height: 1.6; margin-bottom: 24px;">
              ${message}
            </p>

            <!-- Order Box -->
            <div style="background-color: #030712; border: 1px solid #1e293b; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="color: #64748b; font-size: 12px; text-transform: uppercase;">Order Number</td>
                  <td style="text-align: right; color: #f8fafc; font-weight: bold; font-family: monospace; font-size: 16px;">${orderNumber}</td>
                </tr>
                <tr>
                  <td style="color: #64748b; font-size: 12px; text-transform: uppercase; padding-top: 8px;">Payment Option</td>
                  <td style="text-align: right; color: #38bdf8; font-weight: bold; font-size: 13px; padding-top: 8px;">${pMethod}</td>
                </tr>
              </table>

              ${
                itemsHtml
                  ? `
                <div style="margin-top: 16px; border-top: 1px dashed #1e293b; padding-top: 16px;">
                  <table style="width: 100%; border-collapse: collapse;">
                    ${itemsHtml}
                  </table>
                </div>
              `
                  : ''
              }

              ${
                totalAmount
                  ? `
                <div style="margin-top: 16px; border-top: 1px solid #1e293b; padding-top: 12px; text-align: right;">
                  <span style="color: #94a3b8; font-size: 14px; margin-right: 12px;">Total Payable:</span>
                  <span style="color: #38bdf8; font-size: 18px; font-weight: bold;">$${totalAmount.toFixed(2)}</span>
                </div>
              `
                  : ''
              }
            </div>

            <p style="color: #64748b; font-size: 12px; line-height: 1.5; margin: 0;">
              If you have any questions regarding your order or payment verification, reply directly to this email or contact support at info@xfactorpeps.com.
            </p>
          </div>

          <!-- Footer -->
          <div style="background-color: #030712; padding: 16px 24px; text-align: center; border-top: 1px solid #1e293b; font-size: 11px; color: #475569;">
            &copy; 2026 X-Factor Peptides. All Rights Reserved. Strictly for laboratory research use only.
          </div>
        </div>
      </body>
    </html>
  `;

  // 1. Hostinger SMTP Handler (Nodemailer)
  if (smtpUser && smtpPass) {
    try {
      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: smtpPort === 465,
        auth: {
          user: smtpUser,
          pass: smtpPass,
        },
      });

      await transporter.sendMail({
        from: `"X-Factor Peptides" <${smtpUser}>`,
        to: customerEmail,
        subject,
        html: htmlContent,
      });

      console.log(`[Hostinger SMTP Email Sent] ${status} notification sent to ${customerEmail} for order ${orderNumber}`);
      return { success: true, provider: 'hostinger_smtp' };
    } catch (err: any) {
      console.error('[Hostinger SMTP Error]', err?.message || err);
      return { success: false, error: err?.message };
    }
  }

  // 2. Resend API Handler (Fallback)
  if (resendApiKey && !resendApiKey.includes('placeholder')) {
    try {
      const { Resend } = await import('resend');
      const resend = new Resend(resendApiKey);
      await resend.emails.send({
        from: 'X-Factor Peptides <orders@xfactorpeps.com>',
        to: customerEmail,
        subject,
        html: htmlContent,
      });
      console.log(`[Resend Email Sent] ${status} notification sent to ${customerEmail} for order ${orderNumber}`);
      return { success: true, provider: 'resend' };
    } catch (err: any) {
      console.error('[Resend Email Error]', err?.message || err);
      return { success: false, error: err?.message };
    }
  }

  // 3. Simulated Mode
  console.log(`[Email Simulated (${status})] To: ${customerEmail} | Subject: ${subject}`);
  return { success: true, simulated: true };
}

/**
 * Send New Order Alert Email directly to Admin / Info Email Address
 */
export async function sendAdminNewOrderAlertEmail(params: AdminAlertParams) {
  const { orderNumber, customerName, customerEmail, customerPhone, shippingAddress, city, postalCode, totalAmount, paymentMethod, items } = params;

  const smtpHost = process.env.SMTP_HOST || 'smtp.hostinger.com';
  const smtpPort = Number(process.env.SMTP_PORT) || 465;
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASSWORD;
  const adminNotifyEmail = process.env.ADMIN_NOTIFY_EMAIL || smtpUser || 'info@xfactorpeps.com';
  const resendApiKey = process.env.RESEND_API_KEY;

  const pMethod = paymentMethod || 'Direct P2P Pay';
  const subject = `🚨 NEW ORDER RECEIVED: ${orderNumber} - $${totalAmount.toFixed(2)} (${pMethod})`;

  const itemsHtml = (items || [])
    .map(
      (item) => `
        <tr style="border-bottom: 1px solid #1e293b;">
          <td style="padding: 10px 0; color: #f8fafc; font-size: 13px;">
            <b>${item.name}</b> (${item.size})
          </td>
          <td style="padding: 10px 0; text-align: center; color: #94a3b8; font-size: 13px;">x${item.quantity}</td>
          <td style="padding: 10px 0; text-align: right; color: #38bdf8; font-weight: bold; font-size: 13px;">$${(item.price * item.quantity).toFixed(2)}</td>
        </tr>
      `
    )
    .join('');

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>${subject}</title>
      </head>
      <body style="background-color: #0b0f19; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; margin: 0; padding: 40px 20px; color: #f8fafc;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #0f172a; border: 2px solid #f59e0b; border-radius: 16px; overflow: hidden; box-shadow: 0 20px 25px -5px rgba(245, 158, 11, 0.2);">
          <!-- Header -->
          <div style="background-color: #030712; padding: 20px; text-align: center; border-bottom: 1px solid #1e293b;">
            <span style="background-color: #f59e0b; color: #000; font-weight: 800; font-size: 10px; padding: 4px 10px; border-radius: 9999px; text-transform: uppercase; letter-spacing: 1px;">Admin Order Alert</span>
            <h1 style="color: #ffffff; margin: 10px 0 0 0; font-size: 20px;">🚨 New Direct Payment Order!</h1>
          </div>

          <!-- Body -->
          <div style="padding: 24px;">
            <p style="color: #94a3b8; font-size: 14px; margin-top: 0;">
              A new order has just been placed on <b>X-Factor Peptides</b> using <b>${pMethod}</b>. Please wait for payment proof screenshot or verify in admin dashboard.
            </p>

            <!-- Customer Box -->
            <div style="background-color: #030712; border: 1px solid #1e293b; border-radius: 12px; padding: 16px; margin-bottom: 20px; font-size: 13px;">
              <h3 style="color: #38bdf8; margin: 0 0 12px 0; font-size: 14px; border-bottom: 1px solid #1e293b; padding-bottom: 8px;">Customer Information</h3>
              <p style="margin: 4px 0; color: #ffffff;"><b>Name:</b> ${customerName}</p>
              <p style="margin: 4px 0; color: #ffffff;"><b>Email:</b> <a href="mailto:${customerEmail}" style="color: #38bdf8;">${customerEmail}</a></p>
              <p style="margin: 4px 0; color: #ffffff;"><b>Phone:</b> <a href="tel:${customerPhone}" style="color: #38bdf8;">${customerPhone}</a></p>
              <p style="margin: 4px 0; color: #ffffff;"><b>Address:</b> ${shippingAddress}, ${city} (${postalCode})</p>
            </div>

            <!-- Order Details Box -->
            <div style="background-color: #030712; border: 1px solid #1e293b; border-radius: 12px; padding: 16px; margin-bottom: 20px; font-size: 13px;">
              <table style="width: 100%; border-collapse: collapse; margin-bottom: 12px;">
                <tr>
                  <td style="color: #64748b;">Order Number:</td>
                  <td style="text-align: right; color: #f8fafc; font-weight: bold; font-family: monospace;">${orderNumber}</td>
                </tr>
                <tr>
                  <td style="color: #64748b;">Payment Method:</td>
                  <td style="text-align: right; color: #f59e0b; font-weight: bold;">${pMethod}</td>
                </tr>
              </table>

              <table style="width: 100%; border-collapse: collapse;">
                ${itemsHtml}
              </table>

              <div style="margin-top: 12px; border-top: 1px solid #1e293b; padding-top: 10px; text-align: right;">
                <span style="color: #94a3b8; font-size: 13px; margin-right: 8px;">Total Amount:</span>
                <span style="color: #38bdf8; font-size: 16px; font-weight: bold;">$${totalAmount.toFixed(2)}</span>
              </div>
            </div>

            <!-- Dashboard Button -->
            <div style="text-align: center; margin-top: 24px;">
              <a href="http://localhost:3000/x-factor-admin/orders" style="display: inline-block; background-color: #38bdf8; color: #000; font-weight: bold; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-size: 14px;">
                Open Admin Orders Dashboard
              </a>
            </div>
          </div>
        </div>
      </body>
    </html>
  `;

  if (smtpUser && smtpPass) {
    try {
      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: smtpPort === 465,
        auth: { user: smtpUser, pass: smtpPass },
      });

      await transporter.sendMail({
        from: `"X-Factor Peptides Alerts" <${smtpUser}>`,
        to: adminNotifyEmail,
        subject,
        html: htmlContent,
      });

      console.log(`[Admin New Order Alert Sent] Alert sent to ${adminNotifyEmail} for order ${orderNumber}`);
      return { success: true };
    } catch (err: any) {
      console.error('[Admin Alert Email Error]', err?.message || err);
      return { success: false, error: err?.message };
    }
  }

  if (resendApiKey && !resendApiKey.includes('placeholder')) {
    try {
      const { Resend } = await import('resend');
      const resend = new Resend(resendApiKey);
      await resend.emails.send({
        from: 'X-Factor Peptides <orders@xfactorpeps.com>',
        to: adminNotifyEmail,
        subject,
        html: htmlContent,
      });
      return { success: true };
    } catch (err: any) {
      console.error('[Resend Admin Alert Error]', err?.message || err);
      return { success: false, error: err?.message };
    }
  }

  console.log(`[Admin Alert Email Simulated] To: ${adminNotifyEmail} | Subject: ${subject}`);
  return { success: true, simulated: true };
}

/**
 * Send Payment Proof Alert Email to Admin when customer uploads a screenshot
 */
export async function sendAdminPaymentProofAlertEmail(params: PaymentProofAlertParams) {
  const { orderNumber, customerName, customerEmail, paymentMethod, proofUrl, transactionId, senderName, totalAmount } = params;

  const smtpHost = process.env.SMTP_HOST || 'smtp.hostinger.com';
  const smtpPort = Number(process.env.SMTP_PORT) || 465;
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASSWORD;
  const adminNotifyEmail = process.env.ADMIN_NOTIFY_EMAIL || smtpUser || 'info@xfactorpeps.com';

  const subject = `📷 PAYMENT PROOF RECEIVED: Order #${orderNumber} ($${totalAmount.toFixed(2)} via ${paymentMethod})`;

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head><meta charset="utf-8"></head>
      <body style="background-color: #0b0f19; font-family: sans-serif; padding: 24px; color: #f8fafc;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #0f172a; border: 2px solid #10b981; border-radius: 16px; padding: 24px;">
          <h2 style="color: #10b981; margin-top: 0;">📷 Payment Proof Uploaded for Verification</h2>
          <p style="color: #94a3b8; font-size: 14px;">
            Customer <b>${customerName}</b> (${customerEmail}) has submitted a payment receipt screenshot for order <b>${orderNumber}</b>.
          </p>

          <div style="background-color: #030712; border: 1px solid #1e293b; border-radius: 12px; padding: 16px; margin: 16px 0; font-size: 13px;">
            <p style="margin: 4px 0; color: #ffffff;"><b>Order #:</b> ${orderNumber}</p>
            <p style="margin: 4px 0; color: #ffffff;"><b>Payment Method:</b> ${paymentMethod}</p>
            <p style="margin: 4px 0; color: #ffffff;"><b>Total Amount:</b> $${totalAmount.toFixed(2)}</p>
            <p style="margin: 4px 0; color: #ffffff;"><b>Transaction / Ref ID:</b> ${transactionId || 'Not specified'}</p>
            <p style="margin: 4px 0; color: #ffffff;"><b>Sender Name:</b> ${senderName || 'Not specified'}</p>
          </div>

          <div style="text-align: center; margin-top: 24px;">
            <a href="http://localhost:3000/x-factor-admin/orders" style="display: inline-block; background-color: #10b981; color: #000; font-weight: bold; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-size: 14px;">
              Review Screenshot in Admin Dashboard
            </a>
          </div>
        </div>
      </body>
    </html>
  `;

  if (smtpUser && smtpPass) {
    try {
      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: smtpPort === 465,
        auth: { user: smtpUser, pass: smtpPass },
      });

      await transporter.sendMail({
        from: `"X-Factor Payment Proofs" <${smtpUser}>`,
        to: adminNotifyEmail,
        subject,
        html: htmlContent,
      });

      console.log(`[Admin Payment Proof Alert Sent] Alert sent to ${adminNotifyEmail} for order ${orderNumber}`);
      return { success: true };
    } catch (err: any) {
      console.error('[Payment Proof Alert Error]', err?.message || err);
      return { success: false, error: err?.message };
    }
  }

  console.log(`[Admin Payment Proof Alert Simulated] To: ${adminNotifyEmail} | Subject: ${subject}`);
  return { success: true, simulated: true };
}

/**
 * Send Contact Us Form Submission Email
 */
export async function sendContactFormEmail(params: ContactFormParams) {
  const { firstName, lastName, email, subject, message } = params;

  const smtpHost = process.env.SMTP_HOST || 'smtp.hostinger.com';
  const smtpPort = Number(process.env.SMTP_PORT) || 465;
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASSWORD;
  const adminNotifyEmail = process.env.ADMIN_NOTIFY_EMAIL || smtpUser || 'info@xfactorpeps.com';

  const emailSubject = `💬 Contact Form Inquiry: ${subject} (from ${firstName} ${lastName})`;

  const adminHtml = `
    <!DOCTYPE html>
    <html>
      <head><meta charset="utf-8"></head>
      <body style="background-color: #0b0f19; font-family: sans-serif; padding: 30px; color: #f8fafc;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #0f172a; border: 1px solid #38bdf8; border-radius: 12px; padding: 24px;">
          <h2 style="color: #38bdf8; margin-top: 0;">💬 New Contact Form Message</h2>
          <p style="margin: 6px 0; color: #ffffff;"><b>Name:</b> ${firstName} ${lastName}</p>
          <p style="margin: 6px 0; color: #ffffff;"><b>Email:</b> <a href="mailto:${email}" style="color: #38bdf8;">${email}</a></p>
          <p style="margin: 6px 0; color: #ffffff;"><b>Subject:</b> ${subject}</p>
          <div style="margin-top: 16px; background-color: #030712; padding: 16px; border-radius: 8px; border: 1px solid #1e293b;">
            <p style="color: #64748b; font-size: 11px; uppercase; margin-top: 0;">Message Content:</p>
            <p style="color: #f8fafc; line-height: 1.6; white-space: pre-wrap; margin: 0;">${message}</p>
          </div>
        </div>
      </body>
    </html>
  `;

  if (smtpUser && smtpPass) {
    try {
      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: smtpPort === 465,
        auth: { user: smtpUser, pass: smtpPass },
      });

      await transporter.sendMail({
        from: `"X-Factor Contact Form" <${smtpUser}>`,
        to: adminNotifyEmail,
        replyTo: email,
        subject: emailSubject,
        html: adminHtml,
      });

      await transporter.sendMail({
        from: `"X-Factor Peptides" <${smtpUser}>`,
        to: email,
        subject: `We received your message: ${subject}`,
        html: `
          <div style="background-color: #0b0f19; font-family: sans-serif; padding: 30px; color: #f8fafc;">
            <div style="max-width: 500px; margin: 0 auto; background-color: #0f172a; border: 1px solid #1e293b; border-radius: 12px; padding: 24px;">
              <h2 style="color: #38bdf8; margin-top: 0;">Hi ${firstName},</h2>
              <p style="color: #94a3b8; line-height: 1.6;">
                Thank you for contacting X-Factor Peptides! We have received your inquiry regarding <b>"${subject}"</b> and our support team will respond to you shortly.
              </p>
              <p style="color: #64748b; font-size: 12px; margin-top: 24px;">&copy; 2026 X-Factor Peptides</p>
            </div>
          </div>
        `,
      });

      return { success: true };
    } catch (err: any) {
      console.error('[Contact Form Email Error]', err?.message || err);
      return { success: false, error: err?.message };
    }
  }

  console.log(`[Contact Form Simulated] To: ${adminNotifyEmail} | Subject: ${emailSubject}`);
  return { success: true, simulated: true };
}

export async function sendNewsletterSubscriptionEmail(subscriberEmail: string) {
  const smtpHost = process.env.SMTP_HOST || 'smtp.hostinger.com';
  const smtpPort = Number(process.env.SMTP_PORT) || 465;
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASSWORD;
  const adminNotifyEmail = process.env.ADMIN_NOTIFY_EMAIL || smtpUser || 'info@xfactorpeps.com';

  if (smtpUser && smtpPass) {
    try {
      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: smtpPort === 465,
        auth: { user: smtpUser, pass: smtpPass },
      });

      await transporter.sendMail({
        from: `"X-Factor Peptides" <${smtpUser}>`,
        to: subscriberEmail,
        subject: 'Welcome to X-Factor Peptides — Research Publications & Compound Updates',
        html: `Subscribed successfully.`,
      });

      await transporter.sendMail({
        from: `"X-Factor Website" <${smtpUser}>`,
        to: adminNotifyEmail,
        subject: `📬 New Newsletter Subscriber: ${subscriberEmail}`,
        html: `New subscriber: ${subscriberEmail}`,
      });

      return { success: true };
    } catch (err: any) {
      console.error('[Newsletter Email Error]', err?.message || err);
      return { success: false, error: err?.message };
    }
  }

  return { success: true, simulated: true };
}
