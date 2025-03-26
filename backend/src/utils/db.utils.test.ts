import { queryDatabaseSQLite, executeQuerySQLite, queryDatabasePostgres, executeQueryPostgres } from './db.utils';
import { beforeAll, afterAll, describe, expect, it, vi } from 'vitest';
import sqlite3 from 'sqlite3';
import { Client } from 'pg';

describe('Database utility functions', () => {
  let sqliteDb: sqlite3.Database;
  let postgresClient: Client;

  beforeAll(async () => {
    // SQLite in-memory database setup
    sqliteDb = new sqlite3.Database(':memory:');
    await queryDatabaseSQLite(sqliteDb, `CREATE TABLE words (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL
    )`, []);
    await queryDatabaseSQLite(sqliteDb, 'INSERT INTO words (name) VALUES (?)', ['Test Word 1']);
    await queryDatabaseSQLite(sqliteDb, 'INSERT INTO words (name) VALUES (?)', ['Test Word 2']);

    // Mock PostgreSQL client setup using Vitest
    postgresClient = {
      query: vi.fn(),
    } as unknown as Client;
  });

  afterAll(async () => {
    // Clean up SQLite
    await queryDatabaseSQLite(sqliteDb, 'DROP TABLE words', []);
    sqliteDb.close();

    // Close PostgreSQL connection (mocked)
    // No actual closing method for mock client, so this line is optional
    // await postgresClient.end();
  });

  // Tests for queryDatabaseSQLite
  describe('queryDatabaseSQLite', () => {
    it('should execute a real SQL query and return results', async () => {
      const result = await queryDatabaseSQLite(sqliteDb, 'SELECT * FROM words', []);
      expect(result).toHaveLength(2);
      expect(result).toEqual([
        { id: 1, name: 'Test Word 1' },
        { id: 2, name: 'Test Word 2' },
      ]);
    });

    it('should return an empty array when no rows match', async () => {
      const result = await queryDatabaseSQLite(sqliteDb, 'SELECT * FROM words WHERE name = ?', ['Nonexistent Word']);
      expect(result).toEqual([]);
    });

    it('should reject if the SQL query is malformed', async () => {
      await expect(queryDatabaseSQLite(sqliteDb, 'SELECT * FROM non_existing_table', []))
        .rejects
        .toThrow('Error querying database: SQLITE_ERROR: no such table: non_existing_table');
    });
  });

  // Tests for executeQuerySQLite
  describe('executeQuerySQLite', () => {
    it('should resolve when query is successful', async () => {
      const mockDb = {
        run: vi.fn((query, params, callback) => callback(null)),
      } as unknown as sqlite3.Database;

      const query = 'INSERT INTO words (name) VALUES (?)';
      const params = ['Test Word 3'];

      await expect(executeQuerySQLite(mockDb, query, params)).resolves.toBeUndefined();
      expect(mockDb.run).toHaveBeenCalledWith(query, params, expect.any(Function));
    });

    it('should reject when query fails', async () => {
      const mockDb = {
        run: vi.fn((query, params, callback) => callback(new Error('Database error'))),
      } as unknown as sqlite3.Database;

      const query = 'INSERT INTO words (name) VALUES (?)';
      const params = ['Test Word 4'];

      await expect(executeQuerySQLite(mockDb, query, params)).rejects.toThrow('Error executing query: Database error');
    });

    it('should reject on invalid SQL query (syntax error)', async () => {
      const mockDb = {
        run: vi.fn((query, params, callback) => callback(new Error('SQL syntax error'))),
      } as unknown as sqlite3.Database;

      const query = 'INSERT INTO words name VALUES (?)'; // malformed query
      const params = ['Test Word 5'];

      await expect(executeQuerySQLite(mockDb, query, params)).rejects.toThrow('Error executing query: SQL syntax error');
    });
  });

  // Tests for queryDatabasePostgres
  describe('queryDatabasePostgres', () => {
    it('should execute a SELECT query and return results', async () => {
      // Mock successful query response
      postgresClient.query = vi.fn().mockResolvedValueOnce({
        rows: [
          { id: 1, name: 'Test Word 1' },
          { id: 2, name: 'Test Word 2' },
        ],
      });

      const result = await queryDatabasePostgres(postgresClient, 'SELECT * FROM words', []);
      expect(result).toEqual([
        { id: 1, name: 'Test Word 1' },
        { id: 2, name: 'Test Word 2' },
      ]);
    });

    it('should return an empty array when no rows match', async () => {
      postgresClient.query = vi.fn().mockResolvedValueOnce({ rows: [] });

      const result = await queryDatabasePostgres(postgresClient, 'SELECT * FROM words WHERE name = $1', ['Nonexistent Word']);
      expect(result).toEqual([]);
    });

    it('should reject if the PostgreSQL query fails', async () => {
      postgresClient.query = vi.fn().mockRejectedValueOnce(new Error('PostgreSQL query error'));

      await expect(queryDatabasePostgres(postgresClient, 'SELECT * FROM words', []))
        .rejects
        .toThrow('Error querying PostgreSQL database: PostgreSQL query error');
    });

    it('should reject if the SQL query is malformed', async () => {
      postgresClient.query = vi.fn().mockRejectedValueOnce(new Error('syntax error at or near "FROM"'));

      await expect(queryDatabasePostgres(postgresClient, 'SELECT * FORM words', []))
        .rejects
        .toThrow('Error querying PostgreSQL database: syntax error at or near "FROM"');
    });
  });

  // Tests for executeQueryPostgres
  describe('executeQueryPostgres', () => {
    it('should resolve when the query is successful', async () => {
      // Mock successful query execution
      postgresClient.query = vi.fn().mockResolvedValueOnce({});

      await expect(executeQueryPostgres(postgresClient, 'INSERT INTO words (name) VALUES ($1)', ['Test Word 3']))
        .resolves.toBeUndefined();
      expect(postgresClient.query).toHaveBeenCalledWith('INSERT INTO words (name) VALUES ($1)', ['Test Word 3']);
    });

    it('should reject if the query fails', async () => {
      postgresClient.query = vi.fn().mockRejectedValueOnce(new Error('PostgreSQL query error'));

      await expect(executeQueryPostgres(postgresClient, 'INSERT INTO words (name) VALUES ($1)', ['Test Word 4']))
        .rejects
        .toThrow('Error executing PostgreSQL query: PostgreSQL query error');
    });

    it('should reject on invalid SQL query (syntax error)', async () => {
      postgresClient.query = vi.fn().mockRejectedValueOnce(new Error('syntax error at or near "VALUES"'));

      await expect(executeQueryPostgres(postgresClient, 'INSERT INTO words (name) VALU ($1)', ['Test Word 5']))
        .rejects
        .toThrow('Error executing PostgreSQL query: syntax error at or near "VALUES"');
    });
  });
});
