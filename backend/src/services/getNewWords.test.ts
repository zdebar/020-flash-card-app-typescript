import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { getNewWords } from "./word.service";
import db from "../config/database.config"; 
import logger from "../utils/logger.utils";

beforeAll(() => {
});

afterAll(() => {
  db.close();
});

describe("getNewWords", () => {
  it("should return the correct number of new words when there are no user_words entries", async () => {
    const userId = 1000;
    const language = "de";
    const numWords = 5;

    const rows = await getNewWords(userId, language, numWords);
    expect(Array.isArray(rows)).toBe(true);
    expect(rows.length).toBe(numWords);
    logger.info(`Extracted words: ${JSON.stringify(rows)}`);

    if (rows.length > 0) {
      expect(rows[0]).toHaveProperty("word_id");
      expect(rows[0]).toHaveProperty("src");
      expect(rows[0]).toHaveProperty("trg");
      expect(rows[0]).toHaveProperty("prn");
      expect(rows[0]).toHaveProperty("audio");
      expect(rows[0]).toHaveProperty("progress");
    }
  });

  it("should return an empty array if no words are available", async () => {
    const userId = 999;
    const language = "en";
    const numWords = 20;

    const rows = await getNewWords(userId, language, numWords);
    logger.info(`Extracted words: ${JSON.stringify(rows)}`);
    expect(rows).toEqual(null);
  });
});
