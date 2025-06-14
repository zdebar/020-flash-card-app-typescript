import { PostgresClient } from "../types/dataTypes";
import { getNextAt, getLearnedAt, getMasteredAt } from "../utils/update.utils";
import { withDbClient } from "../utils/database.utils";
import config from "../config/config";
import { UserScore, Item, ItemInfo } from "../../../shared/types/dataTypes";
import { get } from "http";

/**
 * Return required items for the user from PostgreSQL database.
 */
export async function getItemsRepository(
  db: PostgresClient,
  uid: string
): Promise<Item[]> {
  try {
    const numWords: number = config.round;

    const runQuery = async (): Promise<Item[]> => {
      const query = `
        WITH user_cte AS (
          SELECT id AS user_id FROM users WHERE uid = $1
        ),
        has_info_cte AS (
          SELECT bi.item_id
          FROM block_items bi
          JOIN blocks b ON bi.block_id = b.id
          WHERE b.category_id = 1
        )
        SELECT
          i.id,
          i.czech,
          i.english,
          i.pronunciation,
          i.audio,
          COALESCE(ui.progress, 0) AS progress,
          EXISTS (
            SELECT 1
            FROM has_info_cte
            WHERE has_info_cte.item_id = i.id
          ) AS "hasContextInfo",
          EXISTS (
            SELECT 1
            FROM has_info_cte
            WHERE has_info_cte.item_id = i.id AND i.item_order = 1 AND ui.progress = 0
          ) AS "showContextInfo"
        FROM items i 
        LEFT JOIN user_items ui ON i.id = ui.item_id AND ui.user_id = (SELECT user_id FROM user_cte)
        LEFT JOIN block_items bi on i.id = bi.item_id
        LEFT JOIN blocks b on bi.block_id = b.id 
        WHERE ui.mastered_at IS NULL
          AND (ui.next_at IS NULL OR ui.next_at < NOW())
          AND (b.category_id IN (0, 1) OR b.category_id IS NULL)
        order by
          ui.next_at ASC NULLS last,
          COALESCE(b.block_order, i.item_order) ASC NULLS LAST,
          i.item_order,
          i.id
        limit $2;
        `;

      const res = await withDbClient(db, async (client) => {
        return await client.query(query, [uid, numWords]);
      });

      return res.rows;
    };

    return await runQuery();
  } catch (error) {
    throw new Error(
      `Error in getItemsRepository: ${
        (error as any).message
      } | db type: ${typeof db} | uid: ${uid}`
    );
  }
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
  try {
    if (items.length === 0) {
      throw new Error("No items to update");
    }

    const itemIds = items.map((item) => item.id);
    const progresses = items.map((item) => item.progress);
    const nextAt = items.map((item) => getNextAt(item.progress));
    const learnedAt = items.map((item) => getLearnedAt(item.progress));
    const masteredAt = items.map((item) => getMasteredAt(item.progress));

    const query1 = `
    WITH user_id_cte AS (
      SELECT id AS user_id FROM users WHERE uid = $1
    ),
    item_data AS (
      SELECT 
        unnest($2::int[]) AS item_id,
        unnest($3::int[]) AS progress,
        unnest($4::timestamptz[]) AS next_at,
        unnest($5::timestamptz[]) AS learned_at,
        unnest($6::timestamptz[]) AS mastered_at
    )
    INSERT INTO user_items (user_id, item_id, progress, next_at, learned_at, mastered_at)
    SELECT 
      user_id,
      wd.item_id,
      wd.progress,
      wd.next_at,
      wd.learned_at,
      wd.mastered_at
    FROM user_id_cte, item_data wd
    ON CONFLICT(user_id, item_id) 
    DO UPDATE SET 
      progress = EXCLUDED.progress, 
      next_at = EXCLUDED.next_at, 
      learned_at = CASE 
        WHEN user_items.learned_at IS NULL AND EXCLUDED.learned_at IS NOT NULL 
        THEN EXCLUDED.learned_at 
        ELSE user_items.learned_at 
      END,
      mastered_at = CASE 
        WHEN user_items.mastered_at IS NULL AND EXCLUDED.mastered_at IS NOT NULL 
        THEN EXCLUDED.mastered_at 
        ELSE user_items.mastered_at 
      END;
    `;

    const query2 = `
    INSERT INTO user_score (user_id, day, blockCount)
    VALUES ((SELECT id FROM users WHERE uid = $1), CURRENT_DATE, 1)
    ON CONFLICT (user_id, day) 
    DO UPDATE SET blockCount = user_score.blockCount + 1;
    `;

    const values = [uid, itemIds, progresses, nextAt, learnedAt, masteredAt];

    await withDbClient(db, async (client) => {
      await client.query(query1, values);
      if (onBlockEnd) {
        await client.query(query2, [uid]);
      }
    });
  } catch (error) {
    throw new Error(
      `Error in patchItemsRepository: ${
        (error as any).message
      } | db type: ${typeof db} | uid: ${uid} | items: ${JSON.stringify(
        items
      )} | onBlockEnd: ${onBlockEnd}`
    );
  }
}

