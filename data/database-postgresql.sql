-- Create tables
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  uid VARCHAR(255) UNIQUE, -- index
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS items (
  id SERIAL PRIMARY KEY,
  czech TEXT NOT NULL, 
  english TEXT NOT NULL, 
  pronunciation TEXT,
  audio TEXT
);

CREATE TABLE IF NOT EXISTS user_items (
  user_id INTEGER NOT NULL,
  item_id INTEGER NOT NULL,
  progress INTEGER DEFAULT 0 CHECK (progress >= 0),
  started_at TIMESTAMPTZ DEFAULT NOW(),
  next_at TIMESTAMPTZ,
  mastered_at TIMESTAMPTZ,  
  skipped BOOLEAN DEFAULT FALSE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (item_id) REFERENCES items(id) ON DELETE CASCADE,
  PRIMARY KEY (user_id, item_id)
);

CREATE TABLE IF NOT EXISTS blocks (
  id SERIAL PRIMARY KEY,
  block_name TEXT NOT NULL,
  explanation TEXT,
  unlock_at INTEGER CHECK (unlock_at >= 0),
  block_order INTEGER DEFAULT 0 CHECK (block_order >= 0),
  category TEXT CHECK (category IN ('grammar', 'pronunciation', 'vocabulary'))
);

CREATE TABLE IF NOT EXISTS block_items (
  block_id INTEGER NOT NULL,
  item_id INTEGER NOT NULL,
  item_order INTEGER DEFAULT 0 CHECK (item_order >= 0),
  group INTEGER DEFAULT 0 CHECK (group >= 0),
  FOREIGN KEY (block_id) REFERENCES blocks(id) ON DELETE CASCADE,
  FOREIGN KEY (item_id) REFERENCES items(id) ON DELETE CASCADE,
  PRIMARY KEY (block_id, item_id)
);

CREATE TABLE IF NOT EXISTS user_blocks (
  user_id INTEGER NOT NULL,
  block_id INTEGER NOT NULL,
  progress INTEGER DEFAULT 0 CHECK (progress >= 0),
  started_at TIMESTAMPTZ DEFAULT NOW(),
  next_at TIMESTAMPTZ,
  mastered_at TIMESTAMPTZ,  
  skipped BOOLEAN DEFAULT FALSE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (block_id) REFERENCES blocks(id) ON DELETE CASCADE,
  PRIMARY KEY (user_id, block_id)
);

-- Create indexes
CREATE UNIQUE INDEX user_items_user_id_item_id_idx ON user_items(user_id, item_id);
CREATE INDEX idx_user_items_user_id_item_id ON user_items(user_id, item_id);
CREATE INDEX idx_block_items_block_id_item_id ON block_items(block_id, item_id); -- maybe only block_id is needed
CREATE INDEX idx_blocks_category ON blocks(category);
CREATE INDEX idx_user_blocks_next_at ON user_blocks(next_at);
