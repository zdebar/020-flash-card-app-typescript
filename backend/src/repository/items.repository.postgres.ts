import { PostgresClient } from "../types/dataTypes";
import { getNextAt, getMasteredAt } from "../utils/update.utils";
import { withDbClient } from "../utils/database.utils";
import config from "../config/config";
import { UserScore, Item, ItemInfo } from "../../../shared/types/dataTypes";

/**
 * Return required items for the user from PostgreSQL database.
 */
export async function getItemsRepository(
  db: PostgresClient,
  uid: string
): Promise<Item[]> {
  const numWords: number = config.round;

  const runQuery = async (isOdd: number): Promise<Item[]> => {
    const query = `
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
          COUNT(b.id) > 0 as has_info 
      FROM items i
      LEFT JOIN user_items ui ON i.id = ui.item_id AND ui.user_id = (SELECT user_id FROM user_cte)
      LEFT JOIN block_items bi ON i.id = bi.item_id
      LEFT JOIN blocks b ON bi.block_id = b.id
      WHERE ui.mastered_at IS NULL
        AND (ui.next_at IS NULL OR ui.next_at < NOW())
        AND COALESCE(ui.progress, 0) % 2 = $2 
      GROUP BY 
          i.id, i.czech, i.english, i.pronunciation, i.audio, ui.progress, b.block_order, ui.next_at
      ORDER BY 
          ui.next_at ASC NULLS LAST,
          COALESCE(i.item_order, b.block_order, 0),
          i.id ASC
      LIMIT $3;
    `;

    const res = await withDbClient(db, async (client) => {
      return await client.query(query, [uid, isOdd, numWords]);
    });

    return res.rows;
  };

  const randomChoice = Math.random() < 0.5 ? 1 : 0;
  let items = await runQuery(randomChoice);

  if (items.length < numWords) {
    items = await runQuery(0);
  }

  return items;
}

/**
 * Updates the user's word progress in a PostgreSQL database. --- learned_at a mastered_at se mění pouze při hraničním času
 */
export async function patchItemsRepository(
  db: PostgresClient,
  uid: string,
  items: Item[],
  onBlockEnd: boolean
): Promise<void> {
  if (items.length === 0) {
    throw new Error("No items to update");
    return;
  }

  for (const item of items) {
    if (!item.id || item.progress === undefined) {
      throw new Error(
        "Invalid item data: Each item must have an id and progress."
      );
    }
  }

  const itemIds = items.map((item) => item.id);
  const progresses = items.map((item) => item.progress);
  const nextAts = items.map((item) => getNextAt(item.progress));
  const masteredAts = items.map((item) => getMasteredAt(item.progress) || null);

  const query = `
    WITH user_id_cte AS (
      SELECT id AS user_id FROM users WHERE uid = $1
    ),
    item_data AS (
      SELECT 
        unnest($2::int[]) AS item_id,
        unnest($3::int[]) AS progress,
        unnest($4::timestamptz[]) AS next_at,
        unnest($5::timestamptz[]) AS mastered_at
    )
    INSERT INTO user_items (user_id, item_id, progress, next_at, mastered_at)
    SELECT 
      user_id,
      wd.item_id,
      wd.progress,
      wd.next_at,
      wd.mastered_at
    FROM user_id_cte, item_data wd
    ON CONFLICT(user_id, item_id) 
    DO UPDATE SET 
      progress = EXCLUDED.progress, 
      next_at = EXCLUDED.next_at, 
      mastered_at = CASE 
        WHEN user_items.mastered_at IS NULL AND EXCLUDED.mastered_at IS NOT NULL 
        THEN EXCLUDED.mastered_at 
        ELSE user_items.mastered_at 
      END;
  `;

  const values = [uid, itemIds, progresses, nextAts, masteredAts];

  await withDbClient(db, async (client) => {
    await client.query(query, values);

    if (onBlockEnd) {
      const scoreQuery = `
        INSERT INTO user_score (user_id, day, blockCount)
        VALUES ((SELECT id FROM users WHERE uid = $1), CURRENT_DATE, 1)
        ON CONFLICT (user_id, day) 
        DO UPDATE SET blockCount = user_score.blockCount + 1;
      `;
      await client.query(scoreQuery, [uid]);
    }
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
    ),
    blocks_cte AS (
      SELECT ARRAY_AGG(blockCount ORDER BY day DESC) AS blockCount
      FROM user_score
      WHERE user_id = (SELECT user_id FROM user_cte)
      GROUP BY user_id
    ),
    started_cte AS (
      SELECT 
        COUNT(*) FILTER (WHERE DATE(ui.started_at AT TIME ZONE 'UTC') = CURRENT_DATE) AS startedCountToday,
        COUNT(*) AS startedCount
      FROM user_items ui
      WHERE ui.user_id = (SELECT user_id FROM user_cte)
    ),
    total_cte AS (
      SELECT COUNT(*) AS itemsTotal
      FROM items
    )
    SELECT 
      COALESCE(blocks_cte.blockCount, ARRAY[]::int[]) AS "blockCount", 
      started_cte.startedCountToday AS "startedCountToday",
      started_cte.startedCount AS "startedCount",
      total_cte.itemsTotal AS "itemsTotal"
    FROM blocks_cte, started_cte, total_cte;
  `;

  return await withDbClient(db, async (client) => {
    const result = await client.query(query, [uid]);
    const row = result.rows[0];

    return {
      startedCountToday: parseInt(row.startedCountToday, 10),
      startedCount: parseInt(row.startedCount, 10),
      blockCount: row.blockCount,
      itemsTotal: parseInt(row.itemsTotal, 10),
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
