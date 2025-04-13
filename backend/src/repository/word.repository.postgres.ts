import { PostgresClient, WordUpdate, Word, WordNote } from "../types/dataTypes";
import config from "../config/config";
import { withDbClient } from "../utils/database.utils";

/**
 * Return required words for the user from PostgreSQL database.
 */
export async function getWordsPostgres(
  db: PostgresClient,
  userId: number,
  languageID: number,
  numWords: number = 20
): Promise<Word[]> {
  // Check if the user exists
  const userCheckQuery = `SELECT 1 FROM users WHERE id = $1`;

  await withDbClient(db, async (client) => {
    const userCheckResult = await client.query(userCheckQuery, [userId]);
    if (userCheckResult.rowCount === 0) {
      throw new Error(`User with ID ${userId} does not exist.`);
    }
  });

  const query = `
    SELECT 
      w.id, 
      w.czech AS src, 
      w.word AS trg, 
      w.pronunciation AS prn,
      w.audio,
      COALESCE(uw.progress,0) AS progress,
      uw.learned_at IS NOT NULL AS learned
    FROM words w
    LEFT JOIN user_words uw ON w.id = uw.word_id AND uw.user_id = $1
    WHERE w.language_id = $2
      AND uw.mastered_at IS NULL
      AND (uw.next_at IS NULL OR uw.next_at < NOW())
    ORDER BY 
      CASE 
        WHEN uw.progress > 0 THEN 1
        ELSE 2
      END ASC,
      w.sequence ASC
    LIMIT $3;
  `;

  return await withDbClient(db, async (client) => {
    const res = await client.query(query, [userId, languageID, numWords]);
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
      learned_at = CASE WHEN EXCLUDED.learned_at IS NOT NULL THEN EXCLUDED.learned_at ELSE user_words.learned_at END, 
      mastered_at = CASE WHEN EXCLUDED.mastered_at IS NOT NULL THEN EXCLUDED.mastered_at ELSE user_words.mastered_at END;
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

function getNextAt(progress: number = 1): string | null {
  const interval = config.SRS[progress - 1] ?? null;
  if (interval) {
    return new Date(Date.now() + interval * 1000).toISOString();
  }
  return null;
}

function getLearnedAt(progress: number = 1): string | null {
  if (progress === config.learnedAt) {
    return new Date(Date.now()).toISOString();
  }
  return null;
}

function getMasteredAt(progress: number = 1): string | null {
  if (progress >= config.SRS.length) {
    return new Date(Date.now()).toISOString();
  }
  return null;
}

/**
 * Inserts or updates the user's word notes in a PostgreSQL database.
 */
export async function insertWordNote(
  db: PostgresClient,
  word: WordNote
): Promise<void> {
  const query = `
    INSERT INTO word_notes (user_id, word_id, note)
    VALUES ($1, $2, $3)
    ON CONFLICT(user_id, word_id) 
    DO UPDATE SET 
      note = EXCLUDED.note;
  `;

  const values = [word.user_id, word.word_id, word.note];

  await withDbClient(db, async (client) => {
    await client.query(query, values);
  });
}
