-- Schema for checkout enhancements: addresses, payment tracking, shipping costs

-- User addresses table for saving shipping addresses
CREATE TABLE IF NOT EXISTS public.user_addresses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  address_line1 TEXT NOT NULL,
  address_line2 TEXT,
  city TEXT NOT NULL,
  postal_code TEXT NOT NULL,
  country TEXT NOT NULL,
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.user_addresses ENABLE ROW LEVEL SECURITY;

-- Users can read their own addresses
CREATE POLICY "Users can read own addresses" ON public.user_addresses
  FOR SELECT USING (user_id = auth.uid());

-- Users can insert their own addresses
CREATE POLICY "Users can insert own addresses" ON public.user_addresses
  FOR INSERT WITH CHECK (user_id = auth.uid());

-- Users can update their own addresses
CREATE POLICY "Users can update own addresses" ON public.user_addresses
  FOR UPDATE USING (user_id = auth.uid());

-- Users can delete their own addresses
CREATE POLICY "Users can delete own addresses" ON public.user_addresses
  FOR DELETE USING (user_id = auth.uid());

-- Index for faster lookups
CREATE INDEX IF NOT EXISTS idx_user_addresses_user_id ON public.user_addresses(user_id);
CREATE INDEX IF NOT EXISTS idx_user_addresses_default ON public.user_addresses(user_id, is_default) WHERE is_default = true;

-- Add payment-related columns to orders table
ALTER TABLE public.orders 
  ADD COLUMN IF NOT EXISTS payment_method TEXT,
  ADD COLUMN IF NOT EXISTS payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'processing', 'completed', 'failed', 'refunded')),
  ADD COLUMN IF NOT EXISTS payment_transaction_id TEXT,
  ADD COLUMN IF NOT EXISTS shipping_cost DECIMAL(10, 2) DEFAULT 0 CHECK (shipping_cost >= 0),
  ADD COLUMN IF NOT EXISTS tax_amount DECIMAL(10, 2) DEFAULT 0 CHECK (tax_amount >= 0),
  ADD COLUMN IF NOT EXISTS estimated_delivery_date DATE;

-- Update trigger for updated_at
CREATE TRIGGER update_user_addresses_updated_at
  BEFORE UPDATE ON public.user_addresses
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

