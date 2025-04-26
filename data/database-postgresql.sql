-- Create tables

CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  uid VARCHAR(255) UNIQUE,
  mode_day TEXT DEFAULT 'default' CHECK (mode_day IN ('default', 'day', 'night')),
  font_size TEXT DEFAULT 'medium' CHECK (font_size IN ('small', 'medium', 'large')),
  plan_type TEXT DEFAULT 'free' CHECK (plan_type IN ('free', 'premium')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS daily_progress (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL,
  progress_sum INTEGER DEFAULT 0,
  progress_date DATE DEFAULT NOW()::DATE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE (user_id, progress_date)
);

CREATE TABLE IF NOT EXISTS words (
  id SERIAL PRIMARY KEY,
  czech TEXT NOT NULL,
  english TEXT NOT NULL, 
  pronunciation TEXT,
  audio TEXT,
  item_order INTEGER DEFAULT 0 CHECK (item_order >= 0), 
  category TEXT DEFAULT 'word' NOT NULL CHECK (category IN ('word', 'grammar', 'phrase')),
  block_number INTEGER, -- Groups items into blocks / for example for grammar lessons
  cefr_level TEXT NOT NULL CHECK (cefr_level IN ('A1', 'A2', 'B1', 'B2', 'C1', 'C2'))
);

CREATE TABLE IF NOT EXISTS word_notes (
  id SERIAL PRIMARY KEY,
  word_id INTEGER, 
  user_id INTEGER,
  user_note TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  FOREIGN KEY (word_id) REFERENCES words(id) ON DELETE SET NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS user_words (
  user_id INTEGER NOT NULL, 
  word_id INTEGER NOT NULL,
  progress INTEGER DEFAULT 0 CHECK (progress >= 0),
  started_at TIMESTAMPTZ DEFAULT NOW(),
  next_at TIMESTAMPTZ,
  mastered_at TIMESTAMPTZ,  
  skipped BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (word_id) REFERENCES words(id) ON DELETE CASCADE,
  PRIMARY KEY (user_id, word_id)
);

CREATE TABLE IF NOT EXISTS user_word_history(
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL,
  word_id INTEGER NOT NULL,
  progress INTEGER CHECK (progress >= 0),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  FOREIGN KEY (user_id, word_id) REFERENCES user_words(user_id, word_id) ON DELETE CASCADE
);

-- Indexes
CREATE INDEX idx_users_uid ON users (uid);
CREATE INDEX idx_words_category_cefr_level ON words (category, cefr_level);
CREATE INDEX idx_user_words_user_id_word_id ON user_words (user_id, word_id);
CREATE INDEX idx_user_words_next_at ON user_words (next_at);
CREATE INDEX idx_user_words_progress ON user_words (progress);
CREATE INDEX idx_history_user_word_id ON user_word_history (user_id, word_id);
CREATE INDEX idx_daily_progress_user_date ON daily_progress (user_id, progress_date);

-- Trigger to log progress updates
CREATE OR REPLACE FUNCTION log_user_word_history() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO user_word_history (user_id, word_id, progress, created_at)
  VALUES (NEW.user_id, NEW.word_id, NEW.progress, NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER user_word_interaction
AFTER UPDATE OF progress ON user_words
FOR EACH ROW
EXECUTE FUNCTION log_user_word_history();

-- Function to update daily_progress when progress changes in user_words
CREATE OR REPLACE FUNCTION update_daily_progress()
RETURNS TRIGGER AS $$
BEGIN
  BEGIN
    -- Update the progress_sum in daily_progress
    UPDATE daily_progress
    SET progress_sum = progress_sum + (NEW.progress - OLD.progress)
    WHERE user_id = NEW.user_id AND progress_date = NOW()::DATE;

    -- If no record exists for today, insert a new one
    IF NOT FOUND THEN
      INSERT INTO daily_progress (user_id, progress_sum, progress_date)
      VALUES (NEW.user_id, NEW.progress - OLD.progress, NOW()::DATE);
    END IF;
  EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'Error updating daily progress: %', SQLERRM;
    RAISE;
  END;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to call the function after progress update
CREATE TRIGGER update_progress_sum
AFTER UPDATE OF progress ON user_words
FOR EACH ROW
EXECUTE FUNCTION update_daily_progress();