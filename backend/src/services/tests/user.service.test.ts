import { describe, it, expect, beforeAll, afterAll, vi } from "vitest";
import { registerUserService, loginUserService } from "../user.service";
import { UserError } from "../../types/dataTypes";
import db from "../../config/database.config.postgres";

describe('User Registration, Login, and Deletion Flow', () => {
  const email = 'test@example.com';
  const username = 'testuser';
  const password = 'password123';
  let token: string;

  beforeAll(async () => {
    await db.connect();
    await db.query('DELETE FROM users WHERE email = $1', [email]);
  });

  afterAll(async () => {
    await db.query('DELETE FROM users WHERE email = $1', [email]);
    await db.end();
  });

  it('should register a new user successfully', async () => {
    await registerUserService(db, username, email, password);

    const res = await db.query("SELECT * FROM users WHERE email = $1", [email]);
    expect(res.rows.length).toBe(1);
    expect(res.rows[0]).toEqual({
      id: expect.any(Number),
      username: 'testuser',
      email: 'test@example.com',
      created_at: expect.any(String),
      password: expect.any(String),
    });
  });

  it('should throw an error when trying to register the same user again', async () => {
    await registerUserService(db, username, email, password);
    await expect(registerUserService(db, username, email, password))
      .rejects
      .toThrowError(UserError);
  });

  it('should login the user and return a token', async () => {
    token = await loginUserService(db, email, password);
    
    expect(token).toBeDefined();
    expect(token).toBeTypeOf('string');
  });

  it('should throw an error when logging in with the wrong password', async () => {
    const wrongPassword = 'wrongpassword';

    await expect(loginUserService(db, email, wrongPassword))
      .rejects
      .toThrowError(UserError);
  });
});

