import { describe, it, expect} from 'vitest';
import sqlite3 from 'sqlite3';
import { getNewWords } from './word.service';
import db from '../config/database.config'; // assuming db is already initialized
import logger from '../utils/logger.utils'; // assuming logger is set up

// This test is for extraction testing data

describe('getNewWords', () => {
  let dbInstance: sqlite3.Database;

  it('should retrieve new words that are not in user_words', async () => {
    const userId = 1; 
    const language = 'de';
    const numWords = 20; 

    try {
      const words = await getNewWords(db, userId, language, numWords);

      logger.info('Retrieved words:', words);
      expect(words.length).toBe(numWords);
    } catch (error) {
      logger.error('Error retrieving new words:', error);
    }
  });
});
