-- Create the seller_docs bucket (matching the code)
INSERT INTO storage.buckets (id, name, public)
VALUES ('seller_docs', 'seller_docs', false)
ON CONFLICT (id) DO NOTHING;

-- Drop old policies if they exist
DROP POLICY IF EXISTS "Allow seller document uploads" ON storage.objects;
DROP POLICY IF EXISTS "Allow seller document views" ON storage.objects;
DROP POLICY IF EXISTS "Allow admin to view all documents" ON storage.objects;

-- Policy: Allow authenticated sellers to upload documents
CREATE POLICY "seller_docs_insert_policy"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'seller_docs'
);

-- Policy: Allow authenticated users to view documents (seller + admin)
CREATE POLICY "seller_docs_select_policy"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'seller_docs'
);

-- Policy: Allow sellers to update their own documents
CREATE POLICY "seller_docs_update_policy"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'seller_docs'
);

-- Policy: Allow sellers to delete their own documents
CREATE POLICY "seller_docs_delete_policy"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'seller_docs'
);
