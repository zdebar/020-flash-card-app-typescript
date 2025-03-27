import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { Client } from 'pg';
import { getWordsPostgres } from './word.service.postgres';
import logger from '../utils/logger.utils';

// Konfigurace PostgreSQL klienta
const db = new Client({
  host: 'localhost',
  port: 5432,
  user: 'postgres',
  password: 'mbc299748',
  database: 'postgres',
});

describe('getWordsPostgres - PostgreSQL', () => {
  beforeAll(async () => {
    await db.connect();
    logger.info('Connected to test database');
  });

  afterAll(async () => {
    await db.end();
    logger.info('Disconnected from test database');
  });

  it('should retrieve the requested number of new words', async () => {
    const userId = 1;
    const sourceLanguage = 2;
    const targetLanguage = 1;
    const numWords = 5;

    const words = await getWordsPostgres(db, userId, sourceLanguage, targetLanguage, numWords);

    logger.info('Retrieved words:', words);
    expect(words).not.toBeNull();
    expect(Array.isArray(words)).toBe(true);
    expect(words!.length).toBeLessThanOrEqual(numWords);
  });

  it('should return null if no new words are available', async () => {
    const userId = 9999;
    const sourceLanguage = 2;
    const targetLanguage = 1;
    const numWords = 10;

    const words = await getWordsPostgres(db, userId, sourceLanguage, targetLanguage, numWords);

    logger.info('Words retrieved for non-existing user:', words);
    expect(words).toBeNull();
  });
});
