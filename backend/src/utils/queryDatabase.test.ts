import { queryDatabase } from './db.utils';
import db from '../config/database.config';
import { vi, expect, Mock } from 'vitest';

vi.mock('../config/database.config', () => ({
  default: {
    all: vi.fn(),
  },
}));

describe('queryDatabase', () => {
  it('should resolve with rows when query is successful', async () => {
    const mockRows = [{ id: 1, name: 'Test Word' }];
    
    // Mocking the behavior of db.all
    (db.all as Mock).mockImplementation((_query, _params, callback) => {
      callback(null, mockRows); 
    });

    const result = await queryDatabase('SELECT * FROM words', []);
    expect(result).toEqual(mockRows);
  });

  it('should reject with an error when there is a database error', async () => {
    const mockError = new Error('Database error');
    
    // Mocking db.all to simulate an error
    (db.all as Mock).mockImplementation((_query, _params, callback) => {
      callback(mockError, null);
    });

    await expect(queryDatabase('SELECT * FROM words', []))
      .rejects
      .toThrow('Error querying database: Database error');
  });

  it('should resolve with an empty array if no rows are found', async () => {
    (db.all as Mock).mockImplementation((_query, _params, callback) => {
      callback(null, []); 
    });

    const result = await queryDatabase('SELECT * FROM words', []);
    expect(result).toEqual([]);
  });
});
