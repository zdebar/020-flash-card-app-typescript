import {
  describe,
  it,
  expect,
  vi,
  beforeEach,
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

describe("findUserByIDPostgres", () => {
  let mockDb: PostgresClient;

  beforeAll(async () => {
    await db.connect();
    mockDb = { query: vi.fn() };
  });

  afterAll(async () => {
    await db.end();
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
});

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
});

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
});

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
});
