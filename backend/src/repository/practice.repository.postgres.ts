import { PostgresClient } from "../types/dataTypes";
import { getNextAt, getMasteredAt } from "../utils/update.utils";
import { withDbClient } from "../utils/database.utils";
import config from "../config/config";
import {
  UserScore,
  Word,
  WordProgress,
  GrammarLecture,
  GrammarProgress,
  PronunciationLecture,
  PronunciationItem,
} from "../../../shared/types/dataTypes";

/**
 * Return required words for the user from PostgreSQL database.
 */
export async function getWords(
  db: PostgresClient,
  uid: string
): Promise<Word[]> {
  const numWords: number = config.block;
  const query = `
    SELECT
      i.id,
      i.czech,
      i.english,
      i.pronunciation,
      i.audio,
        COALESCE(ui.progress,0) AS progress,
        ui.started_at IS NOT NULL AS started,  
        ui.skipped IS TRUE AS skipped
    FROM items i
    LEFT JOIN user_items ui ON i.id = ui.item_id AND ui.user_id = (SELECT id FROM users WHERE uid = $1)
    JOIN block_items bi ON i.id = bi.item_id
    JOIN blocks b ON b.id = bi.block_id AND b.id = 1
    WHERE ui.mastered_at IS null
      AND COALESCE(ui.skipped, false) = false
      AND (ui.next_at is null or ui.next_at < NOW())
    ORDER BY 
        ui.next_at ASC NULLS LAST,
        bi.item_order ASC NULLS FIRST
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
export async function updateWords(
  db: PostgresClient,
  uid: string,
  items: WordProgress[]
): Promise<void> {
  if (items.length === 0) {
    return; // No words to update
  }

  // Prepare data for unnest
  const itemIds = items.map((item) => item.id);
  const progresses = items.map((item) => item.progress);
  const nextAts = items.map((item) => getNextAt(item.progress));
  const masteredAts = items.map((item) => getMasteredAt(item.progress));
  const skippedFlags = items.map((item) => item.skipped);

  const query = `
    WITH user_id_cte AS (
      SELECT id AS user_id FROM users WHERE uid = $1
    ),

    word_data AS (
      SELECT 
        unnest($2::int[]) AS item_id,
        unnest($3::int[]) AS progress,
        unnest($4::timestamptz[]) AS next_at,
        unnest($5::timestamptz[]) AS mastered_at,
        unnest($6::boolean[]) AS skipped
    ),

    -- Insert or update user_items table
    insert_or_update AS (
      INSERT INTO user_items (user_id, item_id, progress, next_at, mastered_at, skipped)
      SELECT 
        (SELECT user_id FROM user_id_cte),
        wd.item_id,
        wd.progress,
        wd.next_at,
        wd.mastered_at,
        wd.skipped
      FROM word_data wd
      ON CONFLICT(user_id, item_id) 
      DO UPDATE SET 
        progress = EXCLUDED.progress, 
        next_at = EXCLUDED.next_at, 
        mastered_at = CASE 
          WHEN user_items.mastered_at IS NULL AND EXCLUDED.mastered_at IS NOT NULL 
          THEN EXCLUDED.mastered_at 
          ELSE user_items.mastered_at 
        END,
        skipped = EXCLUDED.skipped
      RETURNING user_id
    ),

    -- Count the number of items in user_items for the given user
    item_count AS (    
    SELECT COUNT(*) AS total_items
    FROM user_items
    WHERE user_id = (SELECT user_id FROM user_id_cte)
    ),

    -- Find blocks where unlock_at <= total_items and not already in user_blocks
    unlocked_blocks AS (
    SELECT b.id AS block_id
    FROM blocks b
    CROSS JOIN item_count
    WHERE b.unlock_at <= item_count.total_items
      AND NOT EXISTS (
        SELECT 1
        FROM user_blocks ub
        WHERE ub.user_id = (SELECT user_id FROM user_id_cte)
          AND ub.block_id = b.id
      )
    ),

    -- Insert missing blocks into user_blocks
    INSERT INTO user_blocks (user_id, block_id, started_at, next_at)
    SELECT 
      (SELECT user_id FROM user_id_cte),
      ub.block_id,
      NOW(),
      NOW()
    FROM unlocked_blocks ub;
  `;

  const values = [uid, itemIds, progresses, nextAts, masteredAts, skippedFlags];

  await withDbClient(db, async (client) => {
    await client.query(query, values);
  });
}

/**
 * Gets count of learned words, and next grammar practice date from PostgreSQL database.
 */
export async function getScore(
  db: PostgresClient,
  uid: string
): Promise<UserScore> {
  const query = `
    WITH user_id_cte AS (
      SELECT id AS user_id FROM users WHERE uid = $1
    )
    SELECT 
      COUNT(CASE WHEN ui.started_at IS NOT NULL AND DATE(ui.started_at AT TIME ZONE 'UTC') = CURRENT_DATE THEN 1 END) AS "startedCountToday",
      COUNT(CASE WHEN ui.started_at IS NOT NULL THEN 1 END) AS "startedCount",
      MIN(ub.next_at) AS "nextGrammarDate"
    FROM user_items ui
    LEFT JOIN user_blocks ub ON ub.user_id = (SELECT user_id FROM user_id_cte)
    WHERE ub.block_id IN (
      SELECT id FROM blocks WHERE category = 'grammar'
    );
  `;

  return await withDbClient(db, async (client) => {
    const result = await client.query(query, [uid]);
    const row = result.rows[0];

    return {
      startedCountToday: parseInt(row.startedCountToday, 10),
      startedCount: parseInt(row.startedCount, 10),
      nextGrammarDate: row.nextGrammarDate
        ? new Date(row.nextGrammarDate)
        : null,
    };
  });
}

/**
 * Gets grammar lecture words from PostgreSQL database.
 */
export async function getGrammar(
  db: PostgresClient,
  uid: string
): Promise<GrammarLecture | null> {
  const query = `
    WITH user_id_cte AS (
      SELECT id AS user_id FROM users WHERE uid = $1
    ),
    oldest_block AS (
      SELECT 
        b.id AS block_id, 
        b.block_name AS block_name, 
        b.explanation AS block_explanation,
        ub.progress AS progress,
        ub.skipped AS skipped
      FROM blocks b
      JOIN user_blocks ub ON b.id = ub.block_id
      WHERE ub.user_id = (SELECT user_id FROM user_id_cte)
        AND b.category = 'grammar'
        AND ub.mastered_at IS NULL
        AND ub.skipped IS FALSE
      ORDER BY ub.next_at ASC
      LIMIT 1
    )
    SELECT 
      ob.block_id,
      ob.block_name,
      ob.block_explanation,
      ob.progress,
      ob.skipped,
      COALESCE(
        JSON_AGG(
          JSON_BUILD_OBJECT(
            'id', i.id,
            'czech', i.czech,
            'english', i.english,
            'pronunciation', i.pronunciation,
            'audio', i.audio
          )
        ) FILTER (WHERE i.id IS NOT NULL), '[]'
      ) AS items
    FROM oldest_block ob
    LEFT JOIN block_items bi ON ob.block_id = bi.block_id
    LEFT JOIN items i ON bi.item_id = i.id
    LEFT JOIN user_items ui ON i.id = ui.item_id AND ui.user_id = (SELECT user_id FROM user_id_cte)
    GROUP BY ob.block_id, ob.block_name, ob.block_explanation;
  `;

  return await withDbClient(db, async (client) => {
    const res = await client.query(query, [uid]);
    return res.rows[0] as GrammarLecture;
  });
}

/**
 * Updates the user's grammar lecture progress in a PostgreSQL database.
 */
export async function updateGrammar(
  db: PostgresClient,
  uid: string,
  grammarUpdate: GrammarProgress
): Promise<void> {
  const { block_id, progress, skipped } = grammarUpdate;

  const query = `
    WITH user_id_cte AS (
      SELECT id AS user_id FROM users WHERE uid = $1
    )
    UPDATE user_blocks
    SET 
      progress = $3, 
      skipped = $4, 
      next_at = $5
    WHERE user_id = (SELECT user_id FROM user_id_cte) AND block_id = $2
  `;

  await withDbClient(db, async (client) => {
    await client.query(query, [
      uid,
      block_id,
      progress,
      skipped,
      getNextAt(progress),
    ]);
  });
}

/**
 * Gets the list of pronunciation blocks from PostgreSQL database.
 */
export async function getPronunciationList(
  db: PostgresClient
): Promise<PronunciationItem[]> {
  const query = `
    SELECT 
      b.id,
      b.block_name     
    FROM blocks b
    WHERE b.category = 'pronunciation';
  `;

  return await withDbClient(db, async (client) => {
    const res = await client.query(query);
    return res.rows;
  });
}

export async function getPronunciation(
  db: PostgresClient,
  block_id: number
): Promise<PronunciationLecture> {
  const query = `
    WITH block_data AS (
      SELECT 
        b.id AS block_id,
        b.block_name,
        b.explanation AS block_explanation
      FROM blocks b
      WHERE b.id = $1
    )
    SELECT 
      bd.block_id,
      bd.block_name,
      bd.block_explanation,
      JSON_AGG(
        JSON_AGG(
          JSON_BUILD_OBJECT(
            'id', i.id,
            'czech', i.czech,
            'english', i.english,
            'pronunciation', i.pronunciation,
            'audio', i.audio
          )
        )
      ) AS items
    FROM block_data bd
    JOIN block_items bi ON bd.block_id = bi.block_id
    JOIN items i ON bi.item_id = i.id
    LEFT JOIN user_items ui ON i.id = ui.item_id
    GROUP BY bd.block_id, bd.block_name, bd.block_explanation, bi."group";
  `;

  return await withDbClient(db, async (client) => {
    const res = await client.query(query, [block_id]);
    return res.rows[0] as PronunciationLecture;
  });
}
