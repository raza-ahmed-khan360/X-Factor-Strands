'use server';

import { createClient } from '@supabase/supabase-js';
import { sendOrderStatusEmail } from '@/lib/email';
import { sanitizeString, sanitizeEmail, sanitizePhone, sanitizeOrderNumber, sanitizeNumber, sanitizeTransactionId } from '@/lib/security';

// Global in-memory fallback store for orders placed during runtime
let globalOrdersStore: any[] = [];
let globalCodShippingFee: number = 5.99;

function getAdminSupabase() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://qlqquolxsoxsnzcpunes.supabase.co';
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error('Missing Supabase environment variables');
  }

  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

export interface CreateOrderPayload {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: string;
  city: string;
  postalCode: string;
  paymentMethod: string;
  shippingFee?: number;
  couponCode?: string;
  discountAmount?: number;
  totalAmount: number;
  status?: 'pending' | 'confirmed' | 'on_its_way' | 'delivered' | 'cancelled';
  items: { name: string; size: string; quantity: number; price: number }[];
}

export interface AttachPaymentProofPayload {
  orderNumber: string;
  proofUrl: string;
  transactionId?: string;
  senderName?: string;
}

export async function getCodShippingFeeAction(): Promise<{ success: boolean; fee: number }> {
  return { success: true, fee: globalCodShippingFee };
}

export async function updateCodShippingFeeAction(newFee: number): Promise<{ success: boolean; fee: number }> {
  globalCodShippingFee = Number(newFee) || 0;
  return { success: true, fee: globalCodShippingFee };
}

export async function createOrderAction(rawPayload: CreateOrderPayload) {
  let cleanEmail = '';
  try {
    cleanEmail = sanitizeEmail(rawPayload.customerEmail);
  } catch {
    cleanEmail = (rawPayload.customerEmail || '').slice(0, 100);
  }

  const payload: CreateOrderPayload = {
    orderNumber: sanitizeOrderNumber(rawPayload.orderNumber) || `XFP-${Math.floor(100000 + Math.random() * 900000)}`,
    customerName: sanitizeString(rawPayload.customerName, 120),
    customerEmail: cleanEmail,
    customerPhone: sanitizePhone(rawPayload.customerPhone),
    shippingAddress: sanitizeString(rawPayload.shippingAddress, 250),
    city: sanitizeString(rawPayload.city, 80),
    postalCode: sanitizeString(rawPayload.postalCode, 20),
    paymentMethod: sanitizeString(rawPayload.paymentMethod, 50) || 'Cash App',
    shippingFee: sanitizeNumber(rawPayload.shippingFee, 0, 500, 5.99),
    couponCode: sanitizeString(rawPayload.couponCode, 30) || undefined,
    discountAmount: sanitizeNumber(rawPayload.discountAmount, 0, 10000, 0),
    totalAmount: sanitizeNumber(rawPayload.totalAmount, 0, 100000, 0),
    status: rawPayload.status || 'pending',
    items: (rawPayload.items || []).map((item) => ({
      name: sanitizeString(item.name, 120),
      size: sanitizeString(item.size, 30),
      quantity: Math.max(1, Math.min(100, Math.floor(Number(item.quantity) || 1))),
      price: sanitizeNumber(item.price, 0, 10000, 0),
    })),
  };
  return _createOrderActionInternal(payload);
}

