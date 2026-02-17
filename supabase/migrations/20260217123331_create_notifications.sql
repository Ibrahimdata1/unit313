CREATE TABLE notifications(
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid REFERENCES profiles(id) NOT NULL,
    title text NOT NULL,
    content text,
    type text,
    link_id uuid,
    is_read boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT now()
);
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "dev temporary access"
ON notifications FOR ALL
USING(true)
WITH CHECK(true)