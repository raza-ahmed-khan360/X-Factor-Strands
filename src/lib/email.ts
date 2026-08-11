export interface EmailParams {
  orderNumber: string;
  customerEmail: string;
  customerName: string;
  status: 'pending' | 'confirmed' | 'on_its_way' | 'delivered' | 'cancelled';
  totalAmount?: number;
  items?: { name: string; size: string; quantity: number; price: number }[];
}

export async function sendOrderStatusEmail(params: EmailParams) {
  const apiKey = process.env.RESEND_API_KEY;

  const { orderNumber, customerEmail, customerName, status, totalAmount, items } = params;

  let subject = '';
  let heading = '';
  let message = '';
  let badgeColor = '#3b82f6'; // blue

  switch (status) {
    case 'pending':
      subject = `Order Received: ${orderNumber} (Pending Confirmation)`;
      heading = 'Your Order is Pending Confirmation';
      message = 'Thank you for placing your order with X-Factor Peptides! Your Cash on Delivery order has been received and is currently being verified by our team. Please be patient while we confirm your order.';
      badgeColor = '#f59e0b'; // amber
      break;

    case 'confirmed':
      subject = `Order Confirmed: ${orderNumber} - X-Factor Peptides`;
      heading = 'Your Order is Confirmed!';
      message = 'Great news! Your order has been officially verified and confirmed by our team. We are currently preparing and packaging your research compounds for dispatch.';
      badgeColor = '#10b981'; // green
      break;

    case 'on_its_way':
      subject = `Order Dispatched: ${orderNumber} is On Its Way!`;
      heading = 'Your Order is On Its Way!';
      message = 'Your parcel has been dispatched and is currently out for delivery via our courier partner. Please have the exact Cash on Delivery amount ready upon arrival.';
      badgeColor = '#8b5cf6'; // purple
      break;

    case 'delivered':
      subject = `Order Delivered: ${orderNumber} - X-Factor Peptides`;
      heading = 'Your Order Has Been Delivered!';
      message = 'Your Cash on Delivery order has been successfully delivered. Thank you for choosing X-Factor Peptides!';
      badgeColor = '#059669'; // emerald
      break;

    case 'cancelled':
      subject = `Order Cancellation Notice: ${orderNumber}`;
      heading = 'Your Order Has Been Cancelled';
      message = 'Your order has been cancelled. If you believe this was in error, please contact our support team.';
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
            <p style="color: #64748b; font-size: 11px; margin-top: 4px; text-transform: uppercase; tracking: 1px;">Research Use Only</p>
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
                  <td style="color: #64748b; font-size: 12px; text-transform: uppercase; padding-top: 8px;">Payment Method</td>
                  <td style="text-align: right; color: #38bdf8; font-weight: bold; font-size: 13px; padding-top: 8px;">Cash on Delivery (COD)</td>
                </tr>
              </table>

              ${
                itemsHtml
                  ? `
                <div style="margin-top: 16px; border-top: 1px dashed #1e293b; pt: 16px;">
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
                  <span style="color: #94a3b8; font-size: 14px; margin-right: 12px;">Total Payable Cash:</span>
                  <span style="color: #38bdf8; font-size: 18px; font-weight: bold;">$${totalAmount.toFixed(2)}</span>
                </div>
              `
                  : ''
              }
            </div>

            <p style="color: #64748b; font-size: 12px; line-height: 1.5; margin: 0;">
              If you have any questions regarding your order, reply directly to this email or contact support.
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

  if (apiKey) {
    try {
      const { Resend } = await import('resend');
      const resend = new Resend(apiKey);
      await resend.emails.send({
        from: 'X-Factor Peptides <orders@xfactorpeptides.com>',
        to: customerEmail,
        subject,
        html: htmlContent,
      });
      console.log(`[Email Sent] ${status} notification sent to ${customerEmail} for order ${orderNumber}`);
      return { success: true };
    } catch (err: any) {
      console.error('[Email Error]', err?.message || err);
      return { success: false, error: err?.message };
    }
  } else {
    // Log simulation if RESEND_API_KEY is not yet added
    console.log(`[Email Simulated (${status})] To: ${customerEmail} | Subject: ${subject}`);
    return { success: true, simulated: true };
  }
}
