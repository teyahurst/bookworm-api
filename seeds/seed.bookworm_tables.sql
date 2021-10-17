BEGIN;

TRUNCATE
    bookworm_users,
    bookworm_books
    RESTART IDENTITY CASCADE;

INSERT INTO bookworm_users (user_name, full_name, nickname, password)
VALUES
  ('dunder', 'Dunder Mifflin', null, '$2a$12$3.Lnq7n85D.6ylF702sT8OqnGAjfmY9Lc50Kri6kIHtHgN9ZuWbCK'),
  ('b.deboop', 'Bodeep Deboop', 'Bo', '$2a$12$WErO7PHNreMRanGKwzKoeuU0wApWj1ehok90EaPgRhq56VR1XI8se'),
  ('c.bloggs', 'Charlie Bloggs', 'Charlie', '$2a$12$jZViwXgMNrOBW1bf6oOpF.BLUAeckCEQhvy4uxSWI9fc7d3bbADua'),
  ('s.smith', 'Sam Smith', 'Sam', '$2a$12$k.ZUXQFTrXhFNRV90DJSF.M.IhdOQ4DJ.Hjo8NMVX1W08irheUNdK'),
  ('lexlor', 'Alex Taylor', 'Lex', '$2a$12$YlnZA/e7Y6RkI5A2tGVcfem9gaGcLR5eyDMa5q/TaJiIYyvlH/Hz.'),
  ('wippy', 'Ping Won In', 'Ping', '$2a$12$owLStfbw.diskhUyJIiMZuYum6iUKLQmGQhiMSZ07TEPuAETzBbSi');

INSERT INTO bookworm_books(title, author, user_name, description)
VALUES 
    ('Harry Potter and the Sorcerers Stone', 'J.K. Rowling', 'dunder', 'Magical boy joins magical world'),
    ('Game of Thrones', 'George R.R. Martin', 'dunder', 'Dragons'),
    ('The Girl with the Dragon Tattoo', 'Steig Larson', 's.smith', 'Girl solves mysteries'),
    ('And Then there were none', 'Agatha Christie', 'wippy', 'People on island disappear one by one.'),
    ('New book', 'New Author', 's.smith', 'new description');


COMMIT;