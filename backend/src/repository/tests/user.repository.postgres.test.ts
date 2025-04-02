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
import { PoolClient } from "pg";
import { UserError } from "../../../../shared/types/dataTypes";
import { postgresDBPool } from "../../config/database.config.postgres";

describe("findUserByIDPostgres", () => {
  it("should throw an error for invalid userId (negative or zero)", async () => {
    await expect(findUserByIdPostgres(postgresDBPool, -1)).rejects.toThrow(
      Error
    );
    await expect(findUserByIdPostgres(postgresDBPool, 0)).rejects.toThrow(
      Error
    );
  });

  it("should return user object if found", async () => {
    const result = await findUserByIdPostgres(postgresDBPool, 1);

    expect(result).toEqual({
      id: 1,
      username: "myUser",
      email: "myUser@example.cz",
    });
  });

  it("should throw error object if user not found", async () => {
    await expect(findUserByIdPostgres(postgresDBPool, 1000)).rejects.toThrow(
      Error
    );
  });

  it("should prevent SQL injection attacks", async () => {
    const maliciousInput = "'test' OR 'a' = 'a'";
    await expect(
      findUserByUsernamePostgres(postgresDBPool, maliciousInput)
    ).rejects.toThrow();
  });
});

/**
 * findUserPreferencesByIdPostgres
 * - return user object if found DONE
 * - throw error object if user not found DONE
 * - throw error if database query fails
 * - prevent SQL injection attacks
 */
describe("findUserPreferencesByIDPostgres", () => {
  it("should return user object if found", async () => {
    const result = await findUserPreferencesByIdPostgres(postgresDBPool, 1);

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
      findUserPreferencesByIdPostgres(postgresDBPool, 1000)
    ).rejects.toThrow(Error);
  });
});

/**
 * findUserByUsernamePostgres
 * - return user object if found DONE
 * - throw error object if user not found DONE
 * - throw error if database query fails
 * - prevent SQL injection attacks DONE
 */
describe("findUserByUsernamePostgres", () => {
  it("should return user object if found", async () => {
    const result = await findUserByUsernamePostgres(postgresDBPool, "myUser");

    expect(result).toEqual({
      id: 1,
      username: "myUser",
      email: "myUser@example.cz",
    });
  });

  it("should throw error object if user not found", async () => {
    await expect(
      findUserByUsernamePostgres(postgresDBPool, "non-existent")
    ).rejects.toThrow(Error);
  });

  it("should prevent SQL injection attack #1", async () => {
    const maliciousInput = "'; DROP TABLE users; --";
    await expect(
      findUserByUsernamePostgres(postgresDBPool, maliciousInput)
    ).rejects.toThrow();
  });

  it("should prevent SQL injection attacks #2", async () => {
    const maliciousInput = "'test' OR 'a' = 'a'";
    await expect(
      findUserByUsernamePostgres(postgresDBPool, maliciousInput)
    ).rejects.toThrow();
  });
});

/**
 * findUserByEmailPostgres
 * - return user object if found DONE
 * - throw usererror object if user not found DONE
 * - throw error if database query fails
 * - prevent SQL injection attacks DONE
 */
describe("findUserByEmailPostgres", () => {
  it("should return user object if found", async () => {
    const result = await findUserByEmailPostgres(
      postgresDBPool,
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

  it("should prevent SQL injection in email", async () => {
    const maliciousInput = "'; DROP TABLE users; --";
    await expect(
      findUserByEmailPostgres(postgresDBPool, maliciousInput)
    ).rejects.toThrow();
  });

  it("should throw UserError object if user not found", async () => {
    await expect(
      findUserByEmailPostgres(postgresDBPool, "noexample@example.cz")
    ).rejects.toThrow(UserError);
  });

  it("should return user object for case-insensitive email match", async () => {
    await expect(
      findUserByEmailPostgres(postgresDBPool, "MYUSER@example.cz")
    ).resolves.toBeTruthy();
  });
});

/**
 * insertUserPostgres
 * - return void if user is inserted successfully DONE
 * - throw usererror object if user already exists DONE
 * - throw error if database query fails
 * - prevent SQL injection attacks
 * - throw error if username is null or empty DONE
 * - throw error if username too long DONE
 * - throw error if email is null or empty DONE
 * - throw error if email too long DONE
 * - throw error if hashedPassword is null or empty DONE
 */
describe("insertUserPostgres", () => {
  beforeAll(async () => {
    const client = (await postgresDBPool.connect()) as PoolClient;
    await postgresDBPool.query("DELETE FROM users WHERE email = $1", [
      "test@example.com",
    ]);
    client.release();
  });

  afterEach(async () => {
    const client = (await postgresDBPool.connect()) as PoolClient;
    await postgresDBPool.query("DELETE FROM users WHERE email = $1", [
      "test@example.com",
    ]);
    client.release();
  });

  it("should insert user into the database", async () => {
    const username = "testuser";
    const email = "test@example.com";
    const hashedPassword = "hashedpassword123";

    await insertUserPostgres(postgresDBPool, username, email, hashedPassword);

    const client = (await postgresDBPool.connect()) as PoolClient;
    const res = await postgresDBPool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );
    client.release();

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
    await insertUserPostgres(postgresDBPool, username, email, hashedPassword);
    await expect(
      insertUserPostgres(postgresDBPool, username, email, hashedPassword)
    ).rejects.toThrowError(UserError);
  });

  it("should throw an error when username is null or empty", async () => {
    await expect(
      insertUserPostgres(
        postgresDBPool,
        null as unknown as string,
        "test@example.com",
        "hashedpassword123"
      )
    ).rejects.toThrow();

    await expect(
      insertUserPostgres(
        postgresDBPool,
        "",
        "test@example.com",
        "hashedpassword123"
      )
    ).rejects.toThrow();
  });

  it("should throw an error when email is null or empty", async () => {
    await expect(
      insertUserPostgres(
        postgresDBPool,
        "testuser",
        null as unknown as string,
        "hashedpassword123"
      )
    ).rejects.toThrow();

    await expect(
      insertUserPostgres(postgresDBPool, "testuser", "", "hashedpassword123")
    ).rejects.toThrow();
  });

  it("should throw an error when hashedPassword is null or empty", async () => {
    await expect(
      insertUserPostgres(
        postgresDBPool,
        "testuser",
        "test@example.com",
        null as unknown as string
      )
    ).rejects.toThrow();

    await expect(
      insertUserPostgres(postgresDBPool, "testuser", "test@example.com", "")
    ).rejects.toThrow();
  });

  it("should throw an error for excessively long username or email", async () => {
    const longUsername = "a".repeat(256);
    const longEmail = "a".repeat(256) + "@example.com";

    await expect(
      insertUserPostgres(
        postgresDBPool,
        longUsername,
        "test@example.com",
        "hashedpassword123"
      )
    ).rejects.toThrow();

    await expect(
      insertUserPostgres(
        postgresDBPool,
        "testuser",
        longEmail,
        "hashedpassword123"
      )
    ).rejects.toThrow();
  });
});
