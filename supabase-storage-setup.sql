-- Create a private bucket for seller verification documents.
INSERT INTO storage.buckets (id, name, public)
VALUES ('seller_documents', 'seller_documents', false)
ON CONFLICT (id) DO NOTHING;

-- Policy: Allow sellers to upload documents for their own verification.
-- The user must be authenticated, and the file path must match their user ID.
CREATE POLICY "Allow seller document uploads"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'seller_documents' AND
  auth.uid() = (storage.foldername(name))[1]::uuid AND
  (storage.foldername(name))[2] IS NULL -- Disallow subfolders
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
  public.is_admin() -- Assumes is_admin() function from your setup
);
