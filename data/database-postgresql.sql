-- Create tables
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,  
  uid VARCHAR(255) UNIQUE, -- firebase uid
  name TEXT, -- user name
  email TEXT, -- user email
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS items (
  id SERIAL PRIMARY KEY,
  czech TEXT NOT NULL, 
  english TEXT NOT NULL, 
  pronunciation TEXT, -- IPA phonetic transcription
  audio TEXT, -- audio file name, without extension
  item_order INTEGER CHECK (item_order >= 0) -- learning order of words; INTEGER for words, NULL for grammar
);

CREATE TABLE IF NOT EXISTS categories (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL, 
  explanation TEXT
);

CREATE TABLE IF NOT EXISTS blocks (
  id INTEGER PRIMARY KEY, -- 10-99 for pronunciation, 100-999 for grammar
  block_name TEXT NOT NULL, 
  explanation TEXT, -- html code
  block_order INTEGER CHECK (block_order >= 0), -- after whick item_order will the block be shown
  category_id INTEGER, 
  FOREIGN KEY (category_id) REFERENCES category(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS user_items (
  user_id INTEGER NOT NULL,
  item_id INTEGER NOT NULL,
  progress INTEGER DEFAULT 0 CHECK (progress >= 0), -- learning progress
  started_at TIMESTAMPTZ DEFAULT NOW(), -- datetime when the user started learning the item
  next_at TIMESTAMPTZ, -- datetime when the user should learn the item again
  mastered_at TIMESTAMPTZ, -- datetime when the user mastered the item
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (item_id) REFERENCES items(id) ON DELETE CASCADE,
  PRIMARY KEY (user_id, item_id)
);

CREATE TABLE IF NOT EXISTS user_score (
  user_id INTEGER NOT NULL,
  day DATE DEFAULT CURRENT_DATE,
  blocks_finished INTEGER DEFAULT 0 CHECK (blocks_finished >= 0),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  PRIMARY KEY (user_id, day)
);

CREATE TABLE IF NOT EXISTS block_items (
  block_id INTEGER NOT NULL,
  item_id INTEGER NOT NULL,
  FOREIGN KEY (block_id) REFERENCES blocks(id) ON DELETE CASCADE,
  FOREIGN KEY (item_id) REFERENCES items(id) ON DELETE CASCADE,
  PRIMARY KEY (block_id, item_id)
);

-- Create indexes
CREATE UNIQUE INDEX user_items_user_id_item_id_idx ON user_items(user_id, item_id);
CREATE INDEX idx_user_items_user_id_item_id ON user_items(user_id, item_id);
CREATE INDEX idx_blocks_category ON blocks(category);

