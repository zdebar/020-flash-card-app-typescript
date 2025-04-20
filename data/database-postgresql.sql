-- Enable the UUID extension
CREATE EXTENSION IF NOT EXISTS citext;

-- Create tables

CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  uid VARCHAR(255) NOT NULL UNIQUE,
  mode_day VARCHAR(10) DEFAULT 'default' CHECK (mode_day IN ('default', 'day', 'night')),
  font_size VARCHAR(10) DEFAULT 'medium' CHECK (font_size IN ('small', 'medium', 'large')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  plan_type TEXT DEFAULT 'free' CHECK (plan_type IN ('free', 'premium'))
);

CREATE TABLE IF NOT EXISTS words (
  id SERIAL PRIMARY KEY,
  czech TEXT NOT NULL,
  english TEXT NOT NULL, 
  pronunciation TEXT,
  audio TEXT,
  "order" INTEGER, 
  category TEXT CHECK (category IN ('word', 'grammar', 'phrase')),
  block_number INTEGER,
  cefr_level TEXT CHECK (cefr_level IN ('A1', 'A2', 'B1', 'B2', 'C1', 'C2'))
);

CREATE TABLE IF NOT EXISTS word_notes (
  id SERIAL PRIMARY KEY,
  word_id INTEGER NOT NULL, 
  user_id INTEGER NOT NULL,
  user_note TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  FOREIGN KEY (word_id) REFERENCES words(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
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

CREATE TABLE IF NOT EXISTS user_word_history(
  id SERIAL PRIMARY KEY,
  user_word_id INTEGER NOT NULL, 
  progress INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  FOREIGN KEY (user_word_id) REFERENCES user_words(id) ON DELETE CASCADE
);

-- Indexes
CREATE INDEX idx_user_words_user_word ON user_words (user_id, word_id);
CREATE INDEX idx_user_words_next_at ON user_words (next_at);
CREATE INDEX idx_history_user_word ON user_word_history (user_word_id);

-- Trigger to log progress updates
CREATE OR REPLACE FUNCTION log_user_word_history() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO user_word_history (user_word_id, progress, created_at)
  VALUES (NEW.id, NEW.progress, NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER user_word_interaction
AFTER UPDATE OF progress ON user_words
FOR EACH ROW
EXECUTE FUNCTION log_user_word_history();