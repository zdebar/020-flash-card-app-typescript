CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY,  
  uid TEXT UNIQUE,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS levels ( 
  id INTEGER PRIMARY KEY,
  "name" TEXT
);

CREATE TABLE IF NOT EXISTS notes (
  id INTEGER PRIMARY KEY,
  "name" TEXT NOT NULL UNIQUE, 
  note TEXT NOT NULL
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

CREATE TABLE IF NOT EXISTS blocks (
  id INTEGER PRIMARY KEY, 
  "name" TEXT NOT NULL UNIQUE, 
  "sequence" INTEGER CHECK ("sequence" >= 0),
  category TEXT NOT NULL CHECK (category IN ('grammar explanation', 'grammar practice', 'vocabulary')),
  level_id INTEGER,
  note_id INTEGER,
  FOREIGN KEY (level_id) REFERENCES levels(id) ON DELETE SET NULL,
  FOREIGN KEY (note_id) REFERENCES notes(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS user_items (
  user_id INTEGER NOT NULL,
  item_id INTEGER NOT NULL,
  progress INTEGER DEFAULT 0 CHECK (progress >= 0),
  started_at TEXT DEFAULT CURRENT_TIMESTAMP, 
  learned_at TEXT, 
  next_at TEXT, 
  mastered_at TEXT,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (item_id) REFERENCES items(id) ON DELETE CASCADE,
  PRIMARY KEY (user_id, item_id)
);

CREATE TABLE IF NOT EXISTS user_blocks (
  user_id INTEGER NOT NULL,
  block_id INTEGER NOT NULL,
  progress INTEGER DEFAULT 0 CHECK (progress >= 0),
  started_at TEXT DEFAULT CURRENT_TIMESTAMP, 
  finished_at TEXT,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (block_id) REFERENCES blocks(id) ON DELETE CASCADE,
  PRIMARY KEY (user_id, block_id)
);

CREATE TABLE IF NOT EXISTS user_score (
  user_id INTEGER NOT NULL,
  "date" TEXT DEFAULT CURRENT_DATE,
  block_count INTEGER DEFAULT 0,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  PRIMARY KEY (user_id, "date")
);


