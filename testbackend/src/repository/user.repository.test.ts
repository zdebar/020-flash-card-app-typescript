import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import sqlite3 from 'sqlite3';
import { findUserById, findUserByEmail, findUserByUsername, insertUser } from './user.repository';

describe('Database User Functions', () => {
  let db: sqlite3.Database;

  beforeAll(async () => {
    db = new sqlite3.Database(':memory:');  

    await new Promise<void>((resolve, reject) => {
      db.run(
        `CREATE TABLE users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          username TEXT NOT NULL,
          email TEXT NOT NULL,
          password TEXT NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`,
        (err) => {
          if (err) reject(err);
          resolve();
        }
      );
    });
  });

  afterAll(async () => {
    await new Promise<void>((resolve, reject) => {
      db.run('DROP TABLE users', (err) => {
        if (err) reject(err);
        resolve();
      });
    });
    db.close();
  });

  it('should insert a new user and find them by ID', async () => {
    await insertUser(db, 'testuser', 'test@example.com', 'hashedPassword123');    
    const user = await findUserById(db, 1);
    
    expect(user).toBeDefined();
    expect(user?.username).toBe('testuser');
    expect(user?.email).toBe('test@example.com');
  });

  it('should find a user by email', async () => {
    await insertUser(db, 'testuser2', 'test2@example.com', 'hashedPassword123');    
    const user = await findUserByEmail(db, 'test2@example.com');
    
    expect(user).toBeDefined();
    expect(user?.username).toBe('testuser2');
    expect(user?.email).toBe('test2@example.com');
  });

  it('should find a user by username', async () => {
    await insertUser(db, 'testuser3', 'test3@example.com', 'hashedPassword123');
    const user = await findUserByUsername(db, 'testuser3');
    
    expect(user).toBeDefined();
    expect(user?.username).toBe('testuser3');
    expect(user?.email).toBe('test3@example.com');
  });

  it('should return null when a user is not found by ID', async () => {
    const user = await findUserById(db, 999); 
    expect(user).toBeNull();
  });

  it('should return null when a user is not found by email', async () => {
    const user = await findUserByEmail(db, 'nonexistent@example.com');
    expect(user).toBeNull();
  });

  it('should return null when a user is not found by username', async () => {
    const user = await findUserByUsername(db, 'nonexistentuser');
    expect(user).toBeNull();
  });
});
