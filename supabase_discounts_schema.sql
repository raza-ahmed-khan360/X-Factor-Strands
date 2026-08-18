-- ==============================================================================
-- X-Factor Peptides - Discounts & 1st-Time Buyer Tracking Schema (Supabase)
-- ==============================================================================

-- 0. Ensure Orders Table Exists with All Required Columns
CREATE TABLE IF NOT EXISTS public.orders (
    id TEXT PRIMARY KEY,
    order_number TEXT,
    customer_name TEXT,
    customer_email TEXT,
    customer_phone TEXT,
    shipping_address TEXT,
    city TEXT,
    postal_code TEXT,
    payment_method TEXT,
    shipping_fee NUMERIC,
    status TEXT,
    total_amount NUMERIC,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Safely add missing columns to orders in case the table existed but was incomplete
ALTER TABLE public.orders 
ADD COLUMN IF NOT EXISTS customer_name TEXT,
ADD COLUMN IF NOT EXISTS customer_email TEXT,
ADD COLUMN IF NOT EXISTS customer_phone TEXT,
ADD COLUMN IF NOT EXISTS coupon_code TEXT,
ADD COLUMN IF NOT EXISTS discount_amount NUMERIC(10, 2) DEFAULT 0.00;

-- 1. Create Discounts Table
CREATE TABLE IF NOT EXISTS public.discounts (
    id TEXT PRIMARY KEY,
    code TEXT UNIQUE NOT NULL,
    discount_type TEXT NOT NULL CHECK (discount_type IN ('percentage', 'fixed')),
    discount_value NUMERIC(10, 2) NOT NULL CHECK (discount_value > 0),
    first_time_only BOOLEAN NOT NULL DEFAULT TRUE,
    min_order_amount NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    usage_count INTEGER NOT NULL DEFAULT 0,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Create Indexes for fast lookup
CREATE INDEX IF NOT EXISTS idx_orders_customer_email ON public.orders(customer_email);
CREATE INDEX IF NOT EXISTS idx_orders_customer_phone ON public.orders(customer_phone);
CREATE INDEX IF NOT EXISTS idx_discounts_code ON public.discounts(code);

-- 3. Enable Row Level Security (RLS)
ALTER TABLE public.discounts ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if re-running
DROP POLICY IF EXISTS "Allow public read access to active discounts" ON public.discounts;
DROP POLICY IF EXISTS "Allow full access for service role" ON public.discounts;

-- Allow public to read active discounts for checkout validation
CREATE POLICY "Allow public read access to active discounts"
ON public.discounts
FOR SELECT
USING (is_active = true);

-- Allow Service Role (Admin Server Actions) full access
CREATE POLICY "Allow full access for service role"
ON public.discounts
FOR ALL
USING (true)
WITH CHECK (true);

-- 4. Seed Initial Default Discount Codes
INSERT INTO public.discounts (id, code, discount_type, discount_value, first_time_only, min_order_amount, is_active, description)
VALUES 
    ('disc_welcome10', 'WELCOME10', 'percentage', 10.00, TRUE, 0.00, TRUE, '10% OFF exclusively for first-time research buyers'),
    ('disc_first20', 'FIRST20', 'percentage', 20.00, TRUE, 0.00, TRUE, '20% OFF for first-time orders over $0')
ON CONFLICT (code) DO NOTHING;
