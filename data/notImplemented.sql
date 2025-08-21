-- Triggers
CREATE OR REPLACE FUNCTION check_block_category()
RETURNS TRIGGER AS $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM blocks WHERE id = NEW.block_id AND category_id BETWEEN 1 AND 9
  ) THEN
    RAISE EXCEPTION 'Block % does not have category 1-9', NEW.block_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_check_block_category
BEFORE INSERT OR UPDATE ON items
FOR EACH ROW EXECUTE FUNCTION check_block_category();

CREATE OR REPLACE FUNCTION check_single_category4_block()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.category_id = 4 THEN
    IF EXISTS (
      SELECT 1 FROM blocks
      WHERE category_id = 4 AND language_id = NEW.language_id AND id <> NEW.id
    ) THEN
      RAISE EXCEPTION 'Only one block with category_id = 4 is allowed per language (language_id=%).', NEW.language_id;
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_check_single_category4_block
BEFORE INSERT OR UPDATE ON blocks
FOR EACH ROW EXECUTE FUNCTION check_single_category4_block();