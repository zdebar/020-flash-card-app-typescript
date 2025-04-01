import { describe, it, expect, beforeAll, afterAll, beforeEach } from "vitest";
import {
  registerUserService,
  loginUserService,
  getUserPreferences,
} from "../user.service";
import { UserError, UserPreferences } from "../../types/dataTypes";
import { postgresDBPool } from "../../config/database.config.postgres";
import { PoolClient } from "pg";

/**
 * registerUserService
 * - registers user in the database DONE
 * - throws UserError if user already exists DONE
 * - logins user and returns token DONE
 * - throws UserError if password is incorrect DONE
 */
/**
 * loginUserService
 * - rethrows Erros from repository layer DONE
 * - compares password and returns token DONE
 * - throws UserError if password is incorrect DONE
 *
 * getUserPreferences
 * - returns user preferences DONE
 * - throws Error if user does not exist DONE
 */
describe("User Registration, Login, and User Preferences", () => {
  const email = "test@example.com";
  const username = "testuser";
  const password = "password123";
  let token: string;

  beforeAll(async () => {
    const client = (await postgresDBPool.connect()) as PoolClient;
    await client.query("DELETE FROM users WHERE email = $1", [email]);
    client.release();
  });

  afterAll(async () => {
    const client = (await postgresDBPool.connect()) as PoolClient;
    await client.query("DELETE FROM users WHERE email = $1", [email]);
    client.release();
  });

  it("should register a new user successfully", async () => {
    await registerUserService(postgresDBPool, username, email, password);

    const client = (await postgresDBPool.connect()) as PoolClient;
    const res = await client.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    client.release();

    expect(res.rows.length).toBe(1);
    expect(res.rows[0]).toEqual({
      id: expect.any(Number),
      username: "testuser",
      email: "test@example.com",
      created_at: expect.any(String),
      password: expect.any(String),
    });
  });

  it("should throw an error when trying to register the same user again", async () => {
    await expect(
      registerUserService(postgresDBPool, username, email, password)
    ).rejects.toThrowError(UserError);
  });

  it("should login the user and return a token", async () => {
    token = await loginUserService(postgresDBPool, email, password);

    expect(token).toBeDefined();
    expect(token).toBeTypeOf("string");
  });

  it("should throw an error when logging in with the wrong password", async () => {
    const wrongPassword = "wrongpassword";

    await expect(
      loginUserService(postgresDBPool, email, wrongPassword)
    ).rejects.toThrowError(UserError);
  });

  it("should throw an error when getting userPreferences with wrong ID", async () => {
    await expect(getUserPreferences(postgresDBPool, 999)).rejects.toThrowError(
      Error
    );
  });

  it("should return userPreferences", async () => {
    await expect(getUserPreferences(postgresDBPool, 1)).resolves.toEqual({
      email: "myUser@example.cz",
      font_size: 2,
      id: 1,
      mode_day: 1,
      notifications: 1,
      username: "myUser",
    });
  });
});
