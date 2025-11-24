-- Create a private bucket for seller verification documents.
INSERT INTO storage.buckets (id, name, public)
VALUES ('seller_documents', 'seller_documents', false)
ON CONFLICT (id) DO NOTHING;

-- Create a public bucket for product images.
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

-- Policy: Allow sellers to upload to the 'product-images' bucket.
CREATE POLICY "Allow seller product image uploads"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'product-images'
);

-- Policy: Allow anyone to view product images.
CREATE POLICY "Allow public read access to product images"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'product-images'
);

-- Policy: Allow sellers to upload documents for their own verification.
CREATE POLICY "Allow seller document uploads"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'seller_documents' AND
  auth.uid() = (storage.foldername(name))[1]::uuid
);

-- Policy: Allow sellers to view their own uploaded documents.
CREATE POLICY "Allow seller document views"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'seller_documents' AND
  auth.uid() = (storage.foldername(name))[1]::uuid
);

-- Policy: Allow admins to view any document for verification purposes.
CREATE POLICY "Allow admin to view all documents"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'seller_documents' AND
  public.is_admin()
);