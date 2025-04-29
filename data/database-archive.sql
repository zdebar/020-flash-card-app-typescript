CREATE TABLE IF NOT EXISTS user_word_history(
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL,
  word_id INTEGER NOT NULL,
  progress INTEGER CHECK (progress >= 0),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  FOREIGN KEY (user_id, word_id) REFERENCES user_words(user_id, word_id) ON DELETE CASCADE
);