import { describe, it, expect, beforeAll, afterAll, vi } from "vitest";
import { getWords, updateWords } from "../vocabulary.repository.postgres";
import { postgresDBPool } from "../../config/database.config.postgres";
import { Word, WordProgress } from "../../types/dataTypes";
import { PoolClient } from "pg";
import config from "../../config/config";

/**
 * getWordsPostgres
 * - retrieves a list of words from testing PostgreSQL database for a specific user DONE
 * - returns and empty array if the user does not exist DONE
 * - returns and empty array if numWords is 0 DONE
 * - returns and empty array if the source language does not exist DONE
 * - returns and empty array if the target language does not exist DONE
 * - throws and error if database connection fails
 *  */
describe("getWordsPostgres tests", () => {
  const userId = 1;
  const languageID = 1;
  const numWords = 10;

  it("should return specific words for a user", async () => {
    const words = await getWords(postgresDBPool, userId, languageID, numWords);
    expect(words).toEqual([
      {
        audio: "word",
        id: 1010,
        learned: false,
        prn: "wˈɜːd",
        progress: 3,
        src: "slovo",
        trg: "word",
      },
      {
        audio: "i",
        id: 1030,
        learned: false,
        prn: "ˈaɪ",
        progress: 1,
        src: "já",
        trg: "I",
      },
      {
        audio: "other",
        id: 1050,
        learned: true,
        prn: "ˈʌðɚ",
        progress: 1,
        src: "ostatní",
        trg: "other",
      },
      {
        audio: "can",
        id: 1052,
        learned: false,
        prn: "kˈæn",
        progress: 5,
        src: "může",
        trg: "can",
      },
      {
        audio: "the",
        id: 1011,
        learned: false,
        prn: "ðˈə",
        progress: 0,
        src: "(určitý člen)",
        trg: "the",
      },
      {
        audio: "of",
        id: 1012,
        learned: false,
        prn: "ˈʌv",
        progress: 0,
        src: "z",
        trg: "of",
      },
      {
        audio: "and",
        id: 1013,
        learned: false,
        prn: "ˈænd",
        progress: 0,
        src: "a",
        trg: "and",
      },
      {
        audio: "to",
        id: 1014,
        learned: false,
        prn: "tˈuː",
        progress: 0,
        src: "na",
        trg: "to",
      },
      {
        audio: "in",
        id: 1015,
        learned: false,
        prn: "ˈɪn",
        progress: 0,
        src: "v",
        trg: "in",
      },
      {
        audio: "is",
        id: 1016,
        learned: false,
        prn: "ˈɪz",
        progress: 0,
        src: "je",
        trg: "is",
      },
    ]);
  });

  it("should throw error for nonexistent user", async () => {
    await expect(
      getWords(postgresDBPool, 999, languageID, numWords)
    ).rejects.toThrowError();
  });

  it("should return empty array when numWord 0", async () => {
    const words = await getWords(postgresDBPool, userId, languageID, 0);
    expect(words).toEqual([]);
  });

  it("should return empty array for nonexistent srcLanguage", async () => {
    const words = await getWords(postgresDBPool, userId, 999, numWords);
    expect(words).toEqual([]);
  });

  it("should return empty array for nonexistent trgLanguage", async () => {
    const words = await getWords(postgresDBPool, userId, 999, numWords);
    expect(words).toEqual([]);
  });
});

/**
 * updateWordsPostgres
 * - throws an error if the user does not exist DONE
 * - throws an error if database connection fails
 * - throws an error if the word does not exist DONE
 * - created new user_word if it does not exist in user_words table DONE
 * - updates user_word if it exists in user_words table DONE
 * - updates with progress 1 if progress is less than 1 DONE
 * - updates multiple words in a single call DONE
 * - updates learned_at if progress is equal to learnedAt DONE
 * - updates mastered_at if progress is over SRS.length DONE
 * - updates next_at correctly
 */
