import {
  describe,
  it,
  expect,
  vi,
  afterEach,
  Mock,
  afterAll,
  beforeAll,
} from "vitest";
import {
  findUserByEmailPostgres,
  findUserByIdPostgres,
  findUserPreferencesByIdPostgres,
  findUserByUsernamePostgres,
  insertUserPostgres,
} from "../user.repository.postgres";
import { Client } from "pg";
import { PostgresClient, UserError } from "../../types/dataTypes";
import db from "../../config/database.config.postgres";

/**
 * findUserByIdPostgres
 * - return user object if found
 * - throw error object if user not found
 * - throw error if database query fails
 * - prevent SQL injection attacks
 */
describe("findUserByIDPostgres", () => {
  let mockDb: PostgresClient;

  beforeAll(async () => {
    await db.connect();
    mockDb = { query: vi.fn() };
  });

  afterAll(async () => {
    await db.end();
  });

  it("should throw an error for invalid userId (negative or zero)", async () => {
    await expect(findUserByIdPostgres(db as Client, -1)).rejects.toThrow(Error);
    await expect(findUserByIdPostgres(db as Client, 0)).rejects.toThrow(Error);
  });

  it("should throw an error for non-numeric userId", async () => {
    await expect(
      findUserByIdPostgres(db as Client, "invalid" as unknown as number)
    ).rejects.toThrow(Error);
  });

  it("should return user object if found", async () => {
    const result = await findUserByIdPostgres(db as Client, 1);

    expect(result).toEqual({
      id: 1,
      username: "myUser",
      email: "myUser@example.cz",
    });
  });

  it("should throw error object if user not found", async () => {
    await expect(findUserByIdPostgres(db as Client, 1000)).rejects.toThrow(
      Error
    );
  });

  it("should throw an error on database query failure", async () => {
    const error = new Error("Database error");
    (mockDb.query as Mock).mockRejectedValue(error);

    await expect(findUserByIdPostgres(mockDb as Client, 1)).rejects.toThrow(
      "Database error"
    );
  });

  it("should prevent SQL injection attacks", async () => {
    const maliciousInput = "'test' OR 'a' = 'a'";
    await expect(
      findUserByUsernamePostgres(db as Client, maliciousInput)
    ).rejects.toThrow();
  });
});

/**
 * findUserPreferencesByIdPostgres
 * - return user object if found
 * - throw error object if user not found
 * - throw error if database query fails
 * - prevent SQL injection attacks
 */
describe("findUserPreferencesByIDPostgres", () => {
  let mockDb: PostgresClient;

  beforeAll(async () => {
    await db.connect();
    mockDb = { query: vi.fn() };
  });

  afterAll(async () => {
    await db.end();
    process.env.NODE_ENV = "development";
  });

  it("should return user object if found", async () => {
    const result = await findUserPreferencesByIdPostgres(db as Client, 1);

    expect(result).toEqual({
      id: 1,
      username: "myUser",
      email: "myUser@example.cz",
      font_size: 2,
      mode_day: 1,
      notifications: 1,
    });

    console.log(result);
  });

  it("should throw error object if user not found", async () => {
    await expect(
      findUserPreferencesByIdPostgres(db as Client, 1000)
    ).rejects.toThrow(Error);
  });

  it("should throw an error on database query failure", async () => {
    const error = new Error("Database error");
    (mockDb.query as Mock).mockRejectedValue(error);

    await expect(
      findUserPreferencesByIdPostgres(mockDb as Client, 1)
    ).rejects.toThrow("Database error");
  });
});

/**
 * findUserByUsernamePostgres
 * - return user object if found
 * - throw error object if user not found
 * - throw error if database query fails
 * - prevent SQL injection attacks
 */
describe("findUserByUsernamePostgres", () => {
  let mockDb: PostgresClient;

  beforeAll(async () => {
    await db.connect();
    mockDb = { query: vi.fn() };
  });

  afterAll(async () => {
    await db.end();
    process.env.NODE_ENV = "development";
  });

  it("should prevent SQL injection in username", async () => {
    const maliciousInput = "'; DROP TABLE users; --";
    await expect(
      findUserByUsernamePostgres(db as Client, maliciousInput)
    ).rejects.toThrow();
  });

  it("should prevent SQL injection in email", async () => {
    const maliciousInput = "'; DROP TABLE users; --";
    await expect(
      findUserByEmailPostgres(db as Client, maliciousInput)
    ).rejects.toThrow();
  });

  it("should return user object if found", async () => {
    const result = await findUserByUsernamePostgres(db as Client, "myUser");

    expect(result).toEqual({
      id: 1,
      username: "myUser",
      email: "myUser@example.cz",
    });
  });

  it("should throw error object if user not found", async () => {
    await expect(
      findUserByUsernamePostgres(db as Client, "non-existent")
    ).rejects.toThrow(Error);
  });

  it("should throw an error on database query failure", async () => {
    const error = new Error("Database error");
    (mockDb.query as Mock).mockRejectedValue(error);

    await expect(
      findUserByUsernamePostgres(mockDb as Client, "test")
    ).rejects.toThrow("Database error");
  });

  it("should prevent SQL injection attacks", async () => {
    const maliciousInput = "'test' OR 'a' = 'a'";
    await expect(
      findUserByUsernamePostgres(db as Client, maliciousInput)
    ).rejects.toThrow();
  });
});

