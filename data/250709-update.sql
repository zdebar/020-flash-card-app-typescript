CREATE TABLE IF NOT EXISTS languages (
  id SERIAL PRIMARY KEY,
  "name" TEXT NOT NULL UNIQUE -- e.g. English, Spanish, French
);

ALTER TABLE items
ADD COLUMN language_id INTEGER, -- language id
ADD FOREIGN KEY (language_id) REFERENCES languages(id) ON DELETE SET NULL;

ALTER TABLE blocks
ADD COLUMN language_id INTEGER, -- language id
ADD FOREIGN KEY (language_id) REFERENCES languages(id) ON DELETE SET NULL;

ALTER TABLE user_score
ADD COLUMN language_id INTEGER, -- language id
ADD FOREIGN KEY (language_id) REFERENCES languages(id) ON DELETE SET NULL;
PRIMARY KEY (user_id, day, language_id)

ALTER TABLE public.user_score DROP CONSTRAINT user_score_pkey;
ALTER TABLE public.user_score ADD CONSTRAINT user_score_pkey PRIMARY KEY (user_id, day, language_id);

CREATE INDEX idx_items_language_id ON items(language_id);
CREATE INDEX idx_blocks_language_id ON blocks(language_id);
CREATE INDEX idx_user_score_language_id ON user_score(language_id);

ALTER TABLE items
RENAME COLUMN english TO translation;

ALTER TABLE public.user_score DROP CONSTRAINT user_score_pkey;
ALTER TABLE public.user_score ADD CONSTRAINT user_score_pkey PRIMARY KEY (user_id, day, language_id);