import { PostgresClient } from "../types/dataTypes";
import { withDbClient } from "../utils/database.utils";
import { Item, Block } from "../../../shared/types/dataTypes";

/**
 * Return started words for the user from PostgreSQL database.
 */
export async function getOverviewWordsRepository(
  db: PostgresClient,
  uid: string,
  limit: number,
  offset: number
): Promise<Item[]> {
  let query = `
  WITH user_cte AS (
    SELECT id AS user_id FROM users WHERE uid = $1
  )
  SELECT
    i.id,
    i.czech,
    i.english,
    i.pronunciation,
    i.audio,
    i.item_order,    
    ui.progress,
    ui.started_at,
    ui.next_at,
    ui.mastered_at,
    ui.skipped
  FROM items i
  JOIN user_items ui ON i.id = ui.item_id AND ui.user_id = (SELECT user_id FROM user_cte)
  LEFT JOIN block_items bi ON i.id = bi.item_id
  LEFT JOIN blocks b ON bi.block_id = b.id
  LEFT JOIN categories c ON b.category_id = c.id 
  WHERE i.item_order IS NOT NULL
  GROUP BY 
    i.id, i.czech, i.english, i.pronunciation, i.audio, ui.progress, ui.started_at, ui.skipped, ui.next_at, b.block_order, ui.mastered_at
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
 * TODO: redo as grammar lectures overview
 */
export async function getOverviewSentencesRepository(
  db: PostgresClient,
  uid: string,
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
 * Return unlocked grammar lectures for the user from PostgreSQL database.
 */
export async function getOverviewGrammarRepository(
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
        AND started_at IS NOT NULL
      GROUP BY user_id  
    )
    SELECT 
      b.id AS block_id,
      b.block_order,
      b.block_name,
      b.explanation AS block_explanation
    FROM blocks b
    WHERE b.block_order <= (SELECT count FROM started_items_count) 
    LIMIT $2 OFFSET $3; 
  `;

  return await withDbClient(db, async (client) => {
    const res = await client.query(query, [uid, limit, offset]);
    return res.rows;
  });
}