describe("updateWordsPostgres tests", () => {
  const userId = 1;
  const wordIdToUpdate = 1080;

  const wordToUpdateValid: WordProgress[] = [
    {
      id: wordIdToUpdate,
      progress: 5,
    },
  ];

  beforeAll(async () => {
    await postgresDBPool.query(
      "DELETE FROM user_words WHERE word_id IN ($1, $2) AND user_id = $3",
      [1110, 1111, userId]
    );
  });

  afterAll(async () => {
    await postgresDBPool.query(
      "DELETE FROM user_words WHERE word_id IN ($1, $2) AND user_id = $3",
      [1110, 1111, userId]
    );
  });

  it("should throw Error on update for a nonexistent user_id", async () => {
    await expect(
      updateWords(postgresDBPool, 999, wordToUpdateValid)
    ).rejects.toThrowError(Error);
  });

  it("should throw Error on update for a nonexistent word_id", async () => {
    const wordToUpdateInvalid: WordProgress[] = [
      {
        id: 999999,
        progress: 5,
      },
    ];
    await expect(
      updateWords(postgresDBPool, userId, wordToUpdateInvalid)
    ).rejects.toThrowError(Error);
  });

  it("should create new user_word", async () => {
    await updateWords(postgresDBPool, userId, wordToUpdateValid);
    const client = (await postgresDBPool.connect()) as PoolClient;
    const result = await client.query(
      "SELECT * FROM user_words WHERE user_id = $1 AND word_id = $2",
      [userId, wordIdToUpdate]
    );
    client.release();

    expect(result.rows.length).toBe(1);
    expect(result.rows[0].progress).toBe(wordToUpdateValid[0].progress);
  });

  it("should update user_word progress with valid progress range", async () => {
    const wordToUpdateNew: WordProgress[] = [
      {
        id: wordIdToUpdate,
        progress: 8,
      },
    ];
    await updateWords(postgresDBPool, userId, wordToUpdateNew);

    const client = (await postgresDBPool.connect()) as PoolClient;
    const result = await client.query(
      "SELECT * FROM user_words WHERE user_id = $1 AND word_id = $2",
      [userId, wordIdToUpdate]
    );
    client.release();
    expect(result.rows.length).toBe(1);
    expect(result.rows[0].progress).toBe(8);
  });

  it("should update user_word progress with invalid progress range", async () => {
    const wordToUpdateNew: WordProgress[] = [
      {
        id: wordIdToUpdate,
        progress: 0,
      },
    ];
    await updateWords(postgresDBPool, userId, wordToUpdateNew);

    const client = (await postgresDBPool.connect()) as PoolClient;
    const result = await client.query(
      "SELECT * FROM user_words WHERE user_id = $1 AND word_id = $2",
      [userId, wordIdToUpdate]
    );
    client.release();
    expect(result.rows.length).toBe(1);
    expect(result.rows[0].progress).toBe(1);
  });

  it("should update multiple words in a single call", async () => {
    const wordsToUpdate: WordProgress[] = [
      {
        id: 88,
        progress: 3,
      },
      {
        id: 89,
        progress: 4,
      },
    ];

    await updateWords(postgresDBPool, userId, wordsToUpdate);

    const client = (await postgresDBPool.connect()) as PoolClient;
    const result = await client.query(
      "SELECT * FROM user_words WHERE user_id = $1 AND word_id IN ($2, $3)",
      [userId, 88, 89]
    );
    client.release();

    expect(result.rows.length).toBe(2);
    expect(result.rows[0].progress).toBe(3);
    expect(result.rows[1].progress).toBe(4);
  });

  it("should mark a word as learned if progress is equal learnedAt limit", async () => {
    const wordToUpdate: WordProgress[] = [
      {
        id: wordIdToUpdate,
        progress: config.learnedAt,
      },
    ];

    await updateWords(postgresDBPool, userId, wordToUpdate);

    const client = (await postgresDBPool.connect()) as PoolClient;
    const result = await client.query(
      "SELECT * FROM user_words WHERE user_id = $1 AND word_id = $2",
      [userId, wordIdToUpdate]
    );
    client.release();

    expect(result.rows.length).toBe(1);
    expect(result.rows[0].learned_at).not.toBeNull();
    expect(result.rows[0].mastered_at).toBeNull();
  });

  it("should mark a word as mastered if progress is over SRS.length", async () => {
    const wordToUpdate: WordProgress[] = [
      {
        id: wordIdToUpdate,
        progress: 250,
      },
    ];

    await updateWords(postgresDBPool, userId, wordToUpdate);

    const client = (await postgresDBPool.connect()) as PoolClient;
    const result = await client.query(
      "SELECT * FROM user_words WHERE user_id = $1 AND word_id = $2",
      [userId, wordIdToUpdate]
    );
    client.release();

    expect(result.rows.length).toBe(1);
    expect(result.rows[0].mastered_at).not.toBeNull();
  });

  it("should erase date at learned_at a mastered_at", async () => {
    const wordToUpdate: WordProgress[] = [
      {
        id: wordIdToUpdate,
        progress: 15,
      },
    ];

    await updateWords(postgresDBPool, userId, wordToUpdate);

    const client = (await postgresDBPool.connect()) as PoolClient;
    const result = await client.query(
      "SELECT * FROM user_words WHERE user_id = $1 AND word_id = $2",
      [userId, wordIdToUpdate]
    );
    client.release();

    expect(result.rows.length).toBe(1);
    expect(result.rows[0].learned_at).not.toBeNull();
    expect(result.rows[0].mastered_at).not.toBeNull();
  });
});
