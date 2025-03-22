import { WordData } from "../types/dataTypes";
import { config } from '../config/config';
import { queryDatabase, executeQuery } from "../utils/db.utils";
import { mapNewWordsToWordData } from "../types/dataConversion";
import sqlite3 from "sqlite3";
import logger from "../utils/logger.utils";


/**
 * Returns requested number of unused new words with lowest seq values from table words.
 * Unused means that are not present in table user_words. 
 * @param db word database
 * @param userId identifies user
 * @param language language of extracted words
 * @param numWords number of new words
 * @returns A promise with Array of WordData
 */
export async function getNewWords(db: sqlite3.Database, userId: number, language: string, numWords: number): Promise<WordData[]> {
  const query = `
    SELECT w.id AS word_id, w.src, w.trg, w.prn, w.language, w.audio
    FROM words w
    LEFT JOIN user_words uw ON w.id = uw.word_id AND uw.user_id = ?
    WHERE uw.word_id IS NULL AND w.language = ?
    ORDER BY w.seq ASC
    LIMIT ?;
  `;

  try {
    logger.info(`Running query to fetch words for userId: ${userId}, language: ${language}, numWords: ${numWords}`);
    const rows = await queryDatabase<any>(db, query, [userId, language, numWords]);
    const data = mapNewWordsToWordData(rows)
    logger.info(`Fetched rows from the database: ${JSON.stringify(data)}`);
    return data;
  } catch (err: any) {
    throw new Error("Failed to get new words: " + err.message);
  }
}

/**
 * Returns already practiced words with current day or older from table user_words up to maximum number of block size.
 * @param db word database
 * @param userId searched user ID
 * @param language required words language
 * @param block maximum block size
 * @returns A Promise with array of WordData 
 */
export async function getWordsAlreadyPracticed(db: sqlite3.Database, userId: number, language: string, block: number = config.block ): Promise<WordData[]> {
  const query = `
    SELECT w.id AS word_id, w.src, w.trg, w.prn, w.audio, uw.progress
    FROM user_words uw
    INNER JOIN words w ON uw.word_id = w.id
    WHERE uw.user_id = ?
      AND w.language = ?
      AND uw.next_at IS NOT NULL
      AND uw.next_at <= CURRENT_DATE
    ORDER BY uw.next_at ASC, uw.progress ASC
    LIMIT ?;
  `;

  const rows = await queryDatabase<any>(db, query, [userId, language, block]);
  return mapNewWordsToWordData(rows);
}

/**
 * Gets words for practice up to number block value. First select already practiced words from table user_words, if amount less then block value, fills it up with new words from table words.
 * @param db word database
 * @param userId identifies user
 * @param language language of extracted words
 * @param block number of new words
 * @returns A promise with Array of WordData if at least one word found, returns null if no words found. 
 */
export async function getUserWords(db: sqlite3.Database, userId: number, language: string, block: number = config.block): Promise<WordData[]> {
  try {
    let rows = await getWordsAlreadyPracticed(db, userId, language, block);
    if (rows.length < block) {
      const remainingWordsCount = block - rows.length;
      const newWords = await getNewWords(db, userId, language, remainingWordsCount);
      rows = [...newWords, ...rows];
    }
    return rows;
  } catch (err: any) {
    throw new Error('Error fetching words for practice: ' + err);
  }
}

/**
 * Update table user_words with updates progress and next_at.
 * @param db word database
 * @param userId identifies user
 * @param words Array of words
 * @param SRS Array of integer numbers determining repetition algorithm
 * @returns A void Promise
 */
export async function updateUserWords(db: sqlite3.Database, userId: number, words: WordData[], SRS: number[]): Promise<void> {
  const today = new Date();

  try {
    const insertStmt = `
      INSERT INTO user_words (user_id, word_id, progress, next_at, created_at)
      VALUES (?, ?, ?, ?, ?)
      ON CONFLICT(user_id, word_id) 
      DO UPDATE SET progress = excluded.progress, next_at = excluded.next_at;
    `;

    const promises = words.map(async (word) => {
      const progress = word.progress ?? 0;
      const interval = SRS[progress] ?? null;
      const nextAt = interval !== null
        ? new Date(today.getTime() + interval * 86400000).toISOString().split('T')[0]
        : null;

      await executeQuery(db, insertStmt, [userId, word.word_id, progress, nextAt, today.toISOString().split('T')[0]]);
    });

    await Promise.all(promises);
    return;
  } catch (err: any) {
    throw new Error('Error updating user_words: ' + err.message);
  }
}
