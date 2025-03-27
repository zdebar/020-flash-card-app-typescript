import { describe, it, expect, vi, beforeEach, Mock } from "vitest";
import { findUserByUsernamePostgres } from "./user.repository.postgres";
import { Client } from "pg";

vi.mock("../utils/logger.utils", () => ({
  default: { error: vi.fn() }
}));

describe("findUserByUsernamePostgres", () => {
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

    const result = await findUserByUsernamePostgres(mockDb as Client, "testuser");

    expect(result).toEqual(mockUser);
    expect(mockDb.query).toHaveBeenCalledWith(
      "SELECT id, username, email, created_at FROM users WHERE username = $1",
      ["testuser"]
    );
  });

  it("should return null if user not found (empty array)", async () => {
    (mockDb.query as Mock).mockResolvedValue({ rows: [] });

    const result = await findUserByUsernamePostgres(mockDb as Client, "nonexistentuser");

    expect(result).toBeNull();
  });

  it("should return null if user not found (undefined)", async () => {
    (mockDb.query as Mock).mockResolvedValue({ rows: undefined });

    const result = await findUserByUsernamePostgres(mockDb as Client, "nonexistentuser");

    expect(result).toBeNull();
  });

  it("should throw an error on database query failure", async () => {
    const error = new Error("Database error");
    (mockDb.query as Mock).mockRejectedValue(error);

    await expect(findUserByUsernamePostgres(mockDb as Client, "testuser")).rejects.toThrow("Database error");
  });
});