async function _createOrderActionInternal(payload: CreateOrderPayload): Promise<{ success: boolean; orderNumber?: string; error?: string }> {
  const supabase = getAdminSupabase();

  const newOrderObj = {
    id: `ord_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    order_number: payload.orderNumber,
    customer_name: payload.customerName,
    customer_email: payload.customerEmail,
    customer_phone: payload.customerPhone,
    shipping_address: payload.shippingAddress,
    city: payload.city,
    postal_code: payload.postalCode,
    payment_method: payload.paymentMethod || 'Cash App',
    shipping_fee: payload.shippingFee ?? globalCodShippingFee,
    status: payload.status || 'pending',
    total_amount: payload.totalAmount,
    created_at: new Date().toISOString(),
    order_items: payload.items.map((i, idx) => ({
      id: `item_${idx}_${Date.now()}`,
      item_name: i.name,
      size: i.size,
      quantity: i.quantity,
      price: i.price,
    })),
  };

  // Add to server in-memory store
  globalOrdersStore.unshift(newOrderObj);

  try {
    // 1. Try Supabase insert
    const { data: orderData, error: orderError } = await supabase
      .from('orders')
      .insert({
        order_number: payload.orderNumber,
        customer_name: payload.customerName,
        customer_email: payload.customerEmail,
        customer_phone: payload.customerPhone,
        shipping_address: payload.shippingAddress,
        city: payload.city,
        postal_code: payload.postalCode,
        payment_method: payload.paymentMethod || 'Cash App',
        status: payload.status || 'pending',
        total_amount: payload.totalAmount,
        shipping_fee: payload.shippingFee ?? globalCodShippingFee,
        coupon_code: payload.couponCode || null,
        discount_amount: payload.discountAmount || 0,
      })
      .select()
      .single();

    if (orderError) {
      // Surface the real error so it appears in Hostinger / server logs
      console.error('[SUPABASE orders INSERT FAILED]', JSON.stringify(orderError));
    }

    if (!orderError && orderData?.id && payload.items?.length > 0) {
      const itemsToInsert = payload.items.map((item) => ({
        order_id: orderData.id,
        item_name: item.name,
        size: item.size,
        quantity: item.quantity,
        price: item.price,
      }));
      const { error: itemsError } = await supabase.from('order_items').insert(itemsToInsert);
      if (itemsError) {
        console.error('[SUPABASE order_items INSERT FAILED]', JSON.stringify(itemsError));
      }
    }
  } catch (err: any) {
    console.error('[SUPABASE createOrder EXCEPTION]', err?.message, err?.stack);
  }

  // 2. Trigger Automated Pending Confirmation Email to Customer
  try {
    await sendOrderStatusEmail({
      orderNumber: payload.orderNumber,
      customerEmail: payload.customerEmail,
      customerName: payload.customerName,
      status: (payload.status as any) || 'pending',
      totalAmount: payload.totalAmount,
      items: payload.items,
      paymentMethod: payload.paymentMethod,
    });
  } catch (emailErr) {
    console.error('Initial customer email error:', emailErr);
  }

  // 3. Trigger Admin Alert Email to info/admin email
  try {
    const { sendAdminNewOrderAlertEmail } = await import('@/lib/email');
    await sendAdminNewOrderAlertEmail({
      orderNumber: payload.orderNumber,
      customerName: payload.customerName,
      customerEmail: payload.customerEmail,
      customerPhone: payload.customerPhone,
      shippingAddress: payload.shippingAddress,
      city: payload.city,
      postalCode: payload.postalCode,
      totalAmount: payload.totalAmount,
      paymentMethod: payload.paymentMethod,
      items: payload.items,
    });
  } catch (adminAlertErr) {
    console.error('Admin alert email error:', adminAlertErr);
  }

  return { success: true, orderNumber: payload.orderNumber };
}

export async function attachPaymentProofAction(payload: AttachPaymentProofPayload): Promise<{ success: boolean; error?: string }> {
  const supabase = getAdminSupabase();
  const timestamp = new Date().toISOString();

  // 1. Update in-memory store
  const target = globalOrdersStore.find(
    (o) => o.order_number === payload.orderNumber || o.id === payload.orderNumber
  );

  if (target) {
    target.payment_proof_url = payload.proofUrl;
    target.transaction_id = payload.transactionId || target.transaction_id;
    target.sender_name = payload.senderName || target.sender_name;
    target.payment_proof_timestamp = timestamp;
  }

  // 2. Update Supabase DB
  try {
    await supabase
      .from('orders')
      .update({
        payment_proof_url: payload.proofUrl,
        transaction_id: payload.transactionId || null,
        sender_name: payload.senderName || null,
        payment_proof_timestamp: timestamp,
      })
      .eq('order_number', payload.orderNumber);
  } catch (err: any) {
    console.warn('DB payment proof update error:', err?.message);
  }

  // 3. Trigger Admin Alert Email
  try {
    const { sendAdminPaymentProofAlertEmail } = await import('@/lib/email');
    await sendAdminPaymentProofAlertEmail({
      orderNumber: payload.orderNumber,
      customerName: target?.customer_name || 'Customer',
      customerEmail: target?.customer_email || 'customer@example.com',
      paymentMethod: target?.payment_method || 'P2P Online Pay',
      proofUrl: payload.proofUrl,
      transactionId: payload.transactionId,
      senderName: payload.senderName,
      totalAmount: Number(target?.total_amount || 0),
    });
  } catch (emailErr) {
    console.error('Payment proof admin alert email error:', emailErr);
  }

  return { success: true };
}

export async function updateOrderStatusAction(
  orderId: string,
  newStatus: 'pending' | 'confirmed' | 'on_its_way' | 'delivered' | 'cancelled'
): Promise<{ success: boolean; error?: string }> {
  const supabase = getAdminSupabase();

  let targetOrder = globalOrdersStore.find((o) => o.id === orderId || o.order_number === orderId);

  if (targetOrder) {
    targetOrder.status = newStatus;
  }

  // Try DB update as well
  try {
    const { data: dbOrder } = await supabase
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .single();

    if (dbOrder) {
      await supabase.from('orders').update({ status: newStatus }).eq('id', orderId);
      if (!targetOrder) targetOrder = dbOrder;
    }
  } catch (e) {
    console.warn('Supabase status update error:', e);
  }

  if (targetOrder) {
    const formattedItems = (targetOrder.order_items || []).map((i: any) => ({
      name: i.item_name || i.name || 'Peptide',
      size: i.size || 'Standard',
      quantity: i.quantity || 1,
      price: Number(i.price) || 0,
    }));

    // Trigger Email Notification to Customer for the updated status!
    await sendOrderStatusEmail({
      orderNumber: targetOrder.order_number || `XFP-${orderId.substring(0, 6)}`,
      customerEmail: targetOrder.customer_email,
      customerName: targetOrder.customer_name || 'Customer',
      status: newStatus,
      totalAmount: Number(targetOrder.total_amount),
      paymentMethod: targetOrder.payment_method,
      items: formattedItems,
    });
  }

  return { success: true };
}

export async function editOrderAction(
  orderId: string,
  payload: Partial<CreateOrderPayload>
): Promise<{ success: boolean; error?: string }> {
  const supabase = getAdminSupabase();

  // Update in-memory store
  const memIndex = globalOrdersStore.findIndex((o) => o.id === orderId || o.order_number === orderId);
  if (memIndex !== -1) {
    const existing = globalOrdersStore[memIndex];
    globalOrdersStore[memIndex] = {
      ...existing,
      customer_name: payload.customerName ?? existing.customer_name,
      customer_email: payload.customerEmail ?? existing.customer_email,
      customer_phone: payload.customerPhone ?? existing.customer_phone,
      shipping_address: payload.shippingAddress ?? existing.shipping_address,
      city: payload.city ?? existing.city,
      postal_code: payload.postalCode ?? existing.postal_code,
      payment_method: payload.paymentMethod ?? existing.payment_method,
      shipping_fee: payload.shippingFee ?? existing.shipping_fee,
      total_amount: payload.totalAmount ?? existing.total_amount,
      status: payload.status ?? existing.status,
    };
  }

  // Update Supabase DB
  try {
    await supabase
      .from('orders')
      .update({
        ...(payload.customerName ? { customer_name: payload.customerName } : {}),
        ...(payload.customerEmail ? { customer_email: payload.customerEmail } : {}),
        ...(payload.customerPhone ? { customer_phone: payload.customerPhone } : {}),
        ...(payload.shippingAddress ? { shipping_address: payload.shippingAddress } : {}),
        ...(payload.city ? { city: payload.city } : {}),
        ...(payload.postalCode ? { postal_code: payload.postalCode } : {}),
        ...(payload.paymentMethod ? { payment_method: payload.paymentMethod } : {}),
        ...(payload.totalAmount ? { total_amount: payload.totalAmount } : {}),
        ...(payload.status ? { status: payload.status } : {}),
      })
      .eq('id', orderId);
  } catch (err: any) {
    console.warn('DB order edit fallback warning:', err?.message);
  }

  return { success: true };
}

export async function deleteOrderAction(orderId: string): Promise<{ success: boolean; error?: string }> {
  const supabase = getAdminSupabase();

  // 1. Remove from global memory store
  globalOrdersStore = globalOrdersStore.filter((o) => o.id !== orderId && o.order_number !== orderId);

  // 2. Remove from Supabase DB
  try {
    await supabase.from('order_items').delete().eq('order_id', orderId);
    await supabase.from('orders').delete().eq('id', orderId);
  } catch (err: any) {
    console.warn('DB delete order warning:', err?.message);
  }

  return { success: true };
}

export async function fetchAdminOrdersAction() {
  const supabase = getAdminSupabase();
  let dbOrders: any[] = [];

  try {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (*)
      `)
      .order('created_at', { ascending: false });

    if (!error && data) {
      dbOrders = data;
    }
  } catch (err: any) {
    console.warn('Fetch DB orders fallback:', err?.message);
  }

  // Merge in-memory orders with DB orders avoiding duplicates
  const existingDbIds = new Set(dbOrders.map((o) => o.id || o.order_number));
  const uniqueMemoryOrders = globalOrdersStore.filter((o) => !existingDbIds.has(o.id) && !existingDbIds.has(o.order_number));

  const merged = [...uniqueMemoryOrders, ...dbOrders];

  return { success: true, orders: merged, currentShippingFee: globalCodShippingFee };
}
