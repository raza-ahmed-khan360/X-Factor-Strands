'use server';

import { createClient } from '@supabase/supabase-js';
import { sanitizeString, sanitizeEmail, sanitizePhone, sanitizeNumber } from '@/lib/security';

export interface DiscountCoupon {
  id: string;
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  firstTimeOnly: boolean;
  minOrderAmount: number;
  isActive: boolean;
  usageCount: number;
  description?: string;
  createdAt: string;
}

// Default initial coupons (persistent fallback store)
let globalCouponsStore: DiscountCoupon[] = [
  {
    id: 'disc_welcome10',
    code: 'WELCOME10',
    discountType: 'percentage',
    discountValue: 10,
    firstTimeOnly: true,
    minOrderAmount: 0,
    isActive: true,
    usageCount: 0,
    description: '10% OFF exclusively for first-time research buyers',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'disc_first15',
    code: 'FIRST15',
    discountType: 'percentage',
    discountValue: 15,
    firstTimeOnly: true,
    minOrderAmount: 100,
    isActive: true,
    usageCount: 0,
    description: '15% OFF for first-time orders over $100',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'disc_save20',
    code: 'RESEARCH20',
    discountType: 'fixed',
    discountValue: 20,
    firstTimeOnly: false,
    minOrderAmount: 150,
    isActive: true,
    usageCount: 0,
    description: '$20 OFF on orders over $150',
    createdAt: new Date().toISOString(),
  },
];

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

/**
 * Fetch all discount coupons (Supabase table 'discounts' with store fallback)
 */
export async function fetchDiscountsAction(): Promise<{ success: boolean; coupons: DiscountCoupon[] }> {
  const supabase = getAdminSupabase();

  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('discounts')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        const formatted: DiscountCoupon[] = data.map((d: any) => ({
          id: d.id,
          code: d.code,
          discountType: d.discount_type || 'percentage',
          discountValue: Number(d.discount_value) || 0,
          firstTimeOnly: Boolean(d.first_time_only),
          minOrderAmount: Number(d.min_order_amount) || 0,
          isActive: d.is_active !== false,
          usageCount: Number(d.usage_count) || 0,
          description: d.description || '',
          createdAt: d.created_at || new Date().toISOString(),
        }));
        return { success: true, coupons: formatted };
      }
    } catch (e) {
      console.warn('Supabase discounts fetch error, using store:', e);
    }
  }

  return { success: true, coupons: [...globalCouponsStore] };
}

/**
 * Save or Update a Discount Coupon
 */
