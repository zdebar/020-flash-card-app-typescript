import { describe, it, expect, vi, beforeEach, Mock } from "vitest";
import { insertUserPostgres } from "./user.repository.postgres";
import { Client } from "pg";

vi.mock("../utils/logger.utils", () => ({
  default: { error: vi.fn() }
}));

describe("insertUserPostgres", () => {
  let mockDb: Partial<Client>;

  beforeEach(() => {
    mockDb = {
      query: vi.fn()
    };
  });

  it("should insert user successfully", async () => {
    const username = "testuser";
    const email = "test@example.com";
    const hashedPassword = "hashed_password";

    (mockDb.query as Mock).mockResolvedValue({});

    await insertUserPostgres(mockDb as Client, username, email, hashedPassword);

    expect(mockDb.query).toHaveBeenCalledWith(
      "INSERT INTO users (username, email, password) VALUES ($1, $2, $3)",
      [username, email, hashedPassword]
    );
  });

  it("should throw an error on database query failure", async () => {
    const error = new Error("Database error");
    (mockDb.query as Mock).mockRejectedValue(error);

    await expect(insertUserPostgres(mockDb as Client, "testuser", "test@example.com", "hashed_password"))
      .rejects.toThrow("Database error");
  });
});
