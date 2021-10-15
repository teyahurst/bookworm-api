CREATE TABLE bookworm_books (
    id SERIAL PRIMARY KEY,
    title TEXT,
    author TEXT,
    description TEXT,
    date_added TIMESTAMPTZ DEFAULT now() NOT NULL
);