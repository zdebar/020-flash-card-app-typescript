import { PostgresClient } from "../types/dataTypes";
import { UserScore } from "../../../shared/types/dataTypes";
import { withDbClient } from "../utils/database.utils";
import { QueryResult } from "pg";

/**
 * Finds User by userUid. Creates a new user if not found.
 */
export async function insertUserRepository(
  db: PostgresClient,
  uid: string
): Promise<void> {
  try {
    const user: QueryResult<any> = await db.query(
      `
        INSERT INTO users (uid)
        VALUES ($1)
        ON CONFLICT (uid) DO NOTHING;
        `,
      [uid]
    );
  } catch (error) {
    throw new Error(
      `Error in getUserRepository: ${
        (error as any).message
      } | db type: ${typeof db} | uid: ${uid} `
    );
  }
}

/**
 * Finds User by userUid. Creates a new user if not found.
 * @throws Error if the user does not exist.
 */
export async function resetUserLanguageRepository(
  db: PostgresClient,
  uid: string,
  languageID: number
): Promise<void> {
  try {
    await withDbClient(db, async (client) => {
      await client.query(
        `
        WITH user_cte AS (
          SELECT id AS user_id FROM users WHERE uid = $1
        )
        DELETE FROM user_items
        USING items, user_cte
        WHERE user_items.item_id = items.id
          AND items.language_id = $2
          AND user_items.user_id = user_cte.user_id;
        `,
        [uid, languageID]
      );
    });
  } catch (error) {
    throw new Error(
      `Error in resetUserLanguageRepository: ${
        (error as any).message
      } | db type: ${typeof db} | uid: ${uid} | languageID: ${languageID}`
    );
  }
}

/**
 * Updates the user's score in a PostgreSQL database.
 * @param db
 * @param uid
 * @param languageID
 */
export async function updateUserScoreRepository(
  db: PostgresClient,
  uid: string,
  languageID: number
): Promise<void> {
  try {
    const query = `
      INSERT INTO user_score (user_id, day, count, language_id)
      VALUES ((SELECT id FROM users WHERE uid = $1), CURRENT_DATE, 1, $2)
      ON CONFLICT (user_id, day, language_id) 
      DO UPDATE SET count = user_score.count + 1;
    `;

    await withDbClient(db, async (client) => {
      await client.query(query, [uid, languageID]);
    });
  } catch (error) {
    throw new Error(
      `Error in updateUserItemsRepository: ${
        (error as any).message
      } | db type: ${typeof db} | uid: ${uid} | languageID: ${languageID}`
    );
  }
}

/**
 * Gets count of learned words, and next grammar practice date from PostgreSQL database.
 */
export async function getScoreRepository(
  db: PostgresClient,
  uid: string
): Promise<UserScore[]> {
  try {
    const query = `
      WITH user_cte AS (
        SELECT id AS user_id 
        FROM users 
        WHERE uid = $1
      ),
      days_cte AS (
        SELECT generate_series(
          CURRENT_DATE - INTERVAL '3 days',
          CURRENT_DATE,
          INTERVAL '1 day'
        )::date AS day
      ),
      blocks_cte as ( 
        SELECT 
          l.id as language_id,
          json_object_agg(d.day::text, COALESCE(us.count, 0)) AS count
        FROM 
          languages l
        CROSS JOIN 
          days_cte d
        LEFT JOIN 
          user_score us 
            ON us.user_id = (SELECT user_id FROM user_cte)
          AND us.language_id = l.id
          AND us.day = d.day
        GROUP BY 
          l.id
      ),
      items_count_cte AS (
        SELECT l.id as language_id,
              COALESCE(cl.level, 'none') AS level_id, 
              COUNT(*) AS itemsCount
        FROM items i
        LEFT JOIN levels cl ON i.level_id = cl.id
        JOIN languages l
          ON l.id = i.language_id
        GROUP BY l.id, COALESCE(cl.level, 'none')
      ),
      learned_counts_cte AS (
        SELECT l.id as language_id,
              COALESCE(cl.level, 'none') AS level_id, 
              COUNT(*) FILTER (WHERE ui.learned_at IS NOT NULL AND DATE(ui.learned_at AT TIME ZONE 'UTC') = CURRENT_DATE) AS learnedCountTodayByLevel,
              COUNT(*) FILTER (WHERE ui.learned_at IS NOT NULL AND DATE(ui.learned_at AT TIME ZONE 'UTC') != CURRENT_DATE) AS learnedCountByLevel
        FROM user_items ui
        JOIN items i ON ui.item_id = i.id
        LEFT JOIN levels cl ON i.level_id = cl.id
        JOIN languages l
          ON l.id = i.language_id
        WHERE ui.user_id = (SELECT user_id FROM user_cte)
        GROUP BY l.id, COALESCE(cl.level, 'none')
      )
      SELECT 
        l.id AS "languageID",
        l.name AS "languageName",
        (SELECT count FROM blocks_cte WHERE blocks_cte.language_id = l.id) AS "blockCount",
        JSON_OBJECT_AGG(COALESCE(ic.level_id, 'none'), COALESCE(ic.itemsCount, 0)) AS "itemsCountByLevel", 
        JSON_OBJECT_AGG(COALESCE(lc.level_id, 'none'), COALESCE(lc.learnedCountTodayByLevel, 0)) AS "learnedCountTodayByLevel",
        JSON_OBJECT_AGG(COALESCE(lc.level_id, 'none'), COALESCE(lc.learnedCountByLevel, 0)) AS "learnedCountByLevel"
      FROM languages l
      LEFT JOIN items_count_cte ic ON l.id = ic.language_id
      LEFT JOIN learned_counts_cte lc ON l.id = lc.language_id
      GROUP BY l.id, l.name;
    `;

    return await withDbClient(db, async (client) => {
      const result = await client.query(query, [uid]);

      return result.rows.map((row) => ({
        languageID: row.languageID,
        languageName: row.languageName,
        blockCount: row.blockCount,
        itemsCountByLevel: row.itemsCountByLevel,
        learnedCountTodayByLevel: row.learnedCountTodayByLevel,
        learnedCountByLevel: row.learnedCountByLevel,
      }));
    });
  } catch (error) {
    throw new Error(
      `Error in getScoreRepository: ${
        (error as any).message
      } | db type: ${typeof db} | uid: ${uid}`
    );
  }
}
