CREATE TABLE investor(
    profile_id uuid PRIMARY KEY REFERENCES profiles(id),
    investment_capacity NUMERIC,
    interest_sector TEXT[],
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL
)