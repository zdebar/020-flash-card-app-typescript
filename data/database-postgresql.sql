-- Create tables
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,  
  uid VARCHAR(255) UNIQUE, -- firebase uid
  name TEXT, -- user name
  email TEXT, -- user email
  created_at TIMESTAMPTZ DEFAULT NOW()
  daily_goal INTEGER DEFAULT 50, -- daily learning goal in blocks
);

CREATE TABLE IF NOT EXISTS parts_of_speech (
  id SERIAL PRIMARY KEY,
  part_of_speech TEXT NOT NULL UNIQUE -- e.g. noun, verb, adjective, adverb, preposition, conjunction, pronoun
);

CREATE TABLE IF NOT EXISTS languages (
  id SERIAL PRIMARY KEY,
  "name" TEXT NOT NULL UNIQUE -- e.g. English, Spanish, German
);

CREATE TABLE IF NOT EXISTS levels ( -- Common European Framework of Reference for Languages (CEFR) levels -- NEW
  id SERIAL PRIMARY KEY,
  level TEXT NOT NULL UNIQUE, -- e.g. A1, A2, B1, B2, C1, C2
  description TEXT -- description of the level
);

CREATE TABLE IF NOT EXISTS categories (
  id SERIAL PRIMARY KEY,
  category_name TEXT NOT NULL UNIQUE,
  category_explanation TEXT
);

CREATE TABLE IF NOT EXISTS items (
  id SERIAL PRIMARY KEY,
  czech TEXT NOT NULL, 
  translation TEXT NOT NULL, 
  pronunciation TEXT, -- IPA phonetic transcription
  audio TEXT, -- audio file name, without extension
  part_id INTEGER, -- part of speech id
  block_id INTEGER, -- block id for primary grouping items
  sequence INTEGER CHECK (item_order >= 0), -- learning order of words; INTEGER for words, NULL for grammar
  FOREIGN KEY (part_id) REFERENCES parts_of_speech(id) ON DELETE SET NULL,
  FOREIGN KEY (block_id) REFERENCES blocks(id) ON DELETE SET NULL,
);

CREATE TABLE IF NOT EXISTS blocks (
  id INTEGER PRIMARY KEY, -- 10-99 for pronunciation, 100-999 for grammar
  block_name TEXT NOT NULL UNIQUE, 
  block_explanation TEXT, -- html code
  block_order INTEGER CHECK (block_order >= 0), -- after whick item_order will the block be shown
  category_id INTEGER, 
  language_id INTEGER, -- language id
  level_id INTEGER, -- CEFR level id
  FOREIGN KEY (level_id) REFERENCES levels(id) ON DELETE SET NULL,
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL,
  FOREIGN KEY (language_id) REFERENCES languages(id) ON DELETE SET NULL;
);

CREATE TABLE IF NOT EXISTS user_items (
  user_id INTEGER NOT NULL,
  item_id INTEGER NOT NULL,
  progress INTEGER DEFAULT 0 CHECK (progress >= 0), -- learning progress
  started_at TIMESTAMPTZ DEFAULT NOW(), -- datetime when the user started learning the item
  learned_at TIMESTAMPTZ, -- datetime when the user learned the item
  next_at TIMESTAMPTZ, -- datetime when the user should learn the item again
  mastered_at TIMESTAMPTZ, -- datetime when the user mastered the item
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (item_id) REFERENCES items(id) ON DELETE CASCADE,
  PRIMARY KEY (user_id, item_id)
);

CREATE TABLE IF NOT EXISTS user_score (
  user_id INTEGER NOT NULL,
  day DATE DEFAULT CURRENT_DATE,
  count INTEGER DEFAULT 0,
  language_id INTEGER, -- language id
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (language_id) REFERENCES languages(id) ON DELETE SET NULL,
  PRIMARY KEY (user_id, day, language_id)
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
CREATE INDEX idx_blocks_category_id ON blocks(category_id); 
CREATE INDEX idx_user_items_user_id ON user_items(user_id); 
CREATE INDEX idx_items_part_id ON items(part_id);


