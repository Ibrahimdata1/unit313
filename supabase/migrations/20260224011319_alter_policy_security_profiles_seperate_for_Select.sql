DROP POLICY IF EXISTS "Users can manage own profile" ON profiles;
CREATE POLICY "Users can insert own profile"
ON profiles FOR INSERT
WITH CHECK(auth.uid()=id);

CREATE POLICY "Users can select and update own profile"
ON profiles FOR ALL
USING (auth.uid()=id)
