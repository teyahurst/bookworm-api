CREATE TABLE bookworm_books (
    id SERIAL PRIMARY KEY,
    title TEXT,
    author TEXT,
    description TEXT,
    img TEXT UNIQUE
);