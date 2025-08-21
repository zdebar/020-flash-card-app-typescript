CREATE TABLE IF NOT EXISTS notes (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    note TEXT NOT NULL    
);

CREATE TABLE IF NOT EXISTS user_blocks (
    user_id INTEGER NOT NULL,
    block_id INTEGER NOT NULL,
    progress INTEGER DEFAULT 0 CHECK (progress >= 0), -- learning progress
    started_at TIMESTAMPTZ DEFAULT NOW(), -- datetime when the user started learning the block
    next_at TIMESTAMPTZ, -- datetime when the user should learn the block again
    finished_at TIMESTAMPTZ, -- datetime when the user mastered the block
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (block_id) REFERENCES blocks(id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, block_id)
);

ALTER TABLE blocks
ADD COLUMN note_id INTEGER DEFAULT NULL;

ALTER TABLE blocks
ADD FOREIGN KEY (note_id) REFERENCES notes(id) ON DELETE SET NULL;

ALTER TABLE blocks
DROP COLUMN IF EXISTS explanation;

ALTER TABLE items
ADD COLUMN block_id INTEGER DEFAULT NULL;

ALTER TABLE items
ADD FOREIGN KEY (block_id) REFERENCES blocks(id) ON DELETE SET NULL;

