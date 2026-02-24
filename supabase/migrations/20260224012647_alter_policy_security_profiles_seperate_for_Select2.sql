DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
DROP POLICY IF EXISTS "Users can select and update own profile" ON profiles;
CREATE POLICY "Users can insert own profile"
ON profiles FOR INSERT
WITH CHECK(auth.uid()=id);

CREATE POLICY "Users can update own profile"
ON profiles FOR UPDATE
USING (auth.uid()=id);

CREATE POLICY "Users can select own profile"
ON profiles FOR SELECT
USING (auth.uid()=id);

CREATE POLICY "Users can delete own profile"
ON profiles FOR DELETE
USING (auth.uid()=id);
