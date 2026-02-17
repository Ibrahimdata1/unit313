ALTER TABLE profiles
    ALTER COLUMN full_name SET NOT NULL,
    ADD CONSTRAINT at_least_one_role CHECK (is_entrepreneur OR is_investor OR is_jobseeker);