/**
 * findUserByEmailPostgres
 * - return user object if found
 * - throw usererror object if user not found
 * - throw error if database query fails
 * - prevent SQL injection attacks
 */
describe("findUserByEmailPostgres", () => {
  let mockDb: PostgresClient;

  beforeAll(async () => {
    await db.connect();
    mockDb = { query: vi.fn() };
  });

  afterAll(async () => {
    await db.end();
  });

  it("should return user object if found", async () => {
    const result = await findUserByEmailPostgres(
      db as Client,
      "myUser@example.cz"
    );

    expect(result).toEqual({
      id: 1,
      username: "myUser",
      email: "myUser@example.cz",
      created_at: "2025-03-26T15:26:20.420Z",
      password: "something",
    });
  });

  it("should throw UserError object if user not found", async () => {
    await expect(
      findUserByEmailPostgres(db as Client, "noexample@example.cz")
    ).rejects.toThrow(UserError);
  });

  it("should throw an error on database query failure", async () => {
    const error = new Error("Database error");
    (mockDb.query as Mock).mockRejectedValue(error);

    await expect(
      findUserByEmailPostgres(mockDb as Client, "test@example.com")
    ).rejects.toThrow("Database error");
  });

  it("should return user object for case-insensitive email match", async () => {
    await expect(
      findUserByEmailPostgres(db as Client, "MYUSER@example.cz")
    ).resolves.toBeTruthy();
  });
});

/**
 * insertUserPostgres
 * - return void if user is inserted successfully
 * - throw usererror object if user already exists
 * - throw error if database query fails
 * - prevent SQL injection attacks
 * - throw error if username or email is null or empty
 * - throw error if username or email is too long
 * - throw error if hashedPassword is null or empty
 */
describe("insertUserPostgres", () => {
  let mockDb: PostgresClient;

  beforeAll(async () => {
    await db.connect();
    mockDb = { query: vi.fn() };
    await db.query("DELETE FROM users WHERE email = $1", ["test@example.com"]);
  });

  afterAll(async () => {
    await db.end();
  });

  afterEach(async () => {
    await db.query("DELETE FROM users WHERE email = $1", ["test@example.com"]);
  });

  it("should insert user into the database", async () => {
    const username = "testuser";
    const email = "test@example.com";
    const hashedPassword = "hashedpassword123";

    await insertUserPostgres(db, username, email, hashedPassword);
    const res = await db.query("SELECT * FROM users WHERE email = $1", [email]);

    expect(res.rows.length).toBe(1);
    expect(res.rows[0]).toEqual({
      id: expect.any(Number),
      username: "testuser",
      email: "test@example.com",
      created_at: expect.any(String),
      password: "hashedpassword123",
    });
  });

  it("should throw an error when inserting the same user again (unique constraint)", async () => {
    const username = "testuser";
    const email = "test@example.com";
    const hashedPassword = "hashedpassword123";
    await insertUserPostgres(db, username, email, hashedPassword);
    await expect(
      insertUserPostgres(db, username, email, hashedPassword)
    ).rejects.toThrowError(UserError);
  });

  it("should throw an error on database failure", async () => {
    const mockDb: PostgresClient = {
      query: vi.fn().mockRejectedValue(new Error("Database insertion failed")),
    };

    await expect(
      insertUserPostgres(
        mockDb,
        "testuser",
        "test@example.com",
        "hashedpassword123"
      )
    ).rejects.toThrow("Database insertion failed");
  });

  it("should throw an error when username is null", async () => {
    await expect(
      insertUserPostgres(
        db as Client,
        null as unknown as string,
        "test@example.com",
        "hashedpassword123"
      )
    ).rejects.toThrow();
  });

  it("should throw an error when email is empty", async () => {
    await expect(
      insertUserPostgres(db as Client, "testuser", "", "hashedpassword123")
    ).rejects.toThrow();
  });

  it("should throw an error when username is null or empty", async () => {
    await expect(
      insertUserPostgres(
        db as Client,
        null as unknown as string,
        "test@example.com",
        "hashedpassword123"
      )
    ).rejects.toThrow();

    await expect(
      insertUserPostgres(
        db as Client,
        "",
        "test@example.com",
        "hashedpassword123"
      )
    ).rejects.toThrow();
  });

  it("should throw an error when email is null or empty", async () => {
    await expect(
      insertUserPostgres(
        db as Client,
        "testuser",
        null as unknown as string,
        "hashedpassword123"
      )
    ).rejects.toThrow();

    await expect(
      insertUserPostgres(db as Client, "testuser", "", "hashedpassword123")
    ).rejects.toThrow();
  });

  it("should throw an error when hashedPassword is null or empty", async () => {
    await expect(
      insertUserPostgres(
        db as Client,
        "testuser",
        "test@example.com",
        null as unknown as string
      )
    ).rejects.toThrow();

    await expect(
      insertUserPostgres(db as Client, "testuser", "test@example.com", "")
    ).rejects.toThrow();
  });

  it("should throw an error for excessively long username or email", async () => {
    const longUsername = "a".repeat(256);
    const longEmail = "a".repeat(256) + "@example.com";

    await expect(
      insertUserPostgres(
        db as Client,
        longUsername,
        "test@example.com",
        "hashedpassword123"
      )
    ).rejects.toThrow();

    await expect(
      insertUserPostgres(
        db as Client,
        "testuser",
        longEmail,
        "hashedpassword123"
      )
    ).rejects.toThrow();
  });
});
