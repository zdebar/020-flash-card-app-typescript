CREATE TABLE IF NOT EXISTS parts_of_speech (
  id SERIAL PRIMARY KEY,
  part_of_speech TEXT NOT NULL UNIQUE -- e.g. noun, verb, adjective, adverb, preposition, conjunction, pronoun
);

ALTER TABLE items
ADD COLUMN part_id INTEGER, -- part of speech id
ADD FOREIGN KEY (part_id) REFERENCES parts_of_speech(id) ON DELETE SET NULL;

CREATE INDEX idx_items_part_id ON items(part_id);