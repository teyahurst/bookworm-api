CREATE TABLE bookworm_users (
    id SERIAL PRIMARY KEY,
    user_name TEXT NOT NULL UNIQUE,
    full_name TEXT NOT NULL,
    password TEXT NOT NULL,
    nickname TEXT,
    date_created TIMESTAMP DEFAULT now() NOT NULL
);

ALTER TABLE bookworm_books
    ADD COLUMN
        user_name TEXT REFERENCES bookworm_users(user_name);

