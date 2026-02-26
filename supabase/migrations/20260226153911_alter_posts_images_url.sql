ALTER TABLE posts
    ALTER COLUMN image_url TYPE JSONB
    USING image_url::JSONB;