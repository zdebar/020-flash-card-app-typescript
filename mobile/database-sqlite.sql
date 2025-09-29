CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY,  
  uid TEXT UNIQUE,
  username TEXT UNIQUE,
  password TEXT NOT NULL, -- hashed password
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS levels ( -- linked to 10 blocks (100 items)
  id INTEGER PRIMARY KEY,
  "name" TEXT NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS grammar ( -- linked to multiple blocks
  id INTEGER PRIMARY KEY,
  "name" TEXT NOT NULL UNIQUE, 
  note TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS blocks ( -- linked to 10 items (vocabulary or grammar)
  id INTEGER PRIMARY KEY, 
  "name" TEXT NOT NULL UNIQUE, 
  "sequence" INTEGER CHECK ("sequence" >= 0), 
  category TEXT NOT NULL CHECK (category IN ('grammar explanation', 'grammar practice', 'vocabulary')),
  level_id INTEGER,
  grammar_id INTEGER, -- null is for vocabulary blocks
  FOREIGN KEY (level_id) REFERENCES levels(id) ON DELETE SET NULL,
  FOREIGN KEY (grammar_id) REFERENCES grammar(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS items (
  id INTEGER PRIMARY KEY,
  czech TEXT NOT NULL, 
  translation TEXT NOT NULL, 
  pronunciation TEXT, -- IPA phonetic transcription
  audio TEXT, -- audio file name, without extension
  block_id INTEGER, 
  "sequence" INTEGER CHECK ("sequence" >= 0), 
  FOREIGN KEY (block_id) REFERENCES blocks(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS user_items (
  user_id INTEGER NOT NULL,
  item_id INTEGER NOT NULL,
  progress INTEGER DEFAULT 0 CHECK (progress >= 0),
  started_at TEXT DEFAULT CURRENT_TIMESTAMP, 
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
  next_at TEXT, 
  learned_at TEXT, 
  mastered_at TEXT,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (item_id) REFERENCES items(id) ON DELETE CASCADE,
  PRIMARY KEY (user_id, item_id)
);

CREATE TABLE IF NOT EXISTS user_score (
  user_id INTEGER NOT NULL,
  "date" TEXT DEFAULT CURRENT_DATE,
  item_count INTEGER DEFAULT 0,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  PRIMARY KEY (user_id, "date")
);

-- Trigger to update updated_at on user_items when progress is updated
CREATE TRIGGER update_user_items_updated_at
AFTER UPDATE ON user_items
BEGIN
  UPDATE user_items
  SET updated_at = CURRENT_TIMESTAMP
  WHERE user_id = NEW.user_id AND item_id = NEW.item_id;
END;


