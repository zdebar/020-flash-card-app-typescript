import { describe, it, expect, vi, beforeEach, afterEach, Mock } from "vitest";
import { findUserByEmailPostgres, findUserByIdPostgres, findUserPreferencesByIdPostgres, findUserByUsernamePostgres, insertUserPostgres } from "./user.repository.postgres";
import { Client} from "pg";
import { PostgresClient, UserError } from "../types/dataTypes";
import postgresDBTest from "../config/database.config.postgres";

describe('findUserByIDPostgres', () => {
  let mockDb: PostgresClient;

  beforeEach(() => {
    mockDb = {
      query: vi.fn()
    };
  });

  it('should return user object if found', async () => {
    const result = await findUserByIdPostgres(postgresDBTest as Client, 1);

    expect(result).toEqual({
      id: 1,
      username: 'test',
      email: 'example@example.cz',
    });
  });

  it('should return null object if user not found', async () => {
    const result = await findUserByIdPostgres(postgresDBTest as Client, 1000);

    expect(result).toBeNull();
  });

  it("should throw an error on database query failure", async () => {
    const error = new Error("Database error");
    (mockDb.query as Mock).mockRejectedValue(error);

    await expect(findUserByIdPostgres(mockDb as Client, 1)).rejects.toThrow("Database error");
  });
});

describe('findUserPreferencesByIDPostgres', () => {
  let mockDb: PostgresClient;

  beforeEach(() => {
    mockDb = {
      query: vi.fn()
    };
  });

  it('should return user object if found', async () => {
    const result = await findUserPreferencesByIdPostgres(postgresDBTest as Client, 1);

    expect(result).toEqual({
      id: 1,
      username: 'test',
      email: 'example@example.cz',
      font_size: null,
      mode_day: null,
      notifications: null,
      user_id: null
    });
  });

  it('should return null object if user not found', async () => {
    const result = await findUserPreferencesByIdPostgres(postgresDBTest as Client, 1000);

    expect(result).toBeNull();
  });

  it("should throw an error on database query failure", async () => {
    const error = new Error("Database error");
    (mockDb.query as Mock).mockRejectedValue(error);

    await expect(findUserPreferencesByIdPostgres(mockDb as Client, 1)).rejects.toThrow("Database error");
  });
});

describe('findUserByUsernamePostgres', () => {
  let mockDb: PostgresClient;

  beforeEach(() => {
    mockDb = {
      query: vi.fn()
    };
  });

  it('should return user object if found', async () => {
    const result = await findUserByUsernamePostgres(postgresDBTest as Client, "test");

    expect(result).toEqual({
      id: 1,
      username: 'test',
      email: 'example@example.cz',
    });
  });

  it('should return null object if user not found', async () => {
    const result = await findUserByUsernamePostgres(postgresDBTest as Client, "non-existent");

    expect(result).toBeNull();
  });

  it("should throw an error on database query failure", async () => {
    const error = new Error("Database error");
    (mockDb.query as Mock).mockRejectedValue(error);

    await expect(findUserByUsernamePostgres(mockDb as Client, "test")).rejects.toThrow("Database error");
  });
});

describe('findUserByEmailPostgres', () => {
  let mockDb: PostgresClient;

  beforeEach(() => {
    mockDb = {
      query: vi.fn()
    };
  });

  it('should return user object if found', async () => {
    const result = await findUserByEmailPostgres(postgresDBTest as Client, 'example@example.cz');

    expect(result).toEqual({
      id: 1,
      username: 'test',
      email: 'example@example.cz',
      created_at: "2025-03-26T15:26:20.420Z",
      password: "something"
    });
  });

  it('should return null object if user not found', async () => {
    const result = await findUserByEmailPostgres(postgresDBTest as Client, 'noexample@example.cz');

    expect(result).toBeNull();
  });

  it("should throw an error on database query failure", async () => {
    const error = new Error("Database error");
    (mockDb.query as Mock).mockRejectedValue(error);

    await expect(findUserByEmailPostgres(mockDb as Client, "test@example.com")).rejects.toThrow("Database error");
  });
});

describe('insertUserPostgres', () => {
  afterEach(async () => {
    await postgresDBTest.query('DELETE FROM users WHERE email = $1', ['test@example.com']);
  });

  it('should insert user into the database', async () => {
    const username = 'testuser';
    const email = 'test@example.com';
    const hashedPassword = 'hashedpassword123';

    await insertUserPostgres(postgresDBTest, username, email, hashedPassword);
    const res = await postgresDBTest.query("SELECT * FROM users WHERE email = $1", [email]);

    expect(res.rows.length).toBe(1);
    expect(res.rows[0]).toEqual({
      id: expect.any(Number),
      username: 'testuser',
      email: 'test@example.com',
      created_at: expect.any(String), 
      password: 'hashedpassword123',
    });
  });

  it('should throw an error when inserting the same user again (unique constraint)', async () => {
    const username = 'testuser';
    const email = 'test@example.com';
    const hashedPassword = 'hashedpassword123';
    await insertUserPostgres(postgresDBTest, username, email, hashedPassword);
    await expect(insertUserPostgres(postgresDBTest, username, email, hashedPassword))
      .rejects
      .toThrowError(UserError);

  });

  it('should throw an error when there is an issue with inserting user', async () => {
    const mockDb: PostgresClient = {
      query: vi.fn().mockRejectedValue(new Error('Database insertion failed')),
    };

    await expect(insertUserPostgres(mockDb, 'testuser', 'test@example.com', 'hashedpassword123'))
      .rejects
      .toThrow('Database insertion failed');
  });
});