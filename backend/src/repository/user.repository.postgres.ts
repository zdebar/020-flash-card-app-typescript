import { PostgresClient } from "../types/dataTypes";
import { UserScore } from "../../../shared/types/dataTypes";
import { withDbClient } from "../utils/database.utils";
import { formatRepositoryError } from "../utils/error.utils";

/**
 * Finds User by userUid. Creates a new user if not found.
 */
export async function insertUserRepository(
  db: PostgresClient,
  uid: string
): Promise<void> {
  try {
    const query = `
      INSERT INTO users (uid)
      VALUES ($1)
      ON CONFLICT (uid) DO NOTHING;
    `;

    await withDbClient(db, async (client) => {
      await client.query(query, [uid]);
    });
  } catch (error) {
    throw new Error(
      formatRepositoryError(error, "insertUserRepository", {
        dbType: typeof db,
        uid,
      })
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
  languageId: number
): Promise<void> {
  try {
    const query = `
      WITH user_cte AS (
        SELECT id AS user_id FROM users WHERE uid = $1
      )
      DELETE FROM user_items ui
      USING items i, block_items bi, blocks b, user_cte uc
      WHERE ui.item_id = i.id
        AND i.id = bi.item_id
        AND bi.block_id = b.id
        AND b.language_id = $2
        AND ui.user_id = uc.user_id;

      DELETE FROM user_blocks ub
      USING blocks b, user_cte uc
      WHERE ub.block_id = b.id
        AND b.language_id = $2
        AND ub.user_id = uc.user_id;
    `;

    await withDbClient(db, async (client) => {
      await client.query(query, [uid, languageId]);
    });
  } catch (error) {
    throw new Error(
      formatRepositoryError(error, "resetUserLanguageRepository", {
        dbType: typeof db,
        uid,
        languageId,
      })
    );
  }
}

/**
 * Add one to the block count for the user for the given language.
 * @param db
 * @param uid
 * @param languageId
 */
export async function updateUserScoreRepository(
  db: PostgresClient,
  uid: string,
  languageId: number
): Promise<void> {
  try {
    const query = `
      INSERT INTO user_score (user_id, day, count, language_id)
      VALUES ((SELECT id FROM users WHERE uid = $1), CURRENT_DATE, 1, $2)
      ON CONFLICT (user_id, day, language_id) 
      DO UPDATE SET count = user_score.count + 1;
    `;

    await withDbClient(db, async (client) => {
      await client.query(query, [uid, languageId]);
    });
  } catch (error) {
    throw new Error(
      formatRepositoryError(error, "updateUserScoreRepository", {
        dbType: typeof db,
        uid,
        languageId,
      })
    );
  }
}

/**
 * Gets count of learned words, and next grammar practice date from PostgreSQL database.
 */
export async function getUserScoreRepository(
  db: PostgresClient,
  uid: string
): Promise<UserScore[]> {
  try {
    const query = `
      WITH user_cte AS ( -- OK
        SELECT id AS user_id 
        FROM users 
        WHERE uid = $1
      ),
      days_cte AS ( -- OK
        SELECT generate_series(
          CURRENT_DATE - INTERVAL '3 days',
          CURRENT_DATE,
          INTERVAL '1 day'
        )::date AS day
      ),
      blocks_cte AS ( -- 
        SELECT 
          l.id AS language_id,
          json_object_agg(d.day::text, COALESCE(us.count, 0)) AS count
        FROM languages l
        CROSS JOIN days_cte d
        LEFT JOIN user_score us ON us.user_id = (SELECT user_id FROM user_cte)
          AND us.language_id = l.id
          AND us.day = d.day
        GROUP BY l.id
      ),
      items_count_cte AS (
        SELECT 
          b.language_id AS language_id,
          COALESCE(le.level, 'none') AS level_id, 
          COUNT(*) AS itemsCount
        FROM items i
        JOIN blocks b ON i.block_id = b.id
        JOIN levels le ON b.level_id = le.id        
        GROUP BY b.language_id, COALESCE(le.level, 'none')
      ),
      learned_counts_cte AS (
        SELECT 
          b.language_id AS language_id,
          COALESCE(le.level, 'none') AS level_id, 
          COUNT(*) FILTER (WHERE ui.learned_at IS NOT NULL AND DATE(ui.learned_at AT TIME ZONE 'UTC') = CURRENT_DATE) AS learnedCountTodayByLevel,
          COUNT(*) FILTER (WHERE ui.learned_at IS NOT NULL AND DATE(ui.learned_at AT TIME ZONE 'UTC') != CURRENT_DATE) AS learnedCountNotTodayByLevel
        FROM user_items ui
        JOIN items i ON ui.item_id = i.id
        JOIN blocks b ON i.block_id = b.id
        JOIN levels le ON b.level_id = le.id        
        WHERE ui.user_id = (SELECT user_id FROM user_cte)
        GROUP BY b.language_id, COALESCE(le.level, 'none')
      )
      SELECT 
        l.id AS "languageId",
        l.name AS "languageName",
        (SELECT count 
        FROM blocks_cte b 
        WHERE b.language_id = l.id) AS "blockCount",
        (SELECT JSON_OBJECT_AGG(COALESCE(ic.level_id, 'none'), COALESCE(ic.itemsCount, 0))
        FROM items_count_cte ic
        WHERE ic.language_id = l.id) AS "itemsCountByLevel",
        (SELECT JSON_OBJECT_AGG(COALESCE(lc.level_id, 'none'), COALESCE(lc.learnedCountTodayByLevel, 0))
        FROM learned_counts_cte lc
        WHERE lc.language_id = l.id) AS "learnedCountTodayByLevel",
        (SELECT JSON_OBJECT_AGG(COALESCE(lc.level_id, 'none'), COALESCE(lc.learnedCountNotTodayByLevel, 0))
        FROM learned_counts_cte lc
        WHERE lc.language_id = l.id) AS "learnedCountNotTodayByLevel"
      FROM languages l;
    `;

    const res = await withDbClient(db, async (client) => {
      return await client.query(query, [uid]);
    });

    return res.rows;
  } catch (error) {
    throw new Error(
      formatRepositoryError(error, "getUserScoreRepository", {
        dbType: typeof db,
        uid,
      })
    );
  }
}
