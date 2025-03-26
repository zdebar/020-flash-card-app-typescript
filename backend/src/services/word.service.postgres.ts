import { Word } from "../types/dataTypes";
import { config } from '../config/config';
import { Client } from "pg";
import { mapNewWordsToWordData } from "../types/dataConversion";
import logger from "../utils/logger.utils";

/**
 * Returns requested number of unused new words with lowest seq values from table words.
 * Unused means that are not present in table user_words. 
 * @param client PostgreSQL client
 * @param userId identifies user
 * @param languageID language of extracted words
 * @param numWords number of new words
 * @returns A promise with Array of WordData
 */
export async function getWordsPostgres(client: Client, userId: number, srcLanguageID: number, trgLanguageID: number, numWords: number): Promise<Word[]> {
  const query = `
    SELECT 
      target.id AS id, 
      source.word AS src, 
      target.word AS trg, 
      target.prn AS prn,
      target.audio AS audio,
      COALESCE(uw.progress, 0) AS progress
    FROM words source
    JOIN word_meanings wm_src ON source.id = wm_src.word_id
    JOIN word_meanings wm_trg ON wm_src.meaning_id = wm_trg.meaning_id
    JOIN words target ON wm_trg.word_id = target.id
    LEFT JOIN user_words uw ON source.id = uw.word_id AND uw.user_id = $1
    WHERE source.language_id = $2 
      AND target.language_id = $3
      AND (
        (uw.word_id IS NOT NULL AND CAST(uw.next_at AS TIMESTAMP) < NOW())  
        OR
        (uw.word_id IS NULL)
      )
      AND uw.learned_at IS NULL
    ORDER BY 
      CASE
        WHEN uw.word_id IS NOT NULL THEN CAST(uw.next_at AS TIMESTAMP)
        ELSE TO_TIMESTAMP(target.seq)
      END ASC
    LIMIT $4;
  `;

  try {
    const result = await client.query(query, [userId, srcLanguageID, trgLanguageID, numWords]);
    const data = result.rows;
    logger.info(`Fetched rows from the database: ${JSON.stringify(data)}`);
    return data;
  } catch (err: any) {
    throw new Error("Failed to get new words: " + err.message);
  }
}

/**
 * Update table user_words with updates progress and next_at.
 * @param client PostgreSQL client
 * @param userId identifies user
 * @param words Array of words
 * @param SRS Array of integer numbers determining repetition algorithm
 * @returns A void Promise
 */
export async function updateWordsPostgres(client: Client, userId: number, words: Word[], SRS: number[]): Promise<void> {
  const today = new Date();

  try {
    const insertStmt = `
      INSERT INTO user_words (user_id, word_id, progress, next_at, created_at)
      VALUES ($1, $2, $3, $4, $5)
      ON CONFLICT(user_id, word_id) 
      DO UPDATE SET progress = excluded.progress, next_at = excluded.next_at;
    `;

    const promises = words.map(async (word) => {
      const progress = word.progress ?? 0;
      const interval = SRS[progress] ?? null;
      const nextAt = interval !== null
        ? new Date(today.getTime() + interval * 86400000).toISOString().split('T')[0]
        : null;

      await client.query(insertStmt, [userId, word.id, progress, nextAt, today.toISOString().split('T')[0]]);
    });

    await Promise.all(promises);
    return;
  } catch (err: any) {
    throw new Error('Error updating user_words: ' + err.message);
  }
}
