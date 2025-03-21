import { describe, it, expect, vi, beforeAll, afterAll } from 'vitest';
import sqlite3 from 'sqlite3';
import { registerUserService, loginUserService } from './auth.service';
import { findUserByEmail, findUserByUsername, insertUser } from '../repository/user.repository';
import { hashPassword, comparePasswords, createToken } from '../utils/auth.utils';
import logger from '../utils/logger.utils';

vi.mock('../repository/user.repository');
vi.mock('../utils/auth.utils');
vi.mock('../utils/logger.utils');

describe('User Authentication Services', () => {
  let db: sqlite3.Database;

  beforeAll(() => {
    // Create an in-memory database
    db = new sqlite3.Database(':memory:');
    
    // Set up the users table
    db.run(
      `CREATE TABLE users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL,
        email TEXT NOT NULL,
        password TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`
    );
  });

  afterAll(() => {
    // Drop the users table and close the database connection
    db.run('DROP TABLE users');
    db.close();
  });

  describe('registerUserService', () => {
    it('should successfully register a user', async () => {
      // Mock the repository methods
      vi.mocked(findUserByEmail).mockResolvedValue(null); // No user with this email
      vi.mocked(findUserByUsername).mockResolvedValue(null); // No user with this username
      vi.mocked(hashPassword).mockResolvedValue('hashedPassword123');
      vi.mocked(insertUser).mockResolvedValue(undefined);
      vi.mocked(logger.info).mockImplementation(() => {});

      await registerUserService(db, 'newuser', 'newuser@example.com', 'password123');

      // Check that the appropriate methods were called
      expect(findUserByEmail).toHaveBeenCalledWith(db, 'newuser@example.com');
      expect(findUserByUsername).toHaveBeenCalledWith(db, 'newuser');
      expect(hashPassword).toHaveBeenCalledWith('password123');
      expect(insertUser).toHaveBeenCalledWith(db, 'newuser', 'newuser@example.com', 'hashedPassword123');
      expect(logger.info).toHaveBeenCalledWith('User registered successfully: newuser');
    });

    it('should throw an error if the email is already taken', async () => {
      // Mock that email is already taken
      vi.mocked(findUserByEmail).mockResolvedValue({ email: 'taken@example.com' });

      await expect(registerUserService(db, 'newuser', 'taken@example.com', 'password123'))
        .rejects
        .toThrowError('Email is already taken.');
    });

    it('should throw an error if the username is already taken', async () => {
      // Mock that username is already taken
      vi.mocked(findUserByUsername).mockResolvedValue({ username: 'takenuser' });

      await expect(registerUserService(db, 'takenuser', 'newuser@example.com', 'password123'))
        .rejects
        .toThrowError('Username is already taken.');
    });

    it('should throw an error if something goes wrong during registration', async () => {
      // Mock an error during password hashing
      vi.mocked(findUserByEmail).mockResolvedValue(null);
      vi.mocked(findUserByUsername).mockResolvedValue(null);
      vi.mocked(hashPassword).mockRejectedValue(new Error('Hashing failed'));

      await expect(registerUserService(db, 'newuser', 'newuser@example.com', 'password123'))
        .rejects
        .toThrowError('Hashing failed');
    });
  });

  describe('loginUserService', () => {
    it('should successfully login a user', async () => {
      // Mock the repository methods
      vi.mocked(findUserByEmail).mockResolvedValue({ id: 1, username: 'newuser', email: 'newuser@example.com', password: 'hashedPassword123' });
      vi.mocked(comparePasswords).mockResolvedValue(true);
      vi.mocked(createToken).mockReturnValue('jwt-token-123');
      vi.mocked(logger.info).mockImplementation(() => {});

      const token = await loginUserService(db, 'newuser@example.com', 'password123');

      // Check the result
      expect(token).toBe('jwt-token-123');
      expect(findUserByEmail).toHaveBeenCalledWith(db, 'newuser@example.com');
      expect(comparePasswords).toHaveBeenCalledWith('password123', 'hashedPassword123');
      expect(createToken).toHaveBeenCalledWith({ id: 1, username: 'newuser', email: 'newuser@example.com', password: 'hashedPassword123' });
    });

    it('should throw an error if the user does not exist', async () => {
      // Mock that the user does not exist
      vi.mocked(findUserByEmail).mockResolvedValue(null);

      await expect(loginUserService(db, 'nonexistent@example.com', 'password123'))
        .rejects
        .toThrowError("User doesn't exist.");
    });

    it('should throw an error if the password is incorrect', async () => {
      // Mock that the user exists but the password is incorrect
      vi.mocked(findUserByEmail).mockResolvedValue({ id: 1, username: 'newuser', email: 'newuser@example.com', password: 'hashedPassword123' });
      vi.mocked(comparePasswords).mockResolvedValue(false);

      await expect(loginUserService(db, 'newuser@example.com', 'wrongpassword'))
        .rejects
        .toThrowError('Invalid password.');
    });

    it('should throw an error if something goes wrong during login', async () => {
      // Mock an error during the login process
      vi.mocked(findUserByEmail).mockResolvedValue(null);

      await expect(loginUserService(db, 'newuser@example.com', 'password123'))
        .rejects
        .toThrowError("User doesn't exist.");
    });
  });
});
