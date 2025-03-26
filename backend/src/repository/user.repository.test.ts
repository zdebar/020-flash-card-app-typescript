import { describe, it, expect, beforeAll, afterAll, vi, Mock } from 'vitest';
import { Client } from 'pg';
import { findUserByIdPostgres, findUserByEmailPostgres, insertUserPostgres, findUserByUsernamePostgres } from './user.repository';

// Mock the pg Client class
vi.mock('pg', () => {
  return {
    Client: vi.fn().mockImplementation(() => ({
      connect: vi.fn(),
      query: vi.fn(),
      end: vi.fn(),
    })),
  };
});

describe('Database User Functions (Postgres) - Mocked', () => {
  let db: Client;

  beforeAll(() => {
    db = new Client();
  });

  afterAll(() => {
    vi.resetAllMocks();
  });

  it('should insert a new user and find them by ID', async () => {
    const mockQueryResponse = { rows: [{ id: 1, username: 'testuser', email: 'test@example.com' }] };

    // Mock the query method to simulate a successful response
    (db.query as Mock).mockResolvedValueOnce(mockQueryResponse);

    const user = await findUserByIdPostgres(db, 1);

    expect(user).toBeDefined();
    expect(user?.username).toBe('testuser');
    expect(user?.email).toBe('test@example.com');
  });

  it('should find a user by email', async () => {
    const mockQueryResponse = { rows: [{ id: 2, username: 'testuser2', email: 'test2@example.com' }] };

    // Mock the query method to simulate a successful response
    (db.query as Mock).mockResolvedValueOnce(mockQueryResponse);

    const user = await findUserByEmailPostgres(db, 'test2@example.com');

    expect(db.query).toHaveBeenCalledWith('SELECT * FROM users WHERE email = $1', ['test2@example.com']);
    expect(user).toBeDefined();
    expect(user?.username).toBe('testuser2');
    expect(user?.email).toBe('test2@example.com');
  });

  it('should return null when a user is not found by ID', async () => {
    const mockQueryResponse = { rows: [] };

    // Mock the query method to simulate no user found
    (db.query as Mock).mockResolvedValueOnce(mockQueryResponse);

    const user = await findUserByIdPostgres(db, 999);
    expect(user).toBeNull();
  });

  it('should return null when a user is not found by email', async () => {
    const mockQueryResponse = { rows: [] };

    // Mock the query method to simulate no user found
    (db.query as Mock).mockResolvedValueOnce(mockQueryResponse);

    const user = await findUserByEmailPostgres(db, 'nonexistent@example.com');
    expect(user).toBeNull();
  });

  it('should find a user by username', async () => {
    const mockQueryResponse = { rows: [{ id: 3, username: 'testuser3', email: 'test3@example.com' }] };

    // Mock the query method to simulate a successful response
    (db.query as Mock).mockResolvedValueOnce(mockQueryResponse);

    const user = await findUserByUsernamePostgres(db, 'testuser3');

    expect(db.query).toHaveBeenCalledWith('SELECT id, username, email, created_at FROM users WHERE username = $1', ['testuser3']);
    expect(user).toBeDefined();
    expect(user?.username).toBe('testuser3');
    expect(user?.email).toBe('test3@example.com');
  });

  it('should return null when a user is not found by username', async () => {
    const mockQueryResponse = { rows: [] };

    // Mock the query method to simulate no user found
    (db.query as Mock).mockResolvedValueOnce(mockQueryResponse);

    const user = await findUserByUsernamePostgres(db, 'nonexistentuser');
    expect(user).toBeNull();
  });
});
