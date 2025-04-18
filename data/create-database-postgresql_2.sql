-- Enable the UUID extension
CREATE EXTENSION IF NOT EXISTS citext;

-- Create tables

CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(255) NOT NULL UNIQUE,
  email CITEXT NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  mode_day TEXT DEFAULT 'default' CHECK (mode_day IN ('default', 'light', 'dark')),
  font_size TEXT DEFAULT 'normal' CHECK (font_size IN ('small', 'normal', 'large')),
  notifications BOOLEAN DEFAULT TRUE
  subscription_type TEXT DEFAULT 'non-paid' CHECK (subscription_type IN ('non-paid', 'paid', 'testing'));
);

CREATE TABLE IF NOT EXISTS languages (
  id SERIAL PRIMARY KEY,
  language TEXT NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS words (
  id SERIAL PRIMARY KEY,
  language_id INTEGER NOT NULL, 
  czech TEXT NOT NULL,
  article TEXT,
  word TEXT NOT NULL, 
  pronunciation TEXT,
  audio TEXT,
  position INTEGER, 
  category TEXT CHECK (category IN ('word', 'grammar', 'phrase')),
  block_number INTERGER,
  cefr_level TEXT CHECK (cefr_level IN ('A1', 'A2', 'B1', 'B2', 'C1', 'C2')),
  FOREIGN KEY (language_id) REFERENCES languages(id) ON DELETE CASCADE
);

CREATE INDEX idx_words_language ON words (language_id);

CREATE TABLE IF NOT EXISTS word_notes (
  id SERIAL PRIMARY KEY,
  word_id INTEGER NOT NULL, 
  user_id INTEGER NOT NULL,
  note TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  FOREIGN KEY (word_id) REFERENCES words(id) ON DELETE CASCADE
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS user_languages ( 
  user_id INTEGER NOT NULL,
  language_id INTEGER NOT NULL,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  word_score INTERGER DEFAULT 0,
  grammar_score INTERGER DEFAULT 0,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (language_id) REFERENCES languages(id) ON DELETE CASCADE,
  PRIMARY KEY (user_id, language_id)
);

CREATE TABLE IF NOT EXISTS user_words (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL, 
  word_id INTEGER NOT NULL,
  progress INTEGER DEFAULT 1,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  next_at TIMESTAMPTZ,
  learned_at TIMESTAMPTZ,
  mastered_at TIMESTAMPTZ,  
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (word_id) REFERENCES words(id) ON DELETE CASCADE,
  CONSTRAINT user_word_unique UNIQUE (user_id, word_id)
);

CREATE INDEX idx_user_words_user ON user_words (user_id);
CREATE INDEX idx_user_words_word ON user_words (word_id);

CREATE TABLE IF NOT EXISTS user_word_history (
  id SERIAL PRIMARY KEY,
  user_word_id INTEGER NOT NULL, 
  progress INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  FOREIGN KEY (user_words_id) REFERENCES user_words(id) ON DELETE CASCADE
);

CREATE INDEX idx_history_user_word ON HISTORY (user_word_id);