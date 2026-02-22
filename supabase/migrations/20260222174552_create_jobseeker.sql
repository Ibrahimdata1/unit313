CREATE TABLE jobseeker(
    profile_id uuid PRIMARY KEY REFERENCES profiles(id),
    resume_url TEXT,
    skills TEXT[],
    expected_salary NUMERIC,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL
)