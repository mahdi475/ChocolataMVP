-- Add user_id column to orders table if it doesn't exist
-- This allows customer service to track all orders by a specific user

-- First, check if the column exists, if not add it
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'orders' AND column_name = 'user_id'
  ) THEN
    ALTER TABLE orders ADD COLUMN user_id UUID REFERENCES auth.users(id);
    
    -- Add an index for faster user_id lookups
    CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
    
    -- Update existing orders to set user_id based on shipping_email
    -- (This is a best-effort migration for existing data)
    UPDATE orders o
    SET user_id = u.id
    FROM users u
    WHERE o.shipping_email = u.email
    AND o.user_id IS NULL;
    
    RAISE NOTICE 'user_id column added to orders table successfully';
  ELSE
    RAISE NOTICE 'user_id column already exists in orders table';
  END IF;
END $$;

-- Grant necessary permissions
GRANT SELECT ON orders TO authenticated;
GRANT INSERT ON orders TO authenticated;
GRANT UPDATE ON orders TO authenticated;

-- Create a function to get all orders for a user (for customer service)
CREATE OR REPLACE FUNCTION get_user_orders(search_user_id UUID)
RETURNS TABLE (
  order_id UUID,
  status TEXT,
  total_amount NUMERIC,
  shipping_name TEXT,
  shipping_email TEXT,
  shipping_address TEXT,
  created_at TIMESTAMPTZ
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    o.id as order_id,
    o.status,
    o.total_amount,
    o.shipping_name,
    o.shipping_email,
    o.shipping_address,
    o.created_at
  FROM orders o
  WHERE o.user_id = search_user_id
  ORDER BY o.created_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION get_user_orders(UUID) TO authenticated;

COMMENT ON COLUMN orders.user_id IS 'Reference to the user who placed the order - for customer service tracking';
COMMENT ON FUNCTION get_user_orders(UUID) IS 'Customer service function to retrieve all orders for a specific user';