export async function saveDiscountAction(payload: {
  id?: string;
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  firstTimeOnly: boolean;
  minOrderAmount?: number;
  isActive?: boolean;
  description?: string;
}): Promise<{ success: boolean; coupon?: DiscountCoupon; error?: string }> {
  try {
    const cleanCode = sanitizeString(payload.code, 30).toUpperCase().replace(/[^A-Z0-9_-]/g, '');
    if (!cleanCode) {
      return { success: false, error: 'A valid coupon code is required.' };
    }

    const discountValue = sanitizeNumber(payload.discountValue, 0.01, 10000, 10);
    const minOrderAmount = sanitizeNumber(payload.minOrderAmount, 0, 100000, 0);
    const id = payload.id || `disc_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;

    const couponObj: DiscountCoupon = {
      id,
      code: cleanCode,
      discountType: payload.discountType === 'fixed' ? 'fixed' : 'percentage',
      discountValue,
      firstTimeOnly: Boolean(payload.firstTimeOnly),
      minOrderAmount,
      isActive: payload.isActive !== false,
      usageCount: 0,
      description: sanitizeString(payload.description, 200),
      createdAt: new Date().toISOString(),
    };

    // Update in-memory store
    const existingIndex = globalCouponsStore.findIndex((c) => c.id === id || c.code === cleanCode);
    if (existingIndex >= 0) {
      couponObj.usageCount = globalCouponsStore[existingIndex].usageCount;
      couponObj.createdAt = globalCouponsStore[existingIndex].createdAt;
      globalCouponsStore[existingIndex] = couponObj;
    } else {
      globalCouponsStore.unshift(couponObj);
    }

    // Try persisting to Supabase
    const supabase = getAdminSupabase();
    if (supabase) {
      try {
        await supabase.from('discounts').upsert({
          id: couponObj.id,
          code: couponObj.code,
          discount_type: couponObj.discountType,
          discount_value: couponObj.discountValue,
          first_time_only: couponObj.firstTimeOnly,
          min_order_amount: couponObj.minOrderAmount,
          is_active: couponObj.isActive,
          usage_count: couponObj.usageCount,
          description: couponObj.description,
        });
      } catch (e) {
        console.warn('Supabase discount upsert warning:', e);
      }
    }

    return { success: true, coupon: couponObj };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Failed to save discount coupon' };
  }
}

/**
 * Delete a Discount Coupon
 */
export async function deleteDiscountAction(id: string): Promise<{ success: boolean; error?: string }> {
  globalCouponsStore = globalCouponsStore.filter((c) => c.id !== id);

  const supabase = getAdminSupabase();
  if (supabase) {
    try {
      await supabase.from('discounts').delete().eq('id', id);
    } catch (e) {
      console.warn('Supabase discount delete warning:', e);
    }
  }

  return { success: true };
}

/**
 * Toggle Coupon Active Status
 */
export async function toggleDiscountStatusAction(id: string, isActive: boolean): Promise<{ success: boolean }> {
  const coupon = globalCouponsStore.find((c) => c.id === id);
  if (coupon) {
    coupon.isActive = isActive;
  }

  const supabase = getAdminSupabase();
  if (supabase) {
    try {
      await supabase.from('discounts').update({ is_active: isActive }).eq('id', id);
    } catch (e) {
      console.warn('Supabase discount toggle warning:', e);
    }
  }

  return { success: true };
}

/**
 * Increment coupon usage counter
 */
export async function incrementCouponUsage(code: string): Promise<void> {
  const cleanCode = (code || '').trim().toUpperCase();
  const coupon = globalCouponsStore.find((c) => c.code === cleanCode);
  if (coupon) {
    coupon.usageCount += 1;
  }

  const supabase = getAdminSupabase();
  if (supabase) {
    try {
      await supabase.rpc('increment_discount_usage', { coupon_code: cleanCode });
    } catch {
      // ignore
    }
  }
}

/**
 * REAL-TIME 1ST-TIME BUYER VALIDATION & COUPON EVALUATOR
 */
export async function validateCouponAction(params: {
  code: string;
  email?: string;
  phone?: string;
  subtotal: number;
}): Promise<{
  valid: boolean;
  error?: string;
  discountType?: 'percentage' | 'fixed';
  discountValue?: number;
  discountAmount?: number;
  code?: string;
  description?: string;
}> {
  const rawCode = (params.code || '').trim().toUpperCase();
  if (!rawCode) {
    return { valid: false, error: 'Please enter a promo code.' };
  }

  const subtotal = Number(params.subtotal) || 0;
  if (subtotal <= 0) {
    return { valid: false, error: 'Your cart is empty.' };
  }

  // 1. Fetch coupon details
  const { coupons } = await fetchDiscountsAction();
  const coupon = coupons.find((c) => c.code === rawCode);

  if (!coupon) {
    return { valid: false, error: `Promo code "${rawCode}" is invalid or does not exist.` };
  }

  if (!coupon.isActive) {
    return { valid: false, error: `Promo code "${rawCode}" is no longer active.` };
  }

  // 2. Check Minimum Order Amount
  if (coupon.minOrderAmount > 0 && subtotal < coupon.minOrderAmount) {
    return {
      valid: false,
      error: `This coupon requires a minimum subtotal of $${coupon.minOrderAmount.toFixed(2)} (current subtotal: $${subtotal.toFixed(2)}).`,
    };
  }

  // 3. FIRST-TIME BUYER TRACKING & VERIFICATION
  if (coupon.firstTimeOnly) {
    const rawEmail = (params.email || '').trim().toLowerCase();
    const rawPhone = (params.phone || '').trim().replace(/[^0-9]/g, '');

    if (!rawEmail) {
      return {
        valid: false,
        error: 'Please enter your email address in the shipping form to verify first-time buyer eligibility.',
      };
    }

    // Check Supabase 'orders' table for previous orders
    const supabase = getAdminSupabase();
    let hasPreviousOrder = false;

    if (supabase) {
      try {
        // Query non-cancelled orders with this email
        const { data: emailOrders, error: emailErr } = await supabase
          .from('orders')
          .select('id, status')
          .ilike('customer_email', rawEmail)
          .neq('status', 'cancelled')
          .limit(1);

        if (!emailErr && emailOrders && emailOrders.length > 0) {
          hasPreviousOrder = true;
        }

        // Query phone if provided and not already found
        if (!hasPreviousOrder && rawPhone.length >= 7) {
          const { data: phoneOrders, error: phoneErr } = await supabase
            .from('orders')
            .select('id, status')
            .ilike('customer_phone', `%${rawPhone.slice(-7)}%`)
            .neq('status', 'cancelled')
            .limit(1);

          if (!phoneErr && phoneOrders && phoneOrders.length > 0) {
            hasPreviousOrder = true;
          }
        }
      } catch (e) {
        console.warn('First-time buyer lookup query exception:', e);
      }
    }

    if (hasPreviousOrder) {
      return {
        valid: false,
        error: `Promo code "${rawCode}" is strictly reserved for first-time buyers. An existing order was found associated with ${rawEmail}.`,
      };
    }
  }

  // 4. Calculate Discount Amount
  let discountAmount = 0;
  if (coupon.discountType === 'percentage') {
    discountAmount = (subtotal * coupon.discountValue) / 100;
  } else {
    discountAmount = Math.min(coupon.discountValue, subtotal);
  }

  discountAmount = Number(discountAmount.toFixed(2));

  return {
    valid: true,
    code: coupon.code,
    discountType: coupon.discountType,
    discountValue: coupon.discountValue,
    discountAmount,
    description: coupon.description || (coupon.discountType === 'percentage' ? `${coupon.discountValue}% OFF` : `$${coupon.discountValue} OFF`),
  };
}
