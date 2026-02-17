CREATE TABLE posts(
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    author_id uuid REFERENCES profiles(id) NOT NULL,
    category  text NOT NULL,
    title  text NOT NULL,
    content text,
    status text DEFAULT 'active',
    created_at timestamp with time zone DEFAULT now()
);
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Dev temporary access"
ON posts FOR ALL
USING (true)
WITH CHECK (true);