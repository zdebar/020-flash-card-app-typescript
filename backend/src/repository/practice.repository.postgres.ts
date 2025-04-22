import { PostgresClient } from "../types/dataTypes";
import {
  getNextAt,
  getLearnedAt,
  getMasteredAt,
} from "../utils/progress.utils";
import { withDbClient } from "../utils/database.utils";
import config from "../config/config";
import {
  UserScore,
  WordProgress,
  WordPractice,
  Note,
} from "../../../shared/types/dataTypes";

/**
 * Return required words for the user from PostgreSQL database.
 */
export async function getWordsPostgres(
  db: PostgresClient,
  uid: string
): Promise<WordPractice[]> {
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
    LEFT JOIN user_words uw ON w.id = uw.word_id AND uw.user_id = (SELECT id FROM users WHERE uid = $1)
    WHERE uw.mastered_at IS NULL
      AND w.category = 'word'
      AND (uw.next_at IS NULL OR uw.next_at < NOW())
    ORDER BY 
      CASE 
        WHEN uw.progress > 0 THEN 1
        ELSE 2
      END ASC,
      w.item_order ASC
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
  const values: unknown[] = [];

  const query = `
    WITH user_id_cte AS (
      SELECT id AS user_id FROM users WHERE uid = $1
    )
    INSERT INTO user_words (user_id, word_id, progress, next_at, learned_at, mastered_at)
    VALUES 
    ${words
      .map(
        (_, index) =>
          `((SELECT user_id FROM user_id_cte), $${index * 5 + 2}, $${
            index * 5 + 3
          }, $${index * 5 + 4}, $${index * 5 + 5}, $${index * 5 + 6})`
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
      word.id,
      word.progress,
      getNextAt(word.progress),
      getLearnedAt(word.progress),
      getMasteredAt(word.progress)
    );
  });

  await withDbClient(db, async (client) => {
    await client.query(query, [uid, ...values]);
  });
}

/**
 * Gets count of learned and mastered words for a user grouped by cefr_level.
 */
export async function getScorePostgres(
  db: PostgresClient,
  uid: string,
  userTimezone: string = "Europe/Prague"
): Promise<UserScore[]> {
  const query = `
    SELECT 
      COUNT(CASE WHEN uw.learned_at IS NOT NULL AND DATE(uw.learned_at AT TIME ZONE $2) = DATE(NOW() AT TIME ZONE $2) THEN 1 END) AS "learnedCountToday",
      COUNT(CASE WHEN uw.learned_at IS NOT NULL AND DATE(uw.learned_at AT TIME ZONE $2) != DATE(NOW() AT TIME ZONE $2) THEN 1 END) AS "learnedCount",
    FROM words w
    LEFT JOIN user_words uw ON w.id = uw.word_id AND uw.user_id = (SELECT id FROM users WHERE uid = $1)
  `;

  return await withDbClient(db, async (client) => {
    const result = await client.query(query, [uid, userTimezone]);
    return result.rows.map((row) => ({
      learnedCountToday: parseInt(row.learnedCountToday, 10),
      learnedCount: parseInt(row.learnedCount, 10),
    }));
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
    INSERT INTO word_notes (user_id, word_id, note)
    VALUES ((SELECT id FROM users WHERE uid = $1), $2, $3)
  `;

  const values = [uid, note.word_id, note.note];

  await withDbClient(db, async (client) => {
    await client.query(query, values);
  });
}
