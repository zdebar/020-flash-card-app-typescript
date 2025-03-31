import { Word, PostgresClient, UserError } from "../types/dataTypes";
import config from "../config/config";

/**
 * Retrieves a list of words from a PostgreSQL database for a specific user,
 * based on the source and target languages, and filters out words that have
 * already been marked as learned by the user.
 *
 * @param db - The PostgreSQL client instance used to execute the query.
 * @param userId - The ID of the user requesting the words.
 * @param srcLanguageID - The ID of the source language.
 * @param trgLanguageID - The ID of the target language.
 * @param numWords - The maximum number of words to retrieve (default is 20).
 * @returns A promise that resolves to an array of words, each containing the
 *          target word's ID, source word, target word, pronunciation, audio,
 *          and progress.
 */
export async function getWordsPostgres(
  db: PostgresClient,
  userId: number,
  srcLanguageID: number,
  trgLanguageID: number,
  numWords: number = 20
): Promise<Word[]> {
  const query = `
    SELECT 
      target.id AS id, 
      source.word AS src, 
      target.word AS trg, 
      target.prn AS prn,
      target.audio AS audio,
      COALESCE(uw.progress,0) AS progress
    FROM words source
    JOIN word_meanings wm_src ON source.id = wm_src.word_id
    JOIN word_meanings wm_trg ON wm_src.meaning_id = wm_trg.meaning_id
    JOIN words target ON wm_trg.word_id = target.id
    LEFT JOIN user_words uw ON target.id = uw.word_id AND uw.user_id = $1
    WHERE source.language_id = $2
      AND target.language_id = $3
      AND uw.mastered_at IS NULL
      AND EXISTS (SELECT 1 FROM user_words WHERE user_id = $1)
    ORDER BY 
      CASE 
        WHEN progress > 0 THEN 1
        ELSE 2
      END ASC,
      progress ASC,
      target.seq ASC
    LIMIT $4;
  `;

  const res = await db.query(query, [
    userId,
    srcLanguageID,
    trgLanguageID,
    numWords,
  ]);

  return res.rows;
}

/**
 * Updates the user's word progress in a PostgreSQL database.
 *
 * This function inserts or updates records in the `user_words` table for the given user and words.
 * If a record for a specific `user_id` and `word_id` already exists, it updates the `progress`,
 * `next_at`, `learned_at`, and `mastered_at` fields. Otherwise, it inserts a new record.
 *
 * @param db - The PostgreSQL client instance used to execute the query.
 * @param userId - The ID of the user whose word progress is being updated.
 * @param words - An array of words containing their IDs and progress information.
 *
 * @returns A promise that resolves when the operation is complete.
 *
 * @throws Will throw an error if the database query fails.
 */
export async function updateWordsPostgres(
  db: PostgresClient,
  userId: number,
  words: Word[]
): Promise<void> {
  const today = new Date();
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
    DO UPDATE SET progress = EXCLUDED.progress, next_at = EXCLUDED.next_at, learned_at = EXCLUDED.learned_at, mastered_at = EXCLUDED.mastered_at;
  `;

  words.forEach((word) => {
    const progress =
      Number.isInteger(word.progress) && word.progress > 0 ? word.progress : 1;
    const interval = config.SRS[progress - 1] ?? null;

    let nextAt: string | null = null;
    let learnedAt: string | null = null;
    let masteredAt: string | null = null;

    if (interval !== null) {
      nextAt = new Date(today.getTime() + interval * 1000).toISOString();
      if (progress === config.learnedAt) {
        learnedAt = today.toISOString();
      }
    } else {
      masteredAt = today.toISOString();
    }

    values.push(userId, word.id, progress, nextAt, learnedAt, masteredAt);
  });

  await db.query(query, values);
}
