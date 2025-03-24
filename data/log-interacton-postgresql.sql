CREATE TABLE IF NOT EXISTS interaction_history (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL,
  word_id INTEGER,
  progress INTEGER,
  timestamp TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP, 
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (word_id) REFERENCES words(id) ON DELETE CASCADE
);

CREATE OR REPLACE FUNCTION log_user_word_interaction() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO interaction_history (user_id, word_id, progress, timestamp)
  VALUES (NEW.user_id, NEW.word_id, NEW.progress, CURRENT_TIMESTAMP);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER user_word_interaction
AFTER UPDATE OF progress ON user_words
FOR EACH ROW
EXECUTE FUNCTION log_user_word_interaction();
