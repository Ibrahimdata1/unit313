CREATE TABLE investment(
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    investor_id uuid REFERENCES investor(profile_id),
    post_id uuid REFERENCES posts(id),
    amount NUMERIC NOT NULL,
    share_percentage NUMERIC,
    status TEXT DEFAULT 'pending',
    investment_date TIMESTAMPTZ,
    contract_url TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL
)