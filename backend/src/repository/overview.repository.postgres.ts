import { PostgresClient } from "../types/dataTypes";
import { withDbClient } from "../utils/database.utils";
import { OverviewItem, Item, ItemInfo } from "../../../shared/types/dataTypes";

/**
 * Return started words for the user from PostgreSQL database.
 */
export async function getOverviewWordsRepository(
  db: PostgresClient,
  uid: string,
  limit: number,
  offset: number
): Promise<OverviewItem[]> {
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
    ui.skipped
  FROM items i
  JOIN user_items ui ON i.id = ui.item_id AND ui.user_id = (SELECT user_id FROM user_cte)
  WHERE ui.started_at IS NOT NULL
    AND i.item_order IS NOT NULL
  ORDER BY 
i.item_order ASC NULLS FIRST
  LIMIT $2 OFFSET $3;
`;

  return await withDbClient(db, async (client) => {
    const res = await client.query(query, [uid, limit, offset]);
    return res.rows;
  });
}

/**
 * Return started sentences for the user from PostgreSQL database.
 */
export async function getOverviewSentencesRepository(
  db: PostgresClient,
  uid: string,
  limit: number,
  offset: number
): Promise<OverviewItem[]> {
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
      ui.skipped
    FROM items i
    JOIN user_items ui ON i.id = ui.item_id AND ui.user_id = (SELECT user_id FROM user_cte)
    LEFT JOIN block_items bi ON i.id = bi.item_id
    JOIN blocks b ON bi.block_id = b.id
    WHERE ui.started_at IS NOT NULL
      AND b.category_id = 1
    GROUP BY i.id, ui.progress, ui.started_at, ui.next_at, ui.mastered_at, ui.skipped
    ORDER BY i.id ASC NULLS FIRST
    LIMIT $2 OFFSET $3;
`;

  return await withDbClient(db, async (client) => {
    const res = await client.query(query, [uid, limit, offset]);
    return res.rows;
  });
}

/**
 * Return started sentences for the user from PostgreSQL database.
 */
export async function getOverviewGrammarRepository(
  db: PostgresClient,
  uid: string,
  limit: number,
  offset: number
): Promise<ItemInfo[]> {
  let query = `
    SELECT 
      b.id,
      b.block_name,
      b.explanation AS block_explanation,
      c.name AS block_category,
      COALESCE({}) AS items -- Use an empty array as items
    FROM blocks b
    JOIN categories c ON c.id = b.category_id
    JOIN block_items bi ON b.id = bi.block_id
    LEFT JOIN items i ON i.id = bi.item_id
    WHERE i.id = $1; 
`;

  return await withDbClient(db, async (client) => {
    const res = await client.query(query, [uid, limit, offset]);
    return res.rows;
  });
}
