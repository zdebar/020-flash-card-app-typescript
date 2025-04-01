import { describe, it, expect, beforeAll, afterAll, vi } from "vitest";
import {
  getWordsPostgres,
  updateWordsPostgres,
} from "../word.service.postgres";
import { postgresDBPool } from "../../config/database.config.postgres";
import { Word } from "../../types/dataTypes";
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
  const srcLanguageID = 2;
  const trgLanguageID = 1;
  const numWords = 10;

  it("should return specific words for a user", async () => {
    const words = await getWordsPostgres(
      postgresDBPool,
      userId,
      srcLanguageID,
      trgLanguageID,
      numWords
    );
    expect(words).toEqual([
      {
        audio: "schon.mp3",
        id: 15,
        learned_at: null,
        prn: "ʃˈoːn",
        progress: 5,
        src: "už, ji",
        trg: "schon",
      },
      {
        audio: "arbeiten.mp3",
        id: 1,
        learned_at: null,
        prn: "ˈaɾbaɪtən",
        progress: 10,
        src: "pracovat",
        trg: "arbeiten",
      },
      {
        audio: "ohne.mp3",
        id: 57,
        learned_at: null,
        prn: "ˈoːnə",
        progress: 25,
        src: "bez",
        trg: "ohne",
      },
      {
        audio: "bitte.mp3",
        id: 65,
        learned_at: "2025-03-27T08:08:57.557Z",
        prn: "bˈɪtə",
        progress: 7,
        src: "prosím",
        trg: "bitte",
      },
      {
        audio: "lieber.mp3",
        id: 143,
        learned_at: null,
        prn: "lˈiːbɜ",
        progress: 3,
        src: "raději",
        trg: "lieber",
      },
      {
        audio: "ich_arbeite.mp3",
        id: 2,
        learned_at: null,
        prn: "ɪç ˈaɾbaɪtə",
        progress: 0,
        src: "pracuji",
        trg: "ich arbeite",
      },
      {
        audio: "der_die_das.mp3",
        id: 3,
        learned_at: null,
        prn: "dɛɾ diː dˈas",
        progress: 0,
        src: "ten, ta, to",
        trg: "der, die, das",
      },
      {
        audio: "dir.mp3",
        id: 4,
        learned_at: null,
        prn: "dˈiːɾ",
        progress: 0,
        src: "tobě, ti",
        trg: "dir",
      },
      {
        audio: "du.mp3",
        id: 5,
        learned_at: null,
        prn: "dˈuː",
        progress: 0,
        src: "ty",
        trg: "du",
      },
      {
        audio: "fertig.mp3",
        id: 6,
        learned_at: null,
        prn: "fˈɛɾtɪç",
        progress: 0,
        src: "hotový",
        trg: "fertig",
      },
    ]);
  });

  it("should return empty array for nonexistent user", async () => {
    const words = await getWordsPostgres(
      postgresDBPool,
      999,
      srcLanguageID,
      trgLanguageID,
      numWords
    );
    expect(words).toEqual([]);
  });

  it("should return empty array when numWord 0", async () => {
    const words = await getWordsPostgres(
      postgresDBPool,
      userId,
      srcLanguageID,
      trgLanguageID,
      0
    );
    expect(words).toEqual([]);
  });

  it("should return empty array for nonexistent srcLanguage", async () => {
    const words = await getWordsPostgres(
      postgresDBPool,
      userId,
      999,
      trgLanguageID,
      numWords
    );
    expect(words).toEqual([]);
  });

  it("should return empty array for nonexistent trgLanguage", async () => {
    const words = await getWordsPostgres(
      postgresDBPool,
      userId,
      srcLanguageID,
      999,
      numWords
    );
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
  const wordIdToUpdate = 88;

  const wordToUpdateValid: Word[] = [
    {
      id: wordIdToUpdate,
      src: "test",
      trg: "test",
      prn: "test",
      audio: "test",
      progress: 5,
      learned_at: null,
    },
  ];

  beforeAll(async () => {
    await postgresDBPool.query(
      "DELETE FROM user_words WHERE word_id IN ($1, $2) AND user_id = $3",
      [88, 89, userId]
    );
  });

  afterAll(async () => {
    await postgresDBPool.query(
      "DELETE FROM user_words WHERE word_id IN ($1, $2) AND user_id = $3",
      [88, 89, userId]
    );
  });

  it("should throw Error on update for a nonexistent user_id", async () => {
    await expect(
      updateWordsPostgres(postgresDBPool, 999, wordToUpdateValid)
    ).rejects.toThrowError(Error);
  });

  it("should throw Error on update for a nonexistent word_id", async () => {
    const wordToUpdateInvalid: Word[] = [
      {
        id: 999999,
        src: "test",
        trg: "test",
        prn: "test",
        audio: "test",
        progress: 5,
        learned_at: null,
      },
    ];
    await expect(
      updateWordsPostgres(postgresDBPool, userId, wordToUpdateInvalid)
    ).rejects.toThrowError(Error);
  });

  it("should create new user_word", async () => {
    await updateWordsPostgres(postgresDBPool, userId, wordToUpdateValid);
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
    const wordToUpdateNew: Word[] = [
      {
        id: wordIdToUpdate,
        src: "test",
        trg: "test",
        prn: "test",
        audio: "test",
        progress: 8,
        learned_at: null,
      },
    ];
    await updateWordsPostgres(postgresDBPool, userId, wordToUpdateNew);

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
    const wordToUpdateNew: Word[] = [
      {
        id: wordIdToUpdate,
        src: "test",
        trg: "test",
        prn: "test",
        audio: "test",
        progress: 0,
        learned_at: null,
      },
    ];
    await updateWordsPostgres(postgresDBPool, userId, wordToUpdateNew);

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
    const wordsToUpdate: Word[] = [
      {
        id: 88,
        src: "test1",
        trg: "test1",
        prn: "test1",
        audio: "test1",
        progress: 3,
        learned_at: null,
      },
      {
        id: 89,
        src: "test2",
        trg: "test2",
        prn: "test2",
        audio: "test2",
        progress: 4,
        learned_at: null,
      },
    ];

    await updateWordsPostgres(postgresDBPool, userId, wordsToUpdate);

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
    const wordToUpdate: Word[] = [
      {
        id: wordIdToUpdate,
        src: "test",
        trg: "test",
        prn: "test",
        audio: "test",
        progress: config.learnedAt,
        learned_at: null,
      },
    ];

    await updateWordsPostgres(postgresDBPool, userId, wordToUpdate);

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
    const wordToUpdate: Word[] = [
      {
        id: wordIdToUpdate,
        src: "test",
        trg: "test",
        prn: "test",
        audio: "test",
        progress: 250,
        learned_at: null,
      },
    ];

    await updateWordsPostgres(postgresDBPool, userId, wordToUpdate);

    const client = (await postgresDBPool.connect()) as PoolClient;
    const result = await client.query(
      "SELECT * FROM user_words WHERE user_id = $1 AND word_id = $2",
      [userId, wordIdToUpdate]
    );
    client.release();

    expect(result.rows.length).toBe(1);
    expect(result.rows[0].mastered_at).not.toBeNull();
  });
});
