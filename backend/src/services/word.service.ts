import { Request, Response} from "express";
import { UserLogin, WordData } from "../types/dataTypes";
import { findUserById } from "../repository/user.repository";
import { queryDatabase, executeQuery } from "../repository/user.repository";
import logger from "../utils/logger";
import { config } from '../config/config';
import { mapNewWordsToWordData } from "../utils/dataConversion";

/**
 * Returns requested number of new words from table words. Unused words with lowest seq value. 
 * @param userId: identifies suer
 * @param language: language of extracted words
 * @param numWords: number of new words
 * @returns 
 */
async function getNewWords(userId: number, language: string, numWords: number): Promise<WordData[]> {
  const query = `
    SELECT w.id AS word_id, w.src, w.trg, w.prn, w.language, w.audio, w.seq
    FROM words w
    LEFT JOIN user_words uw ON w.id = uw.word_id AND uw.user_id = ?
    WHERE uw.word_id IS NULL AND w.language = ?
    ORDER BY w.seq ASC
    LIMIT ?;
  `;

  try {
    const rows = await queryDatabase<any>(query, [userId, language, numWords]);
    return mapNewWordsToWordData(rows);
  } catch (error) {
    throw new Error("Failed to get new words: " + error.message);
  }
}

/**
 * Returns already practiced words from table user_words up to maximum number of block size. With value next_at today or older.
 * @param db 
 * @param userId 
 * @param language 
 * @param block 
 * @returns 
 */
async function getWordsAlreadyPracticed(userId: number, language: string, block: number = config.block ): Promise<WordData[]> {
  const query = `
    SELECT w.id AS word_id, w.src, w.trg, w.prn, w.audio, uw.progress
    FROM user_words uw
    INNER JOIN words w ON uw.word_id = w.id
    WHERE uw.user_id = ?
      AND w.language = ?
      AND uw.next_at IS NOT NULL
      AND (uw.next_at <= CURRENT_DATE OR uw.next_at IS NULL)
    ORDER BY uw.next_at ASC
    LIMIT ?;
  `;

  const rows = await queryDatabase<any>(query, [userId, language, block]);
  return mapNewWordsToWordData(rows);
}

/**
 * Gets block amount of words for practice. First select already practiced words from table user_words, if amount less then block value, fills it up with new words from table words.
 * @param db 
 * @param userId 
 * @param language 
 * @param block 
 * @returns 
 */
export function getUserWords(userId: number, language: string, block: number = config.block): Promise<WordData[]> {
  return new Promise(async (resolve, reject) => {
    try {
      let words = await getWordsAlreadyPracticed(userId, language, block);
      if (words.length < block) {
        const remainingWordsCount = block - words.length;
        const newWords = await getNewWords(userId, language, remainingWordsCount);
        words = [...newWords, ...words];
      }
      resolve(words);
    } catch (error) {
      reject('Error fetching words for practice: ' + error);
    }
  });
}

/**
 * Update table user_words with updates progress and next_at.
 * @param db 
 * @param userId 
 * @param words 
 * @param SRS 
 * @returns 
 */
export async function updateUserWords(userId: number, words: WordData[], SRS: number[]): Promise<void> {
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

      await executeQuery(insertStmt, [userId, word.word_id, progress, nextAt, today.toISOString().split('T')[0]]);
    });

    await Promise.all(promises);
    return;
  } catch (err) {
    throw new Error('Error updating user_words: ' + err.message);
  }
}

// why some function are async and some not