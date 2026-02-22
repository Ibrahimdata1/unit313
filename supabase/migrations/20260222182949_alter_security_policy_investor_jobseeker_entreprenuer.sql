ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Dev temporary access" ON profiles;
CREATE POLICY "Users can update own profile"
ON profiles FOR UPDATE
USING (auth.uid()=id);

ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Dev temporary access" ON posts;
CREATE POLICY "Public posts are viewable by everyone"
on posts FOR SELECT
USING (true);

CREATE POLICY "Users can manage their own posts"
ON posts FOR ALL
USING (auth.uid()=author_id);


ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Dev temporary access" ON applications;
CREATE POLICY "Applicants and Owners can view applications"
ON applications FOR SELECT
USING (auth.uid()=applicant_id OR auth.uid() IN (SELECT author_id FROM posts WHERE id = post_id));

CREATE POLICY "Users can apply"
ON applications FOR INSERT
WITH CHECK (auth.uid()=applicant_id);

CREATE POLICY "Users can delete own applications"
ON applications FOR DELETE
USING (auth.uid() = applicant_id);

ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Dev temporary access" ON notifications;
CREATE POLICY "Users can only see their own notifications"
ON notifications FOR ALL
USING (auth.uid()=user_id);

ALTER TABLE investor ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Investor can manage own data"
ON investor FOR ALL
USING (auth.uid()=profile_id)
WITH CHECK(auth.uid()=profile_id);

ALTER TABLE jobseeker ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Jobseeker can manage own data"
ON jobseeker FOR ALL
USING (auth.uid()=profile_id)
WITH CHECK(auth.uid()=profile_id);

ALTER TABLE IF EXISTS entreprenuer RENAME TO entrepreneur;
ALTER TABLE entrepreneur ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Entreprenuer can manage own data"
ON entrepreneur FOR ALL
USING (auth.uid()=profile_id)
WITH CHECK(auth.uid()=profile_id);
