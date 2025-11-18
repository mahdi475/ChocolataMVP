INSERT INTO storage.buckets (id, name, public) 
VALUES ('seller_docs', 'seller_docs', false)
ON CONFLICT (id) DO NOTHING;

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

