import { Word } from "../types/dataTypes";
import { Client } from "pg";
import logger from "../utils/logger.utils";
import { SRS } from "../config/config";
import { convertSRSToSeconds } from "../utils/config.utils";

/**
 * Returns requested number of words for practiced.
 * Preferably chooses words already in learning. It means words with already corresponding entry in table user_words with date next_at older than now. 
 * If these words is less than numWords. Fills the number with new words with lowest unused seq number.
 *  
 * @param client - PostgreSQL client
 * @param userId - Identifies the user
 * @param srcLanguageID - Source language of extracted words
 * @param trgLanguageID - Target language of extracted words
 * @param numWords - Number of new words to fetch
 * @returns A promise resolving to an array of Word objects, or null if no words found.
 */
export async function getWordsPostgres(client: Client, userId: number, srcLanguageID: number, trgLanguageID: number, numWords: number): Promise<Word[] | null> {
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
    where source.language_id = $2
      and target.language_id = $3
      and uw.learned_at is NULL
      AND EXISTS (SELECT 1 FROM user_words WHERE user_id = $1)
    ORDER BY 
      CASE 
        WHEN progress > 0 THEN 1
        ELSE 2
      END asc,
      progress ASC
    limit $4;
  `;

  try {
    const res = await client.query(query, [userId, srcLanguageID, trgLanguageID, numWords]);
    if (!res?.rows?.length) return null;
    const data = res.rows;
    logger.info(`Fetched rows from the database: ${JSON.stringify(data)}`);
    return data;
  } catch (err: any) {
    logger.error(`Failed to get new words: ${err.message}`);
    throw err;
  }
}

/**
 * Updates the `user_words` table with new progress and next review timestamps.
 * Uses batch processing to improve performance by reducing the number of queries.
 *
 * @param client - The PostgreSQL client instance.
 * @param userId - The ID of the user whose words are being updated.
 * @param words - An array of words to update, each containing an ID and progress level.
 * @param SRS - An array of intervals (in seconds) defining spaced repetition steps.
 * @returns A Promise that resolves when the update is complete.
 * @throws An error if the database update fails.
 */
export async function updateWordsPostgres(
  client: Client,
  userId: number,
  words: Word[]
): Promise<void> {
  const today = new Date();
  const values: unknown[] = [];

  try {
    const query = `
      INSERT INTO user_words (user_id, word_id, progress, next_at, created_at, learned_at)
      VALUES 
      ${words.map((_, index) => `($${index * 6 + 1}, $${index * 6 + 2}, $${index * 6 + 3}, $${index * 6 + 4}, $${index * 6 + 5}, $${index * 6 + 6})`).join(', ')}
      ON CONFLICT(user_id, word_id) 
      DO UPDATE SET progress = EXCLUDED.progress, next_at = EXCLUDED.next_at, learned_at = EXCLUDED.learned_at;
    `;
    
    const numberSRS = convertSRSToSeconds(SRS);

    // Iterate over each word
    words.forEach((word) => {
      const progress = (Number.isInteger(word.progress) && word.progress > 0) ? word.progress : 1;      
      const interval = numberSRS[progress - 1] ?? null;
      
      let nextAt: string | null = null;
      let learnedAt: string | null = null;

      if (interval !== null) {
        nextAt = new Date(today.getTime() + interval * 1000).toISOString();
      } else {
        learnedAt = today.toISOString();
      }
      
      values.push(userId, word.id, progress, nextAt, today.toISOString(), learnedAt);
    });

    await client.query(query, values);
  } catch (err: any) {
    logger.error("Error updating user_words:", err);
    throw err;
  }
}



