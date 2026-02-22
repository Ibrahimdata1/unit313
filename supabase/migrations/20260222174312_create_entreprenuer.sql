CREATE TABLE entreprenuer(
    profile_id uuid PRIMARY KEY REFERENCES profiles(id),
    company_name TEXT,
    business_plan_url TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL
)