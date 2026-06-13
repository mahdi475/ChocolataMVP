-- Create activity_log table to track ALL changes
CREATE TABLE IF NOT EXISTS activity_log (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  user_id UUID REFERENCES users(id),
  user_email TEXT,
  user_name TEXT,
  action_type TEXT NOT NULL, -- 'create', 'update', 'delete'
  table_name TEXT NOT NULL, -- 'products', 'orders', 'seller_verifications', etc.
  record_id TEXT NOT NULL,
  old_data JSONB,
  new_data JSONB,
  changes JSONB, -- Specific fields that changed
  ip_address TEXT,
  user_agent TEXT
);

-- Create index for faster queries
CREATE INDEX idx_activity_log_created_at ON activity_log(created_at DESC);
CREATE INDEX idx_activity_log_user_id ON activity_log(user_id);
CREATE INDEX idx_activity_log_table_name ON activity_log(table_name);
CREATE INDEX idx_activity_log_action_type ON activity_log(action_type);

-- Enable RLS
ALTER TABLE activity_log ENABLE ROW LEVEL SECURITY;

-- Policy: Only admins can view activity logs
CREATE POLICY "Admins can view all activity logs"
ON activity_log FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM users
    WHERE id = auth.uid()
    AND role = 'admin'
  )
);

-- Function to log product changes
CREATE OR REPLACE FUNCTION log_product_changes()
RETURNS TRIGGER AS $$
DECLARE
  user_info RECORD;
BEGIN
  -- Get user information
  SELECT email, full_name INTO user_info
  FROM users
  WHERE id = COALESCE(NEW.seller_id, OLD.seller_id);

  IF TG_OP = 'INSERT' THEN
    INSERT INTO activity_log (
      user_id, user_email, user_name, action_type, table_name, record_id, new_data
    ) VALUES (
      NEW.seller_id, user_info.email, user_info.full_name, 'create', 'products', NEW.id::TEXT, to_jsonb(NEW)
    );
    RETURN NEW;
  ELSIF TG_OP = 'UPDATE' THEN
    INSERT INTO activity_log (
      user_id, user_email, user_name, action_type, table_name, record_id, old_data, new_data, changes
    ) VALUES (
      NEW.seller_id, user_info.email, user_info.full_name, 'update', 'products', NEW.id::TEXT, 
      to_jsonb(OLD), to_jsonb(NEW),
      jsonb_build_object(
        'name', CASE WHEN OLD.name != NEW.name THEN jsonb_build_object('old', OLD.name, 'new', NEW.name) ELSE NULL END,
        'price', CASE WHEN OLD.price != NEW.price THEN jsonb_build_object('old', OLD.price, 'new', NEW.price) ELSE NULL END,
        'description', CASE WHEN OLD.description != NEW.description THEN jsonb_build_object('old', OLD.description, 'new', NEW.description) ELSE NULL END,
        'stock', CASE WHEN OLD.stock != NEW.stock THEN jsonb_build_object('old', OLD.stock, 'new', NEW.stock) ELSE NULL END
      )
    );
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    INSERT INTO activity_log (
      user_id, user_email, user_name, action_type, table_name, record_id, old_data
    ) VALUES (
      OLD.seller_id, user_info.email, user_info.full_name, 'delete', 'products', OLD.id::TEXT, to_jsonb(OLD)
    );
    RETURN OLD;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to log order changes
CREATE OR REPLACE FUNCTION log_order_changes()
RETURNS TRIGGER AS $$
DECLARE
  user_info RECORD;
BEGIN
  -- Get user information
  SELECT email, full_name INTO user_info
  FROM users
  WHERE id = COALESCE(NEW.user_id, OLD.user_id);

  IF TG_OP = 'INSERT' THEN
    INSERT INTO activity_log (
      user_id, user_email, user_name, action_type, table_name, record_id, new_data
    ) VALUES (
      NEW.user_id, user_info.email, user_info.full_name, 'create', 'orders', NEW.id::TEXT, to_jsonb(NEW)
    );
    RETURN NEW;
  ELSIF TG_OP = 'UPDATE' THEN
    INSERT INTO activity_log (
      user_id, user_email, user_name, action_type, table_name, record_id, old_data, new_data, changes
    ) VALUES (
      NEW.user_id, user_info.email, user_info.full_name, 'update', 'orders', NEW.id::TEXT,
      to_jsonb(OLD), to_jsonb(NEW),
       jsonb_build_object(
        'status', CASE WHEN OLD.status != NEW.status THEN jsonb_build_object('old', OLD.status, 'new', NEW.status) ELSE NULL END,
        'total', CASE WHEN OLD.total != NEW.total THEN jsonb_build_object('old', OLD.total, 'new', NEW.total) ELSE NULL END
      )
    );
    RETURN NEW;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to log seller verification changes
CREATE OR REPLACE FUNCTION log_verification_changes()
RETURNS TRIGGER AS $$
DECLARE
  user_info RECORD;
BEGIN
  -- Get user information
  SELECT email, full_name INTO user_info
  FROM users
  WHERE id = COALESCE(NEW.user_id, OLD.user_id);

  IF TG_OP = 'INSERT' THEN
    INSERT INTO activity_log (
      user_id, user_email, user_name, action_type, table_name, record_id, new_data
    ) VALUES (
      NEW.user_id, user_info.email, user_info.full_name, 'create', 'seller_verifications', NEW.id::TEXT, to_jsonb(NEW)
    );
    RETURN NEW;
  ELSIF TG_OP = 'UPDATE' THEN
    INSERT INTO activity_log (
      user_id, user_email, user_name, action_type, table_name, record_id, old_data, new_data, changes
    ) VALUES (
      NEW.user_id, user_info.email, user_info.full_name, 'update', 'seller_verifications', NEW.id::TEXT,
      to_jsonb(OLD), to_jsonb(NEW),
      jsonb_build_object(
        'status', CASE WHEN OLD.status != NEW.status THEN jsonb_build_object('old', OLD.status, 'new', NEW.status) ELSE NULL END
      )
    );
    RETURN NEW;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create triggers for products
DROP TRIGGER IF EXISTS product_changes_trigger ON products;
CREATE TRIGGER product_changes_trigger
AFTER INSERT OR UPDATE OR DELETE ON products
FOR EACH ROW EXECUTE FUNCTION log_product_changes();

-- Create triggers for orders
DROP TRIGGER IF EXISTS order_changes_trigger ON orders;
CREATE TRIGGER order_changes_trigger
AFTER INSERT OR UPDATE ON orders
FOR EACH ROW EXECUTE FUNCTION log_order_changes();

-- Create triggers for seller_verifications
DROP TRIGGER IF EXISTS verification_changes_trigger ON seller_verifications;
CREATE TRIGGER verification_changes_trigger
AFTER INSERT OR UPDATE ON seller_verifications
FOR EACH ROW EXECUTE FUNCTION log_verification_changes();
