import { PostgresClient } from "../types/dataTypes";
import { getNextAt, getMasteredAt } from "../utils/update.utils";
import { withDbClient } from "../utils/database.utils";
import config from "../config/config";
import { UserScore, Item, ItemProgress } from "../../../shared/types/dataTypes";

/**
 * Return required words for the user from PostgreSQL database.
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
    COALESCE(ui.progress, 0) AS progress,
    ui.started_at IS NOT NULL AS started,
    ui.skipped 
  FROM items i
  LEFT JOIN user_items ui ON i.id = ui.item_id AND ui.user_id = (SELECT user_id FROM user_cte)
  LEFT JOIN block_items bi ON i.id = bi.item_id
  LEFT JOIN blocks b ON bi.block_id = b.id	
  WHERE ui.mastered_at IS NULL
    AND COALESCE(ui.skipped, false) = false
    AND (ui.next_at IS NULL OR ui.next_at < NOW())
  ORDER BY 
    ui.next_at ASC NULLS LAST,
    COALESCE(i.item_order, b.block_order, 0)
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
export async function updateItemsRepository(
  db: PostgresClient,
  uid: string,
  items: ItemProgress[]
): Promise<void> {
  if (items.length === 0) {
    return; // No words to update
  }

  // Prepare data for unnest
  const wordIds = items.map((word) => word.id);
  const progresses = items.map((word) => word.progress);
  const nextAts = items.map((word) => getNextAt(word.progress) || null);
  const masteredAts = items.map((word) => getMasteredAt(word.progress) || null);
  const skippedFlags = items.map((word) => word.skipped);

  const query = `
    WITH user_id_cte AS (
      SELECT id AS user_id FROM users WHERE uid = $1
    ),
    word_data AS (
      SELECT 
        unnest($2::int[]) AS word_id,
        unnest($3::int[]) AS progress,
        unnest($4::timestamptz[]) AS next_at,
        unnest($5::timestamptz[]) AS mastered_at,
        unnest($6::boolean[]) AS skipped
    )
    INSERT INTO user_items (user_id, item_id, progress, next_at, mastered_at, skipped)
    SELECT 
      user_id,
      wd.word_id,
      wd.progress,
      wd.next_at,
      wd.mastered_at,
      wd.skipped
    FROM user_id_cte, word_data wd
    ON CONFLICT(user_id, word_id) 
    DO UPDATE SET 
      progress = EXCLUDED.progress, 
      next_at = EXCLUDED.next_at, 
      mastered_at = CASE 
        WHEN user_words.mastered_at IS NULL AND EXCLUDED.mastered_at IS NOT NULL 
        THEN EXCLUDED.mastered_at 
        ELSE user_words.mastered_at 
      END,
      skipped = EXCLUDED.skipped;
  `;

  const values = [uid, wordIds, progresses, nextAts, masteredAts, skippedFlags];

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
