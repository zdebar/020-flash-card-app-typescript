import db from "../config/database";
import { Request, Response, RequestHandler } from "express";
import { UserLogin, WordData } from "../types/dataTypes";
import logger from "../utils/logger";
import sqlite3 from "sqlite3";
import { config } from '../config/config';

export const getUserProfile: RequestHandler = (req: Request, res: Response) => {
  db.get<UserLogin>(
    "SELECT id, username, email FROM users WHERE id = ?",
    [(req as any).user.id],
    (err, user) => {
      if (err) {
        logger.error("Database error during authentication:", err);
        return res.status(500).json({ error: "Internal server error" });
      }

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      res.json(user);
    }
  );
};

/**
 * Returns requested number of new words from table words. Unused words with lowest seq value. 
 * @param db 
 * @param userId 
 * @param language 
 * @param numWords 
 * @returns 
 */
export function getNewWords(db: sqlite3.Database, userId: number, language: string, numWords: number): Promise<WordData[]> {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT w.id AS word_id, w.src, w.trg, w.prn, w.language, w.audio, w.seq
      FROM words w
      LEFT JOIN user_words uw ON w.id = uw.word_id AND uw.user_id = ?
      WHERE uw.word_id IS NULL AND w.language = ?
      ORDER BY w.seq ASC
      LIMIT ?;
    `;

    db.all(query, [userId, language, numWords], (err, rows) => {
      if (err) {
        reject("Error querying database: " + err.message);
      } else {
        // Mapování výsledků do formátu WordData
        const words: WordData[] = rows.map((row: WordData) => ({
          word_id: row.word_id,
          src: row.src,
          trg: row.trg,
          prn: row.prn,
          audio: row.audio,
          progress: 0, 
        }));
        resolve(words);
      }
    });
  });
}

/**
 * Returns already practiced words from table user_words up to maximum number of block size. With value next_at today or older.
 * @param db 
 * @param userId 
 * @param language 
 * @param block 
 * @returns 
 */
export function getWordsAlreadyPracticed( db: sqlite3.Database, userId: number, language: string, block: number = config.block): Promise<WordData[]> {
  return new Promise((resolve, reject) => {
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

    db.all(query, [userId, language, block], (err, rows: any[]) => {
      if (err) {
        reject('Error executing query: ' + err.message);
      } else {
        const words: WordData[] = rows.map(row => ({
          word_id: row.word_id,
          src: row.src,
          trg: row.trg,
          prn: row.prn || null,
          audio: row.audio || null,
          progress: row.progress || 0,
        }));
        resolve(words);
      }
    });
  });
}

/**
 * Gets block amount of words for practice. First select already practiced words from table user_words, if amount less then block value, fills it up with new words from table words.
 * @param db 
 * @param userId 
 * @param language 
 * @param block 
 * @returns 
 */
export function getWordsForPractice( db: sqlite3.Database, userId: number, language: string, block: number = config.block): Promise<WordData[]> {
  return new Promise(async (resolve, reject) => {
    try {
      let words = await getWordsAlreadyPracticed(db, userId, language, block);
      if (words.length < block) {
        const remainingWordsCount = block - words.length;
        const newWords = await getNewWords(db, userId, language, remainingWordsCount);
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
export function updateUserWords( db: sqlite3.Database, userId: number, words: WordData[], SRS: number[] ): Promise<void> {
  return new Promise((resolve, reject) => {
    const today = new Date();

    db.serialize(() => {
      const insertStmt = db.prepare(`
        INSERT INTO user_words (user_id, word_id, progress, next_at, created_at)
        VALUES (?, ?, ?, ?, ?)
        ON CONFLICT(user_id, word_id) 
        DO UPDATE SET progress = excluded.progress, next_at = excluded.next_at;
      `);

      for (const word of words) {
        const progress = word.progress ?? 0; 
        const interval = SRS[progress] ?? null;
        const nextAt = interval !== null
          ? new Date(today.getTime() + interval * 86400000).toISOString().split('T')[0] // Shift "interval" days
          : null;

        insertStmt.run(userId, word.word_id, progress, nextAt, today.toISOString().split('T')[0], (err: Error) => {
          if (err) {
            reject('Error updating user_words: ' + err.message);
          }
        });
      }

      insertStmt.finalize((err: Error) => {
        if (err) {
          reject('Error finalizing statement: ' + err.message);
        } else {
          resolve();
        }
      });
    });
  });
}

