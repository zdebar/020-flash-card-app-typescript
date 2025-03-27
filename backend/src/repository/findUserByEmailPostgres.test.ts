import { describe, it, expect, vi, beforeEach, Mock } from "vitest";
import { findUserByEmailPostgres } from "./user.repository.postgres";
import { Client } from "pg";

vi.mock("../utils/logger.utils", () => ({
  default: { error: vi.fn() }
}));

describe("findUserByEmailPostgres", () => {
  let mockDb: Partial<Client>;

  beforeEach(() => {
    mockDb = {
      query: vi.fn()
    };
  });

  it("should return user object if found", async () => {
    const mockUser = {
      id: 1,
      username: "testuser",
      email: "test@example.com",
      created_at: "2024-03-27T10:00:00.000Z"
    };

    (mockDb.query as Mock).mockResolvedValue({ rows: [mockUser] });

    const result = await findUserByEmailPostgres(mockDb as Client, "test@example.com");

    expect(result).toEqual(mockUser);
    expect(mockDb.query).toHaveBeenCalledWith(
      "SELECT * FROM users WHERE email = $1",
      ["test@example.com"]
    );
  });

  it("should return null if user not found (empty array)", async () => {
    (mockDb.query as Mock).mockResolvedValue({ rows: [] });

    const result = await findUserByEmailPostgres(mockDb as Client, "nonexistent@example.com");

    expect(result).toBeNull();
  });

  it("should return null if user not found (undefined)", async () => {
    (mockDb.query as Mock).mockResolvedValue({ rows: undefined });

    const result = await findUserByEmailPostgres(mockDb as Client, "nonexistent@example.com");

    expect(result).toBeNull();
  });

  it("should throw an error on database query failure", async () => {
    const error = new Error("Database error");
    (mockDb.query as Mock).mockRejectedValue(error);

    await expect(findUserByEmailPostgres(mockDb as Client, "test@example.com")).rejects.toThrow("Database error");
  });
});
