import { db } from "../config/config";

export interface WordData {
  word_id: number;
  src: string | null;
  trg: string | null;
  prn: string | null;
  progress: number;
  next_at: Date | null;
}

export function countUserWords (userID: number, progressMin: number, progressMax: number, language: string): Promise<number> {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT COUNT(*) as count
      FROM user_words 
      JOIN words ON user_words.word_id = words.id
      WHERE user_words.user_id = ?
        AND user_words.progress BETWEEN ? AND ?
        AND words.language = ?
    `;

    db.get(query, [userID, progressMin, progressMax, language ], (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve((row as { count: number })?.count || 0)
      }
    })
  });
}

/**
 * Returns words with lowest IDs, that are not in user_words.
 */

export function getNewWords (userID: number, numberOfNewWords: number, language: string): Promise<WordData[]> {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT words.id AS word_id, words.src, words.trg, words.prn
      FROM words
      LEFT JOIN user_words ON words.id = user_words.word_id AND user_words.user_id = ?
      WHERE user_words.word_id IS NULL
        AND words.language = ?
      ORDER BY words.id DESC
      LIMIT ?
    `;

    const progress: number = 0;
    const next_at: Date | null = null;

    db.all(query, [userID, numberOfNewWords, language], (err, rows) => {
      if (err) {
        reject(err)
      } else {
        const wordsWithProgress = rows.map((row: any) => ({
          ...row,
          progress,
          next_at
        })) as WordData[];

        resolve(wordsWithProgress)
      }
    })
  });
}

/**
 * Returns words with next_at = older than now || null
 */

export function getUserWords (userID: number, progressMin: number, progressMax:number, language: string): Promise<WordData[]> {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT words.id, words.src, words.trg, words.prn, user_words.progress, user_words.next_at
      FROM user_words
      JOIN words ON user_words.word_id = words.id
      WHERE user_words.user_id = ?
        AND user_words.progress BETWEEN ? AND ?
        AND words.language = ?
        AND (user_words.next_at IS NULL OR user_words.next_at <= datetime('now'))
    `;

    db.all(query, [userID, progressMin, progressMax, language], (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows as WordData[]);
      }
    })
  });
}

/**
 * By default progress = 0, next_at = null; Update table user_words
 */

export function addUserWords (userID: number, wordsData: WordData[], progress: number = 0, next_at: Date | null = null): Promise<void> {
  return new Promise((resolve, reject) => {
    const insertQuery = `
      INSERT INTO user_words (user_id, word_id, progress, next_at)
      VALUES (?, ?, ?, ?)
    `;

    const promises = wordsData.map((word) => {
      return new Promise((reject) => {
        db.run(insertQuery, [userID, word.word_id, progress, next_at], function(err) {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        });
      });
    });

    Promise.all(promises)
      .then(() => resolve())
      .catch((err) => reject(err));
  });
}

/**
 * By default progress = 0, next_at = null; Update table user_words
 */

export function updateProgress (userID: number, wordsData: WordData[]): Promise<void> {
  return new Promise((resolve, reject) => {
    const updateQuery = `
      UPDATE user_words
      SET progress = ?, next_at = ?
      WHERE user_id = ? AND word_id = ?
    `;

    const promises = wordsData.map((word) => {
      return new Promise<void>((resolve, reject) => {
        db.run(updateQuery, [word.progress, word.next_at, userID, word.word_id], function(err) {
          if (err) {
            reject(err); 
          } else {
            resolve();
          }
        });
      });
    });

    Promise.all(promises)
      .then(() => resolve())
      .catch((err) => reject(err));
  });
}