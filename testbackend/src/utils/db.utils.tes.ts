import { queryDatabase } from './db.utils';
import { beforeAll, afterAll, describe, expect, it } from 'vitest';

describe('queryDatabase (integration test with SQLite)', () => {
  beforeAll(async () => {
    await queryDatabase(`
      CREATE TABLE words (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL
      )
    `, []);

    await queryDatabase('INSERT INTO words (name) VALUES (?)', ['Test Word 1']);
    await queryDatabase('INSERT INTO words (name) VALUES (?)', ['Test Word 2']);
  });

  afterAll(async () => {
    await queryDatabase('DROP TABLE words', []);
  });

  it('should execute a real SQL query and return results', async () => {
    const result = await queryDatabase('SELECT * FROM words', []);
    
    expect(result).toHaveLength(2);
    expect(result).toEqual([
      { id: 1, name: 'Test Word 1' },
      { id: 2, name: 'Test Word 2' }
    ]);
  });

  it('should return an empty array when no rows match', async () => {
    const result = await queryDatabase('SELECT * FROM words WHERE name = ?', ['Nonexistent Word']);
    expect(result).toEqual([]);
  });
});