/**
 * Gets count of learned words, and next grammar practice date from PostgreSQL database.
 */
export async function getScoreRepository(
  db: PostgresClient,
  uid: string
): Promise<UserScore> {
  try {
    const query = `
    WITH user_cte AS (
      SELECT id AS user_id FROM users WHERE uid = $1
    ),
    blocks_cte AS (
      SELECT ARRAY_AGG(COALESCE(us.blockCount, 0) ORDER BY d.day DESC) AS blockCount
      FROM (
        SELECT generate_series(
          CURRENT_DATE - INTERVAL '6 days',
          CURRENT_DATE,
          INTERVAL '1 day'
        )::date AS day
      ) d
      LEFT JOIN user_score us
        ON us.user_id = (SELECT user_id FROM user_cte)
        AND us.day = d.day
    ),
    started_cte AS (
      SELECT 
        COUNT(*) FILTER (WHERE DATE(ui.started_at AT TIME ZONE 'UTC') = CURRENT_DATE) AS startedCountToday,
        COUNT(*) AS startedCount,
        COUNT(*) FILTER (
          WHERE ui.progress > 5 AND DATE(ui.learned_at AT TIME ZONE 'UTC') = CURRENT_DATE
        ) AS learnedCountToday,
        COUNT(*) FILTER (WHERE ui.progress > 5) AS learnedCount
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
      started_cte.learnedCountToday AS "learnedCountToday",
      started_cte.learnedCount AS "learnedCount",
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
        learnedCountToday: parseInt(row.learnedCountToday, 10),
        learnedCount: parseInt(row.learnedCount, 10),
        itemsTotal: parseInt(row.itemsTotal, 10),
      };
    });
  } catch (error) {
    throw new Error(
      `Error in getScoreRepository: ${
        (error as any).message
      } | db type: ${typeof db} | uid: ${uid}`
    );
  }
}

/**
 * Gets relevant grammar info for given item id.
 */
export async function getItemInfoRepository(
  db: PostgresClient,
  item_id: number
): Promise<ItemInfo[]> {
  try {
    const query = `
    SELECT 
      b.id,
      b.block_order,
      b.block_name,
      b.block_explanation
    FROM blocks b
    JOIN block_items bi ON b.id = bi.block_id
    WHERE bi.item_id = $1
      AND b.category_id = 1;
   `;

    return await withDbClient(db, async (client) => {
      const result = await client.query(query, [item_id]);
      return result.rows;
    });
  } catch (error) {
    throw new Error(
      `Error in getGrammarListRepository: ${
        (error as any).message
      } | db type: ${typeof db} | item_id: ${item_id}`
    );
  }
}
