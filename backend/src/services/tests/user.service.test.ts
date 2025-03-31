import { describe, it, expect, beforeAll, afterAll, beforeEach } from "vitest";
import {
  registerUserService,
  loginUserService,
  getUserPreferences,
} from "../user.service";
import { UserError, UserPreferences } from "../../types/dataTypes";
import db from "../../config/database.config.postgres";

describe("User Registration, Login, and User Preferences", () => {
  const email = "test@example.com";
  const username = "testuser";
  const password = "password123";
  let token: string;

  beforeAll(async () => {
    await db.connect();
    await db.query("DELETE FROM users WHERE email = $1", [email]);
  });

  afterAll(async () => {
    await db.query("DELETE FROM users WHERE email = $1", [email]);
    await db.end();
  });

  beforeEach(async () => {});

  it("should register a new user successfully", async () => {
    await registerUserService(db, username, email, password);

    const res = await db.query("SELECT * FROM users WHERE email = $1", [email]);
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
      registerUserService(db, username, email, password)
    ).rejects.toThrowError(UserError);
  });

  it("should login the user and return a token", async () => {
    token = await loginUserService(db, email, password);

    expect(token).toBeDefined();
    expect(token).toBeTypeOf("string");
  });

  it("should throw an error when logging in with the wrong password", async () => {
    const wrongPassword = "wrongpassword";

    await expect(
      loginUserService(db, email, wrongPassword)
    ).rejects.toThrowError(UserError);
  });

  it("should throw an error when getting userPreferences with wrong ID", async () => {
    await expect(getUserPreferences(db, 999)).rejects.toThrowError(Error);
  });

  it("should return userPreferences", async () => {
    await expect(getUserPreferences(db, 1)).resolves.toEqual({
      email: "myUser@example.cz",
      font_size: 2,
      id: 1,
      mode_day: 1,
      notifications: 1,
      username: "myUser",
    });
  });
});
