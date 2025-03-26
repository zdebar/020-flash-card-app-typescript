import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { Client } from 'pg';
import { getWordsPostgres } from './word.service.postgres'; // Update with the actual function name
import logger from '../utils/logger.utils';

// Setup PostgreSQL client
const db = new Client({
  host: 'localhost',
  port: 5432,
  user: 'your_user',
  password: 'your_password',
  database: 'your_database',
});

describe('getNewWords - PostgreSQL', () => {
  beforeAll(async () => {
    await db.connect();
  });

  afterAll(async () => {
    await db.end();
  });

  it('should retrieve new words that are not in user_words', async () => {
    const userId = 1; 
    const sourceLanguage = 2;
    const targetLanguage = 1;
    const numWords = 20; 

    try {
      const words = await getWordsPostgres(db, userId, sourceLanguage, targetLanguage, numWords);

      logger.info('Retrieved words:', words);
      expect(words.length).toBe(numWords);
    } catch (error) {
      logger.error('Error retrieving new words:', error);
      throw error;
    }
  });
});

