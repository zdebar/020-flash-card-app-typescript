import { PostgresClient } from "../types/dataTypes";
import { withDbClient } from "../utils/database.utils";
import { Item, Block } from "../../../shared/types/dataTypes";

/**
 * Return unlocked grammar lectures for the user from PostgreSQL database.
 */
export async function getGrammarsRepository(
  db: PostgresClient,
  uid: string,
  limit: number,
  offset: number
): Promise<Block[]> {
  let query = `
    WITH user_cte AS (
      SELECT id AS user_id FROM users WHERE uid = $1
    ),
    started_items_count AS (
      SELECT COUNT(*) AS count 
      FROM user_items 
      WHERE user_id = (SELECT user_id FROM user_cte) 
      GROUP BY user_id  
    )
    SELECT 
      b.id AS block_id,
      b.block_order,
      b.block_name,
      b.explanation AS block_explanation,
      b.category_id as block_category_id
    FROM blocks b
    WHERE b.block_order <= (SELECT count FROM started_items_count) 
    LIMIT $2 OFFSET $3;
  `;

  return await withDbClient(db, async (client) => {
    const res = await client.query(query, [uid, limit, offset]);
    return res.rows;
  });
}

/**
 * Return started sentences for the user from PostgreSQL database.
 * TODO: redo as grammar lectures overview
 */
export async function getGrammarPhrasesRepository(
  db: PostgresClient,
  uid: string,
  grammarID: number,
  limit: number,
  offset: number
): Promise<Item[]> {
  let query = `
    WITH user_cte AS (
      SELECT id AS user_id FROM users WHERE uid = $1
    )
    SELECT
      i.item_order,
      i.id,
      i.czech,
      i.english,
      i.pronunciation,
      i.audio,    
      ui.progress,
      ui.started_at,
      ui.next_at,
      ui.mastered_at,
      ui.skipped,
      false as has_info
    FROM items i
    inner JOIN user_items ui ON i.id = ui.item_id AND ui.user_id = (SELECT user_id FROM user_cte)
    inner JOIN block_items bi ON i.id = bi.item_id 
    inner JOIN blocks b ON bi.block_id = b.id and b.id = $2
    WHERE b.category_id = 1
    ORDER BY i.id ASC
    LIMIT $3 OFFSET $4;
`;

  return await withDbClient(db, async (client) => {
    const res = await client.query(query, [uid, grammarID, limit, offset]);
    return res.rows;
  });
}
