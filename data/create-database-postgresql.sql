CREATE TABLE IF NOT EXISTS languages (
  id SERIAL PRIMARY KEY,
  language TEXT NOT NULL UNIQUE,
  complete BOOLEAN DEFAULT FALSE  -- TRUE or FALSE (incomplete or complete)
);

CREATE TABLE IF NOT EXISTS meanings (
  id SERIAL PRIMARY KEY,
  meaning TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS words (
  id SERIAL PRIMARY KEY,
  language_id INTEGER NOT NULL,
  word TEXT NOT NULL,
  prn TEXT,
  audio TEXT,
  seq INTEGER,
  FOREIGN KEY (language_id) REFERENCES languages(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS word_meanings (
  word_id INTEGER NOT NULL,
  meaning_id INTEGER NOT NULL,
  PRIMARY KEY (word_id, meaning_id),
  FOREIGN KEY (word_id) REFERENCES words(id) ON DELETE CASCADE,
  FOREIGN KEY (meaning_id) REFERENCES meanings(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  username TEXT NOT NULL UNIQUE,
  email TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  mode_day BOOLEAN DEFAULT TRUE,  -- TRUE or FALSE
  font_size INTEGER DEFAULT 1 CHECK (font_size IN (1, 2, 3)),  -- 1 = Small, 2 = Normal, 3 = Large
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS user_words (
  user_id INTEGER NOT NULL,
  word_id INTEGER NOT NULL,
  progress INTEGER DEFAULT 0,
  learned_at TIMESTAMPTZ DEFAULT NULL,
  next_at TIMESTAMPTZ DEFAULT NULL,
  PRIMARY KEY (user_id, word_id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (word_id) REFERENCES words(id) ON DELETE CASCADE
);
