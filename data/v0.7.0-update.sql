-- Items
ALTER TABLE items
DROP CONSTRAINT IF EXISTS items_level_id_fkey;

ALTER TABLE items
DROP COLUMN level_id;

ALTER TABLE items
ADD COLUMN block_id INTEGER DEFAULT NULL;

ALTER TABLE items
ADD FOREIGN KEY (block_id) REFERENCES blocks(id) ON DELETE SET NULL;

ALTER TABLE items
DROP CONSTRAINT IF EXISTS items_language_id_fkey;

ALTER TABLE items
DROP COLUMN language_id;

-- Notes
CREATE TABLE IF NOT EXISTS notes (
  id SERIAL PRIMARY KEY,
  "name" TEXT NOT NULL UNIQUE,
  note TEXT NOT NULL
);

-- Blocks
ALTER TABLE blocks
ADD COLUMN level_id INTEGER DEFAULT NULL;

ALTER TABLE blocks
ADD FOREIGN KEY (level_id) REFERENCES levels(id) ON DELETE SET NULL;

ALTER TABLE blocks
DROP COLUMN IF EXISTS explanation;

ALTER TABLE blocks
ADD COLUMN note_id INTEGER DEFAULT NULL;

ALTER TABLE blocks
ADD FOREIGN KEY (note_id) REFERENCES notes(id) ON DELETE SET NULL;

-- User Blocks
CREATE TABLE IF NOT EXISTS user_blocks (
    user_id INTEGER NOT NULL,
    block_id INTEGER NOT NULL,
    progress INTEGER DEFAULT 0 CHECK (progress >= 0),
    started_at TIMESTAMPTZ DEFAULT NOW(), 
    next_at TIMESTAMPTZ,
    finished_at TIMESTAMPTZ,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (block_id) REFERENCES blocks(id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, block_id)
);







