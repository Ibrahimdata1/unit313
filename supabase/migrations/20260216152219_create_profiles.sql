CREATE TABLE profiles (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    full_name text,
    avatar_url text,
    bio text,
    is_investor boolean DEFAULT false,
    is_jobseeker boolean DEFAULT false,
    is_entrepreneur boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY