import { describe, it, expect, beforeAll, afterAll, vi } from "vitest";
import {
  getWordsPostgres,
  updateWordsPostgres,
} from "../word.service.postgres";
import db from "../../config/database.config.postgres";
import { Word } from "../../types/dataTypes";

/**
 * getWordsPostgres
 * - Retrieves a list of words from a PostgreSQL database for a specific user
 * - returns and empty array if the user does not exist
 * - get testing database with all edge cases, covering all possible cases
 * - throws and error if database connection fails
 *  */
describe("getWordsPostgres tests", () => {
  const userId = 1;
  const srcLanguageID = 2;
  const trgLanguageID = 1;
  const numWords = 10;

  beforeAll(async () => {
    await db.connect();
  });

  afterAll(async () => {
    await db.end();
  });

  it("should return specific words for a user", async () => {
    const words = await getWordsPostgres(
      db,
      userId,
      srcLanguageID,
      trgLanguageID,
      numWords
    );
    expect(words).toEqual([
      {
        audio: "lieber.mp3",
        id: 143,
        prn: "lˈiːbɜ",
        progress: 3,
        src: "raději",
        trg: "lieber",
      },
      {
        audio: "schon.mp3",
        id: 15,
        prn: "ʃˈoːn",
        progress: 5,
        src: "už, ji",
        trg: "schon",
      },
      {
        audio: "bitte.mp3",
        id: 65,
        prn: "bˈɪtə",
        progress: 7,
        src: "prosím",
        trg: "bitte",
      },
      {
        audio: "arbeiten.mp3",
        id: 1,
        prn: "ˈaɾbaɪtən",
        progress: 10,
        src: "pracovat",
        trg: "arbeiten",
      },
      {
        audio: "ohne.mp3",
        id: 57,
        prn: "ˈoːnə",
        progress: 25,
        src: "bez",
        trg: "ohne",
      },
      {
        audio: "ich_arbeite.mp3",
        id: 2,
        prn: "ɪç ˈaɾbaɪtə",
        progress: 0,
        src: "pracuji",
        trg: "ich arbeite",
      },
      {
        audio: "der_die_das.mp3",
        id: 3,
        prn: "dɛɾ diː dˈas",
        progress: 0,
        src: "ten, ta, to",
        trg: "der, die, das",
      },
      {
        audio: "dir.mp3",
        id: 4,
        prn: "dˈiːɾ",
        progress: 0,
        src: "tobě, ti",
        trg: "dir",
      },
      {
        audio: "du.mp3",
        id: 5,
        prn: "dˈuː",
        progress: 0,
        src: "ty",
        trg: "du",
      },
      {
        audio: "fertig.mp3",
        id: 6,
        prn: "fˈɛɾtɪç",
        progress: 0,
        src: "hotový",
        trg: "fertig",
      },
    ]);
  });

  it("should return empty array for nonexistent user", async () => {
    const words = await getWordsPostgres(
      db,
      999,
      srcLanguageID,
      trgLanguageID,
      numWords
    );
    expect(words).toEqual([]);
  });

  it("should return empty array when numWord 0", async () => {
    const words = await getWordsPostgres(
      db,
      userId,
      srcLanguageID,
      trgLanguageID,
      0
    );
    expect(words).toEqual([]);
  });

  it("should return empty array for nonexistent srcLanguage", async () => {
    const words = await getWordsPostgres(
      db,
      userId,
      999,
      trgLanguageID,
      numWords
    );
    expect(words).toEqual([]);
  });

  it("should return empty array for nonexistent trgLanguage", async () => {
    const words = await getWordsPostgres(
      db,
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
 * - throws an error if the user does not exist
 * - throws an error if database connection fails
 * - throws an error if the word does not exist / or would skip the word
 * - created new user_word if it does not exist in user_words table
 * - updates user_word if it exists in user_words table
 * - updates with progress 1 if progress is less than 1
 * - updates learned_at if progress is equal to learnedAt limit
 * - updates mastered_at if progress is over SRS.length
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
    },
  ];

  beforeAll(async () => {
    await db.connect();
    await db.query("DELETE FROM user_words WHERE word_id = $1", [
      wordIdToUpdate,
    ]);
  });

  afterAll(async () => {
    await db.query("DELETE FROM user_words WHERE word_id = $1", [
      wordIdToUpdate,
    ]);
    await db.query("DELETE FROM user_words WHERE word_id = $1", [89]);
    await db.end();
  });

  it("should throw Error on update for a nonexistent user_id", async () => {
    await expect(
      updateWordsPostgres(db, 999, wordToUpdateValid)
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
      },
    ];
    await expect(
      updateWordsPostgres(db, userId, wordToUpdateInvalid)
    ).rejects.toThrowError(Error);
  });

  it("should create new user_word", async () => {
    await updateWordsPostgres(db, userId, wordToUpdateValid);

    const result = await db.query(
      "SELECT * FROM user_words WHERE user_id = $1 AND word_id = $2",
      [userId, wordIdToUpdate]
    );

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
      },
    ];
    await updateWordsPostgres(db, userId, wordToUpdateNew);

    const result = await db.query(
      "SELECT * FROM user_words WHERE user_id = $1 AND word_id = $2",
      [userId, wordIdToUpdate]
    );

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
      },
    ];
    await updateWordsPostgres(db, userId, wordToUpdateNew);

    const result = await db.query(
      "SELECT * FROM user_words WHERE user_id = $1 AND word_id = $2",
      [userId, wordIdToUpdate]
    );

    expect(result.rows.length).toBe(1);
    expect(result.rows[0].progress).toBe(1);
  });

  it("should throw an error if userId does not exist", async () => {
    await expect(
      updateWordsPostgres(db, 9999, wordToUpdateValid)
    ).rejects.toThrowError(Error);
  });

  it("should throw an error if wordId does not exist", async () => {
    const invalidWord: Word[] = [
      {
        id: 9999, // Nonexistent word ID
        src: "test",
        trg: "test",
        prn: "test",
        audio: "test",
        progress: 5,
      },
    ];

    await expect(
      updateWordsPostgres(db, userId, invalidWord)
    ).rejects.toThrowError(Error);
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
      },
      {
        id: 89,
        src: "test2",
        trg: "test2",
        prn: "test2",
        audio: "test2",
        progress: 4,
      },
    ];

    await updateWordsPostgres(db, userId, wordsToUpdate);

    const result = await db.query(
      "SELECT * FROM user_words WHERE user_id = $1 AND word_id IN ($2, $3)",
      [userId, 88, 89]
    );

    expect(result.rows.length).toBe(2);
    expect(result.rows[0].progress).toBe(3);
    expect(result.rows[1].progress).toBe(4);
  });

  it("should default progress to 1 for invalid progress values", async () => {
    const wordToUpdate: Word[] = [
      {
        id: wordIdToUpdate,
        src: "test",
        trg: "test",
        prn: "test",
        audio: "test",
        progress: -5,
      },
    ];

    await updateWordsPostgres(db, userId, wordToUpdate);

    const result = await db.query(
      "SELECT * FROM user_words WHERE user_id = $1 AND word_id = $2",
      [userId, wordIdToUpdate]
    );

    expect(result.rows.length).toBe(1);
    expect(result.rows[0].progress).toBe(1);
  });

  it("should mark a word as learned if progress is equal learnedAt limit", async () => {
    const wordToUpdate: Word[] = [
      {
        id: wordIdToUpdate,
        src: "test",
        trg: "test",
        prn: "test",
        audio: "test",
        progress: 14,
      },
    ];

    await updateWordsPostgres(db, userId, wordToUpdate);

    const result = await db.query(
      "SELECT * FROM user_words WHERE user_id = $1 AND word_id = $2",
      [userId, wordIdToUpdate]
    );

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
        progress: 25,
      },
    ];

    await updateWordsPostgres(db, userId, wordToUpdate);

    const result = await db.query(
      "SELECT * FROM user_words WHERE user_id = $1 AND word_id = $2",
      [userId, wordIdToUpdate]
    );

    expect(result.rows.length).toBe(1);
    expect(result.rows[0].mastered_at).not.toBeNull();
  });
});
