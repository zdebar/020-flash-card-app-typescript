import { queryDatabase, executeQuery } from './db.utils';
import { beforeAll, afterAll, describe, expect, it, vi } from 'vitest';
import sqlite3 from 'sqlite3';

describe('Database utility functions', () => {
  let db: sqlite3.Database;

  beforeAll(async () => {
    db = new sqlite3.Database(':memory:');

    // Create tables and insert initial data
    await queryDatabase(db, `CREATE TABLE words (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL
    )`, []);
    
    await queryDatabase(db, 'INSERT INTO words (name) VALUES (?)', ['Test Word 1']);
    await queryDatabase(db, 'INSERT INTO words (name) VALUES (?)', ['Test Word 2']);
  });

  afterAll(async () => {
    // Clean up by dropping the table
    await queryDatabase(db, 'DROP TABLE words', []);
    db.close();
  });

  // Tests for queryDatabase function
  describe('queryDatabase', () => {
    it('should execute a real SQL query and return results', async () => {
      const result = await queryDatabase(db, 'SELECT * FROM words', []);
      expect(result).toHaveLength(2);
      expect(result).toEqual([
        { id: 1, name: 'Test Word 1' },
        { id: 2, name: 'Test Word 2' },
      ]);
    });

    it('should return an empty array when no rows match', async () => {
      const result = await queryDatabase(db, 'SELECT * FROM words WHERE name = ?', ['Nonexistent Word']);
      expect(result).toEqual([]);
    });
  });

  // Tests for executeQuery function
  describe('executeQuery', () => {
    it('should resolve when query is successful', async () => {
      const mockDb = {
        run: vi.fn((query, params, callback) => callback(null)),
      } as unknown as sqlite3.Database;

      const query = 'INSERT INTO users (name, email) VALUES (?, ?)';
      const params = ['testuser', 'test@example.com'];

      await expect(executeQuery(mockDb, query, params)).resolves.toBeUndefined();
      expect(mockDb.run).toHaveBeenCalledWith(query, params, expect.any(Function));
    });

    it('should reject when query fails', async () => {
      const mockDb = {
        run: vi.fn((query, params, callback) => callback(new Error('Database error'))),
      } as unknown as sqlite3.Database;

      const query = 'INSERT INTO users (name, email) VALUES (?, ?)';
      const params = ['testuser', 'test@example.com'];

      await expect(executeQuery(mockDb, query, params)).rejects.toThrow('Error executing query: Database error');
    });
  });
});
