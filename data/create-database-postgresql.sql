-- Enable the UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp"; 

-- Create tables

CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  username TEXT NOT NULL UNIQUE,
  email TEXT NOT NULL UNIQUE, -- primary login identification
  password TEXT NOT NULL, -- hashed by bcryp, 10 salt rounds
  created_at TEXT DEFAULT (TO_CHAR(NOW(), 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"')) -- text format data to ensure future synchronization with offline SQLite database
);

CREATE TABLE IF NOT EXISTS user_preferences (
  user_id INTEGER PRIMARY KEY, 
  mode_day INTEGER DEFAULT 1 CHECK (mode_day IN (0, 1)), -- light / mode browser mode; limited integer instead of boolean to ensure future synchronization with offline SQLite database
  font_size INTEGER DEFAULT 2 CHECK (font_size IN (1, 2, 3)),
  notifications INTEGER DEFAULT 1 CHECK (notifications IN (0, 1)), -- enable push notifications
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS languages (
  id SERIAL PRIMARY KEY,
  language TEXT NOT NULL UNIQUE,
  complete INTEGER DEFAULT 0 CHECK (complete IN (0, 1)) -- 0 = incomplete, 1 = complete; only complete languages is possible to learn, complete should incorporate both prn and audio
);

CREATE TABLE IF NOT EXISTS meanings (
  id SERIAL PRIMARY KEY,
  meaning TEXT NOT NULL -- meaning description
);

CREATE TABLE IF NOT EXISTS words (
  id SERIAL PRIMARY KEY,
  language_id INTEGER NOT NULL,
  word TEXT NOT NULL, -- 
  prn TEXT, -- pronunciation
  audio TEXT, -- file name
  seq INTEGER, -- order of learning 
  FOREIGN KEY (language_id) REFERENCES languages(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_words_language ON words(language_id);

CREATE TABLE IF NOT EXISTS user_languages ( -- languages user is learning
  user_id INTEGER NOT NULL,
  language_id INTEGER NOT NULL,
  started_at TEXT DEFAULT (TO_CHAR(NOW(), 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"')),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (language_id) REFERENCES languages(id) ON DELETE CASCADE,
  PRIMARY KEY (user_id, language_id)
);

CREATE TABLE IF NOT EXISTS word_meanings ( -- connection of words of individual languages to meanings
  word_id INTEGER NOT NULL,
  meaning_id INTEGER NOT NULL,
  priority INTEGER DEFAULT 1, -- priority of multiple meanings
  PRIMARY KEY (word_id, meaning_id),
  FOREIGN KEY (word_id) REFERENCES words(id) ON DELETE CASCADE,
  FOREIGN KEY (meaning_id) REFERENCES meanings(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS user_words (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL, 
  word_id INTEGER NOT NULL,
  progress INTEGER DEFAULT 1 CHECK (progress >= 1), -- main learning index
  learned_at TEXT,
  next_at TEXT DEFAULT (TO_CHAR(NOW(), 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"')),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (word_id) REFERENCES words(id) ON DELETE CASCADE,
  CONSTRAINT user_word_unique UNIQUE (user_id, word_id)
);

CREATE INDEX IF NOT EXISTS idx_user_words_user ON user_words(user_id);
CREATE INDEX IF NOT EXISTS idx_user_words_word ON user_words(word_id);

CREATE TABLE IF NOT EXISTS interaction_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),  -- Unique ID for synchronization
  user_word_id INTEGER NOT NULL,  -- Reference to user_words.id
  progress INTEGER,  -- Progress value for interaction
  timestamp TEXT DEFAULT (TO_CHAR(NOW(), 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"')),  -- Timestamp of the interaction
  FOREIGN KEY (user_word_id) REFERENCES user_words(id) ON DELETE CASCADE
);

-- Create the indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_interaction_history_user_word ON interaction_history(user_word_id);
CREATE INDEX IF NOT EXISTS idx_interaction_history_timestamp ON interaction_history(timestamp);


-- Trigger to log progress updates
CREATE OR REPLACE FUNCTION log_user_word_interaction() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO interaction_history (user_word_id, progress, timestamp)
  VALUES (NEW.id, NEW.progress, TO_CHAR(NOW(), 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"'));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER user_word_interaction
AFTER UPDATE OF progress ON user_words
FOR EACH ROW
EXECUTE FUNCTION log_user_word_interaction();
