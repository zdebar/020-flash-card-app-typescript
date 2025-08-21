-- Create the `cefr_levels` table
CREATE TABLE IF NOT EXISTS cefr_levels (
  id SERIAL PRIMARY KEY,
  level TEXT NOT NULL UNIQUE, -- e.g. A1, A2, B1, B2, C1, C2
  description TEXT -- description of the level
);

ALTER TABLE items
ADD COLUMN level_id INTEGER; -- CEFR level (A1, A2, B1, B2, C1, C2)

ALTER TABLE blocks
RENAME COLUMN block_name TO name;

ALTER TABLE blocks
RENAME COLUMN block_explanation TO explanation;

ALTER TABLE blocks
RENAME COLUMN block_order TO sequence;

ALTER TABLE categories
RENAME COLUMN category_name TO name;

ALTER TABLE categories
RENAME COLUMN category_explanation TO explanation;

ALTER TABLE items
RENAME COLUMN item_order TO sequence;

ALTER TABLE user_score
RENAME COLUMN blockcount TO count;


-- Add foreign key constraints separately
ALTER TABLE items
ADD CONSTRAINT fk_items_level FOREIGN KEY (level_id) REFERENCES cefr_levels(id) ON DELETE SET NULL;

