-- Storage setup for Chocolata MVP

-- Create bucket for seller verification documents
INSERT INTO storage.buckets (id, name, public) 
VALUES ('seller_docs', 'seller_docs', false)
ON CONFLICT (id) DO NOTHING;

-- Create bucket for product images (public)
INSERT INTO storage.buckets (id, name, public) 
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

-- Seller documents policies
CREATE POLICY "Users can upload own documents" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'seller_docs' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Users can read own documents" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'seller_docs' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Admins can read all documents" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'seller_docs' AND
    EXISTS (
      SELECT 1 FROM public.users
      WHERE users.id = auth.uid() AND users.role = 'admin'
    )
  );

CREATE POLICY "Users can delete own documents" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'seller_docs' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

-- Product images policies
CREATE POLICY "Sellers can upload product images" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'product-images' AND
    (storage.foldername(name))[1] = auth.uid()::text AND
    EXISTS (
      SELECT 1 FROM public.users
      WHERE users.id = auth.uid() AND users.role = 'seller'
    )
  );

CREATE POLICY "Everyone can view product images" ON storage.objects
  FOR SELECT USING (bucket_id = 'product-images');

CREATE POLICY "Sellers can update own product images" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'product-images' AND
    (storage.foldername(name))[1] = auth.uid()::text AND
    EXISTS (
      SELECT 1 FROM public.users
      WHERE users.id = auth.uid() AND users.role = 'seller'
    )
  );

CREATE POLICY "Sellers can delete own product images" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'product-images' AND
    (storage.foldername(name))[1] = auth.uid()::text AND
    EXISTS (
      SELECT 1 FROM public.users
      WHERE users.id = auth.uid() AND users.role = 'seller'
    )
  );

