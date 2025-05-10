import { PostgresClient } from "../types/dataTypes";
import { getNextAt, getMasteredAt } from "../utils/update.utils";
import { withDbClient } from "../utils/database.utils";
import config from "../config/config";
import {
  UserScore,
  Item,
  ItemProgress,
  ItemInfo,
} from "../../../shared/types/dataTypes";

/**
 * Return required items for the user from PostgreSQL database.
 */
export async function getItemsRepository(
  db: PostgresClient,
  uid: string
): Promise<Item[]> {
  const numWords: number = config.block;

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
    COALESCE(ui.progress, 0) AS progress,
    ui.started_at,
    ui.next_at,
    ui.mastered_at,
    coalesce(ui.skipped, false) as skipped,
    COUNT(b.id) > 0 as has_info 
  FROM items i
  LEFT JOIN user_items ui ON i.id = ui.item_id AND ui.user_id = (SELECT user_id FROM user_cte)
  LEFT JOIN block_items bi ON i.id = bi.item_id
  LEFT JOIN blocks b ON bi.block_id = b.id
  WHERE ui.mastered_at IS NULL
    AND COALESCE(ui.skipped, false) = false
    AND (ui.next_at IS NULL OR ui.next_at < NOW())
  GROUP BY 
    i.id, i.czech, i.english, i.pronunciation, i.audio, ui.progress, ui.started_at, ui.skipped, ui.next_at, b.block_order, ui.mastered_at
  ORDER BY 
    ui.next_at ASC NULLS LAST,
    COALESCE(i.item_order, b.block_order, 0),
    i.id ASC
  LIMIT $2;
`;

  return await withDbClient(db, async (client) => {
    const res = await client.query(query, [uid, numWords]);
    return res.rows;
  });
}

/**
 * Updates the user's word progress in a PostgreSQL database. --- learned_at a mastered_at se mění pouze při hraničním času
 */
export async function patchItemsRepository(
  db: PostgresClient,
  uid: string,
  items: ItemProgress[]
): Promise<void> {
  if (items.length === 0) {
    return; // No items to update
  }

  // Prepare data for unnest
  const itemIds = items.map((item) => item.id);
  const progresses = items.map((item) => item.progress);
  const nextAts = items.map((item) => getNextAt(item.progress) || null);
  const masteredAts = items.map((item) => getMasteredAt(item.progress) || null);
  const skippedFlags = items.map((item) => item.skipped);

  const query = `
    WITH user_id_cte AS (
      SELECT id AS user_id FROM users WHERE uid = $1
    ),
    item_data AS (
      SELECT 
        unnest($2::int[]) AS item_id,
        unnest($3::int[]) AS progress,
        unnest($4::timestamptz[]) AS next_at,
        unnest($5::timestamptz[]) AS mastered_at,
        unnest($6::boolean[]) AS skipped
    )
    INSERT INTO user_items (user_id, item_id, progress, next_at, mastered_at, skipped)
    SELECT 
      user_id,
      wd.item_id,
      wd.progress,
      wd.next_at,
      wd.mastered_at,
      wd.skipped
    FROM user_id_cte, item_data wd
    ON CONFLICT(user_id, item_id) 
    DO UPDATE SET 
      progress = EXCLUDED.progress, 
      next_at = EXCLUDED.next_at, 
      mastered_at = CASE 
        WHEN user_items.mastered_at IS NULL AND EXCLUDED.mastered_at IS NOT NULL 
        THEN EXCLUDED.mastered_at 
        ELSE user_items.mastered_at 
      END,
      skipped = EXCLUDED.skipped;
  `;

  const values = [uid, itemIds, progresses, nextAts, masteredAts, skippedFlags];

  await withDbClient(db, async (client) => {
    await client.query(query, values);
  });
}

/**
 * Gets count of learned words, and next grammar practice date from PostgreSQL database.
 */
export async function getScoreRepository(
  db: PostgresClient,
  uid: string
): Promise<UserScore> {
  const query = `
    WITH user_cte AS (
      SELECT id AS user_id FROM users WHERE uid = $1
    )
    SELECT 
      COUNT(CASE WHEN DATE(ui.started_at AT TIME ZONE 'UTC') = CURRENT_DATE THEN 1 END) AS "startedCountToday",
      COUNT(*) AS "startedCount"
    FROM user_items ui
    JOIN user_cte u ON ui.user_id = u.user_id;
  `;

  return await withDbClient(db, async (client) => {
    const result = await client.query(query, [uid]);
    const row = result.rows[0];

    return {
      startedCountToday: parseInt(row.startedCountToday, 10),
      startedCount: parseInt(row.startedCount, 10),
    };
  });
}

/**
 * Gets info relevant to the given items from PostgreSQL database.
 * TODO: optimize this query
 */
export async function getItemInfoRepository(
  db: PostgresClient,
  item_id: number
): Promise<ItemInfo[]> {
  const query = `
    SELECT 
      b.id,
      b.block_order,
      b.block_name,
      b.explanation AS block_explanation,
      b.category_id as block_category_id,
      CASE 
        WHEN b.category_id IN (3, 4) THEN (
          SELECT json_agg(
            json_build_object(
              'id', i_sub.id,
              'czech', i_sub.czech,
              'english', i_sub.english,
              'pronunciation', i_sub.pronunciation,
              'audio', i_sub.audio
            )
          )
          FROM items i_sub
          JOIN block_items bi_sub ON i_sub.id = bi_sub.item_id
          WHERE bi_sub.block_id = b.id
        )
        ELSE NULL
      END AS items
    FROM blocks b
    JOIN block_items bi ON b.id = bi.block_id
    JOIN items i ON i.id = bi.item_id
    WHERE i.id = $1;
  `;

  return await withDbClient(db, async (client) => {
    const result = await client.query(query, [item_id]);
    return result.rows;
  });
}

/**
 * Return started words for the user from PostgreSQL database.
 */
export async function getWordsRepository(
  db: PostgresClient,
  uid: string,
  limit: number,
  offset: number
): Promise<{ rows: Item[]; totalCount: number }> {
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
      ui.skipped,
      false as has_info,
      COUNT(*) OVER() AS total_count
    FROM items i
    INNER JOIN user_items ui ON i.id = ui.item_id AND ui.user_id = (SELECT user_id FROM user_cte)
    WHERE i.item_order IS NOT NULL
    ORDER BY 
      i.item_order ASC
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
