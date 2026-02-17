Alter TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Dev temporary access" ON profiles FOR ALL USING (true)
WITH
    CHECK (true);