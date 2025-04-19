import { PostgresClient, WordUpdate, Word, Note } from "../types/dataTypes";
import {
  getNextAt,
  getLearnedAt,
  getMasteredAt,
} from "../utils/progress.utils";
import { withDbClient } from "../utils/database.utils";
import config from "../config/config";
import { Score } from "../types/dataTypes";

/**
 * Return required words for the user from PostgreSQL database.
 */
export async function getWordsPostgres(
  db: PostgresClient,
  userId: number
): Promise<Word[]> {
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
      uw.learned_at IS NOT NULL AS learned      
    FROM words w
    LEFT JOIN user_words uw ON w.id = uw.word_id AND uw.user_id = $1
    WHERE uw.mastered_at IS NULL
      AND w.category = 'word'
      AND (uw.next_at IS NULL OR uw.next_at < NOW())
    ORDER BY 
      CASE 
        WHEN uw.progress > 0 THEN 1
        ELSE 2
      END ASC,
      w.word_order ASC
    LIMIT $2;
  `;

  return await withDbClient(db, async (client) => {
    const res = await client.query(query, [userId, numWords]);
    return res.rows;
  });
}

/**
 * Updates the user's word progress in a PostgreSQL database. --- learned_at a mastered_at se mění pouze při hraničním času
 */
export async function updateWordsPostgres(
  db: PostgresClient,
  userId: number,
  words: WordUpdate[]
): Promise<void> {
  const values: unknown[] = [];

  const query = `
    INSERT INTO user_words (user_id, word_id, progress, next_at, learned_at, mastered_at)
    VALUES 
    ${words
      .map(
        (_, index) =>
          `($${index * 6 + 1}, $${index * 6 + 2}, $${index * 6 + 3}, $${
            index * 6 + 4
          }, $${index * 6 + 5}, $${index * 6 + 6})`
      )
      .join(", ")}
    ON CONFLICT(user_id, word_id) 
    DO UPDATE SET 
      progress = EXCLUDED.progress, 
      next_at = EXCLUDED.next_at, 
      learned_at = CASE WHEN user_words.learned_at IS NULL AND EXCLUDED.learned_at IS NOT NULL THEN EXCLUDED.learned_at ELSE user_words.learned_at END, 
      mastered_at = CASE WHEN user_words.mastered_at IS NULL AND EXCLUDED.mastered_at IS NOT NULL THEN EXCLUDED.mastered_at ELSE user_words.mastered_at END;
  `;

  words.forEach((word) => {
    values.push(
      userId,
      word.id,
      word.progress,
      getNextAt(word.progress),
      getLearnedAt(word.progress),
      getMasteredAt(word.progress)
    );
  });

  await withDbClient(db, async (client) => {
    await client.query(query, values);
  });
}

/**
 * Gets count of learned and mastered words for a user grouped by cefr_level.
 */
export async function getScorePostgres(
  db: PostgresClient,
  userId: number,
  userTimezone: string = "Europe/Prague"
): Promise<Score[]> {
  const query = `
    SELECT 
      w.cefr_level,
      COUNT(*) AS "Count",
      COUNT(CASE WHEN uw.started_at IS NOT NULL AND DATE(uw.started_at AT TIME ZONE $2) = DATE(NOW() AT TIME ZONE $2) THEN 1 END) AS "startedCountToday",
      COUNT(CASE WHEN uw.started_at IS NOT NULL AND DATE(uw.started_at AT TIME ZONE $2) != DATE(NOW() AT TIME ZONE $2) THEN 1 END) AS "startedCount",
      COUNT(CASE WHEN uw.learned_at IS NOT NULL AND DATE(uw.learned_at AT TIME ZONE $2) = DATE(NOW() AT TIME ZONE $2) THEN 1 END) AS "learnedCountToday",
      COUNT(CASE WHEN uw.learned_at IS NOT NULL AND DATE(uw.learned_at AT TIME ZONE $2) != DATE(NOW() AT TIME ZONE $2) THEN 1 END) AS "learnedCount",
      COUNT(CASE WHEN uw.mastered_at IS NOT NULL AND DATE(uw.mastered_at AT TIME ZONE $2) = DATE(NOW() AT TIME ZONE $2) THEN 1 END) AS "masteredCountToday",
      COUNT(CASE WHEN uw.mastered_at IS NOT NULL AND DATE(uw.mastered_at AT TIME ZONE $2) != DATE(NOW() AT TIME ZONE $2) THEN 1 END) AS "masteredCount"
    FROM words w
    LEFT JOIN user_words uw ON w.id = uw.word_id AND uw.user_id = $1
    GROUP BY w.cefr_level;
  `;

  return await withDbClient(db, async (client) => {
    const result = await client.query(query, [userId, userTimezone]);
    return result.rows.map((row) => ({
      cefr_level: row.cefr_level,
      Count: parseInt(row.Count, 10),
      startedCountToday: parseInt(row.startedCountToday, 10),
      startedCount: parseInt(row.startedCount, 10),
      learnedCountToday: parseInt(row.learnedCountToday, 10),
      learnedCount: parseInt(row.learnedCount, 10),
      masteredCountToday: parseInt(row.masteredCountToday, 10),
      masteredCount: parseInt(row.masteredCount, 10),
    }));
  });
}

/**
 * Inserts or updates the user's word notes in a PostgreSQL database.
 */
export async function insertNotePostgres(
  db: PostgresClient,
  note: Note
): Promise<void> {
  const query = `
    INSERT INTO word_notes (user_id, word_id, note)
    VALUES ($1, $2, $3)
  `;

  const values = [note.user_id, note.word_id, note.note];

  await withDbClient(db, async (client) => {
    await client.query(query, values);
  });
}
