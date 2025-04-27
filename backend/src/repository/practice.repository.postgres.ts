import { PostgresClient } from "../types/dataTypes";
import { getNextAt, getMasteredAt } from "../utils/update.utils";
import { withDbClient } from "../utils/database.utils";
import config from "../config/config";
import {
  UserScore,
  WordProgress,
  Note,
  WordTransfer,
} from "../../../shared/types/dataTypes";

/**
 * Return required words for the user from PostgreSQL database.
 */
export async function getWordsPostgres(
  db: PostgresClient,
  uid: string
): Promise<WordTransfer[]> {
  const numWords: number = config.block;
  const query = `
    SELECT 
      w.id, 
      w.czech, 
      w.english, 
      w.pronunciation,
      w.audio,
      COALESCE(uw.progress,0) AS progress,
      uw.started_at IS NOT NULL AS started,  
      uw.skipped
    FROM words w
    LEFT JOIN user_words uw ON w.id = uw.word_id AND uw.user_id = (SELECT id FROM users WHERE uid = $1)
    WHERE uw.mastered_at IS NULL
      AND w.category = 'word'
      AND COALESCE(uw.skipped, false) = false
      AND (uw.next_at IS NULL OR uw.next_at < NOW() AT TIME ZONE 'UTC')
    ORDER BY 
      CASE 
        WHEN uw.progress > 0 THEN 1
        ELSE 2
      END ASC,
      uw.next_at ASC NULLS FIRST
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
export async function updateWordsPostgres(
  db: PostgresClient,
  uid: string,
  words: WordProgress[]
): Promise<void> {
  if (words.length === 0) {
    return; // No words to update
  }

  // Prepare data for unnest
  const wordIds = words.map((word) => word.id);
  const progresses = words.map((word) => word.progress);
  const nextAts = words.map((word) => getNextAt(word.progress) || null);
  const masteredAts = words.map((word) => getMasteredAt(word.progress) || null);
  const skippedFlags = words.map((word) => word.skipped);

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
    INSERT INTO user_words (user_id, word_id, progress, next_at, mastered_at, skipped)
    SELECT 
      (SELECT user_id FROM user_id_cte),
      wd.word_id,
      wd.progress,
      wd.next_at,
      wd.mastered_at,
      wd.skipped
    FROM word_data wd
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
 * Gets count of learned and mastered words for a user grouped by cefr_level.
 */
export async function getScorePostgres(
  db: PostgresClient,
  uid: string
): Promise<UserScore> {
  const query = `
    WITH user_id_cte AS (
      SELECT id AS user_id FROM users WHERE uid = $1
    )
    SELECT 
      COUNT(CASE WHEN uw.started_at IS NOT NULL AND DATE(uw.started_at AT TIME ZONE 'UTC') = CURRENT_DATE THEN 1 END) AS "startedCountToday",
      COUNT(CASE WHEN uw.started_at IS NOT NULL THEN 1 END) AS "startedCount",
      COALESCE(MAX(dp.progress_sum), 0) AS "progressToday" 
    FROM words w
    LEFT JOIN user_words uw ON w.id = uw.word_id AND uw.user_id = (SELECT user_id FROM user_id_cte)
    LEFT JOIN daily_progress dp ON dp.user_id = (SELECT user_id FROM user_id_cte) AND dp.progress_date = CURRENT_DATE
  `;

  return await withDbClient(db, async (client) => {
    const result = await client.query(query, [uid]);
    const row = result.rows[0];

    return {
      startedCountToday: parseInt(row.startedCountToday, 10),
      startedCount: parseInt(row.startedCount, 10),
      progressToday: parseInt(row.progressToday, 10),
    };
  });
}

/**
 * Inserts or updates the user's word notes in a PostgreSQL database.
 */
export async function insertNotePostgres(
  db: PostgresClient,
  uid: string,
  note: Note
): Promise<void> {
  const query = `
    INSERT INTO word_notes (user_id, word_id, user_note)
    VALUES ((SELECT id FROM users WHERE uid = $1), $2, $3)
  `;

  const values = [uid, note.word_id, note.note];

  await withDbClient(db, async (client) => {
    await client.query(query, values);
  });
}
