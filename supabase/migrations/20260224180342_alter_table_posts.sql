ALTER TABLE posts
    --track milestones posts
    ADD COLUMN IF NOT EXISTS milestones jsonb DEFAULT '[]'::jsonb,
    --investment info
    ADD COLUMN IF NOT EXISTS target_amount NUMERIC DEFAULT 0,
    ADD COLUMN IF NOT EXISTS current_amount NUMERIC DEFAULT 0,
    --entrepreneur info
    ADD COLUMN IF NOT EXISTS needed_positions int DEFAULT 1,
    ADD COLUMN IF NOT EXISTS filled_positions int DEFAULT 0,
    --update post
    ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT now();
ALTER TABLE posts ALTER COLUMN status SET DEFAULT 'open';