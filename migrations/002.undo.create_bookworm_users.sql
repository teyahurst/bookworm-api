ALTER TABLE bookworm_books
    DROP COLUMN IF EXISTS user_name;

DROP TABLE IF EXISTS bookworm_users CASCADE;