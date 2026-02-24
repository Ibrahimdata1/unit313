DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can manage own profile"
ON profiles FOR ALL
TO authenticated
USING (auth.uid()=id)
WITH CHECK(auth.uid()=id)