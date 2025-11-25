-- Policy: Only allow verified sellers to create products
-- Drop existing policy if it exists
DROP POLICY IF EXISTS "Sellers can insert products" ON products;

-- Create new policy that checks verification status
CREATE POLICY "Only verified sellers can create products"
ON products FOR INSERT
TO authenticated
WITH CHECK (
  seller_id = auth.uid() AND
  EXISTS (
    SELECT 1 FROM seller_verifications
    WHERE user_id = auth.uid()
    AND status = 'approved'
  )
);

-- Policy: Only allow verified sellers to update their products
DROP POLICY IF EXISTS "Sellers can update own products" ON products;

CREATE POLICY "Only verified sellers can update products"
ON products FOR UPDATE
TO authenticated
USING (seller_id = auth.uid())
WITH CHECK (
  seller_id = auth.uid() AND
  EXISTS (
    SELECT 1 FROM seller_verifications
    WHERE user_id = auth.uid()
    AND status = 'approved'
  )
);

-- Policy: Sellers can view their own products regardless of verification
DROP POLICY IF EXISTS "Sellers can view own products" ON products;

CREATE POLICY "Sellers can view own products"
ON products FOR SELECT
TO authenticated
USING (seller_id = auth.uid());

-- Policy: Buyers and public can only see products from verified sellers
DROP POLICY IF EXISTS "Public can view products" ON products;

CREATE POLICY "Public can view verified seller products"
ON products FOR SELECT
TO public
USING (
  EXISTS (
    SELECT 1 FROM seller_verifications
    WHERE user_id = products.seller_id
    AND status = 'approved'
  )
);

-- Ensure authenticated users can also see verified products
CREATE POLICY "Authenticated can view verified seller products"
ON products FOR SELECT
TO authenticated
USING (
  seller_id != auth.uid() AND
  EXISTS (
    SELECT 1 FROM seller_verifications
    WHERE user_id = products.seller_id
    AND status = 'approved'
  )
);
