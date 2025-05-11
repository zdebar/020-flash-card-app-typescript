import { PostgresClient } from "../types/dataTypes";
import { withDbClient } from "../utils/database.utils";
import { Item, Block } from "../../../shared/types/dataTypes";

/**
 * Return unlocked grammar lectures with total count for pagination.
 */
export async function getGrammarsRepository(
  db: PostgresClient,
  uid: string,
  limit: number,
  offset: number
): Promise<{ rows: Block[]; totalCount: number }> {
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
      b.category_id as block_category_id,
      COUNT(*) OVER() AS total_count
    FROM blocks b
    WHERE b.block_order <= (SELECT count FROM started_items_count) 
    LIMIT $2 OFFSET $3;
  `;

  return await withDbClient(db, async (client) => {
    const res = await client.query(query, [uid, limit, offset]);
    const rows = res.rows.map(({ total_count, ...rest }) => rest);
    const totalCount =
      res.rows.length > 0 ? parseInt(res.rows[0].total_count, 10) : 0;
    return { rows, totalCount };
  });
}

/**
 * Return started sentences with total count for pagination.
 */
export async function getGrammarPhrasesRepository(
  db: PostgresClient,
  uid: string,
  grammarID: number,
  limit: number,
  offset: number
): Promise<{ rows: Item[]; totalCount: number }> {
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
      false as has_info,
      COUNT(*) OVER() AS total_count
    FROM items i
    INNER JOIN user_items ui ON i.id = ui.item_id AND ui.user_id = (SELECT user_id FROM user_cte)
    INNER JOIN block_items bi ON i.id = bi.item_id
    INNER JOIN blocks b ON bi.block_id = b.id AND b.id = $2
    WHERE b.category_id = 1
    ORDER BY i.id ASC
    LIMIT $3 OFFSET $4;
  `;

  return await withDbClient(db, async (client) => {
    const res = await client.query(query, [uid, grammarID, limit, offset]);
    const rows = res.rows.map(({ total_count, ...rest }) => rest); // Remove total_count from each row
    const totalCount =
      res.rows.length > 0 ? parseInt(res.rows[0].total_count, 10) : 0; // Extract total_count from the first row
    return { rows, totalCount };
  });
}
