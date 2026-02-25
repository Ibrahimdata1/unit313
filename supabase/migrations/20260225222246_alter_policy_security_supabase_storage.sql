CREATE POLICY "Allow authenticated users to upload" 
ON storage.objects FOR INSERT 
TO authenticated 
WITH CHECK (bucket_id = 'post-images');

CREATE POLICY "Allow owners to delete their own images" 
ON storage.objects FOR DELETE 
TO authenticated 
USING (
  bucket_id = 'post-images' AND 
  auth.uid() = owner
);

CREATE POLICY "Allow owners to update their own images" 
ON storage.objects FOR UPDATE 
TO authenticated 
USING (
  bucket_id = 'post-images' AND 
  auth.uid() = owner
);

CREATE POLICY "Allow anyone to view images" 
ON storage.objects FOR SELECT 
TO public 
USING (bucket_id = 'post-images');