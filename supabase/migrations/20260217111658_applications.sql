CREATE TABLE applications(
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    post_id uuid REFERENCES posts(id),
    applicant_id uuid REFERENCES profiles(id),
    message text,
    status text DEFAULT 'pending',
    created_at timestamp with time zone DEFAULT now()
);
ALTER TABLE applications ENABLE ROW LEVEL SECURITY

CREATE POLICY "dev temporary access"
ON applications FOR ALL
USING (true)
WITH CHECK(true)
