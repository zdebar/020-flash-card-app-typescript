import { describe, it, expect, vi, beforeEach, Mock } from "vitest";
import { findUserByIdPostgres } from "./user.repository.postgres";
import { Client } from "pg";

vi.mock("../utils/logger.utils", () => ({
  default: { error: vi.fn() }
}));

describe("findUserByIdPostgres", () => {
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

    const result = await findUserByIdPostgres(mockDb as Client, 1);

    expect(result).toEqual(mockUser);
    expect(mockDb.query).toHaveBeenCalledWith(
      "SELECT id, username, email, created_at FROM users WHERE id = $1",
      [1]
    );
  });

  it("should return null if user not found(empty array)", async () => {
    (mockDb.query as Mock).mockResolvedValue({ rows: [] });

    const result = await findUserByIdPostgres(mockDb as Client, 999);

    expect(result).toBeNull();
  });

  it("should return null if user not found(undefined)", async () => {
    (mockDb.query as Mock).mockResolvedValue({ undefined });

    const result = await findUserByIdPostgres(mockDb as Client, 999);

    expect(result).toBeNull();
  });

  it("should throw an error on database query failure", async () => {
    const error = new Error("Database error");
    (mockDb.query as Mock).mockRejectedValue(error);

    await expect(findUserByIdPostgres(mockDb as Client, 1)).rejects.toThrow("Database error");
  });
});
