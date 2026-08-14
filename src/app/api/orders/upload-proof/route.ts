import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { attachPaymentProofAction } from '@/app/x-factor-admin/orders/actions';
import { sanitizeOrderNumber, sanitizeTransactionId, sanitizeString, validateUploadFile } from '@/lib/security';

export const dynamic = 'force-dynamic';

function getAdminSupabase() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://qlqquolxsoxsnzcpunes.supabase.co';
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    return null;
  }

  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const rawOrderNumber = formData.get('orderNumber');
    const rawTransactionId = formData.get('transactionId');
    const rawSenderName = formData.get('senderName');
    const proofFile = formData.get('proofFile') as File | null;
    const proofDataBase64 = (formData.get('proofData') as string) || '';

    const orderNumber = sanitizeOrderNumber(rawOrderNumber);
    const transactionId = sanitizeTransactionId(rawTransactionId);
    const senderName = sanitizeString(rawSenderName, 100);

    if (!orderNumber) {
      return NextResponse.json({ success: false, error: 'Valid Order Number is required' }, { status: 400 });
    }

    if (!transactionId) {
      return NextResponse.json({ success: false, error: 'Transaction ID / Reference Number is mandatory' }, { status: 400 });
    }

    let proofUrl = '';

    // Validate and upload file
    if (proofFile && proofFile.size > 0) {
      const fileValidation = validateUploadFile(proofFile);
      if (!fileValidation.valid) {
        return NextResponse.json({ success: false, error: fileValidation.error }, { status: 400 });
      }

      const supabase = getAdminSupabase();
      if (supabase) {
        try {
          const ext = (proofFile.name.split('.').pop() || 'png').toLowerCase().replace(/[^a-z0-9]/g, '');
          const safeOrder = orderNumber.replace(/[^a-zA-Z0-9_-]/g, '');
          const filePath = `proofs/${safeOrder}_${Date.now()}.${ext}`;

          const arrayBuffer = await proofFile.arrayBuffer();
          const buffer = Buffer.from(arrayBuffer);

          const { error: uploadErr } = await supabase.storage
            .from('payment-proofs')
            .upload(filePath, buffer, {
              contentType: proofFile.type || 'image/png',
              upsert: true,
            });

          if (!uploadErr) {
            const { data: publicUrlData } = supabase.storage
              .from('payment-proofs')
              .getPublicUrl(filePath);

            proofUrl = publicUrlData.publicUrl;
          } else {
            console.warn('Storage upload warning, using base64 fallback:', uploadErr.message);
          }
        } catch (e) {
          console.warn('Supabase storage upload exception:', e);
        }
      }

      if (!proofUrl) {
        const arrayBuffer = await proofFile.arrayBuffer();
        const base64 = Buffer.from(arrayBuffer).toString('base64');
        const mime = proofFile.type || 'image/png';
        proofUrl = `data:${mime};base64,${base64}`;
      }
    } else if (proofDataBase64 && proofDataBase64.startsWith('data:image/')) {
      proofUrl = proofDataBase64;
    }

    if (!proofUrl) {
      return NextResponse.json({ success: false, error: 'No valid payment proof file provided' }, { status: 400 });
    }

    // Attach sanitized payment proof to order
    const res = await attachPaymentProofAction({
      orderNumber,
      proofUrl,
      transactionId,
      senderName,
    });

    if (res.success) {
      return NextResponse.json({ success: true, proofUrl });
    } else {
      return NextResponse.json({ success: false, error: res.error || 'Failed to attach proof' }, { status: 500 });
    }
  } catch (err: any) {
    console.error('Upload proof route error:', err);
    return NextResponse.json({ success: false, error: err?.message || 'Server error' }, { status: 500 });
  }
}
