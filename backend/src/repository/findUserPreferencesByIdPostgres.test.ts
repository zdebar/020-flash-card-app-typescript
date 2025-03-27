import { describe, it, expect, vi, beforeEach, Mock } from "vitest";
import { findUserPreferencesByIdPostgres } from "./user.repository.postgres";
import { Client } from "pg";

vi.mock("../utils/logger.utils", () => ({
  default: { error: vi.fn() }
}));

describe("findUserPreferencesByIdPostgres", () => {
  let mockDb: Partial<Client>;

  beforeEach(() => {
    mockDb = {
      query: vi.fn() 
    };
  });

  it("should return user object with preferences if found", async () => {
    const mockUserWithPreferences = {
      id: 1,
      username: "testuser",
      email: "test@example.com",
      created_at: "2024-03-27T10:00:00.000Z",
      mode_day: 1,
      font_size: 1,     
      notifications: 1
    };
  
    (mockDb.query as Mock).mockResolvedValue({ rows: [mockUserWithPreferences] });
  
    const result = await findUserPreferencesByIdPostgres(mockDb as Client, 1);
  
    expect(result).toEqual(mockUserWithPreferences);
    expect(mockDb.query).toHaveBeenCalledWith(`
      SELECT 
        u.id, 
        u.username, 
        u.email, 
        u.created_at, 
        up.* 
      FROM users u
      LEFT JOIN user_preferences up ON u.id = up.user_id
      WHERE u.id = $1`, 
      [1]
    );
  });
  

  it("should return null if user preferences not found (empty array)", async () => {
    (mockDb.query as Mock).mockResolvedValue({ rows: [] });

    const result = await findUserPreferencesByIdPostgres(mockDb as Client, 999);

    expect(result).toBeNull();
  });

  it("should return null if user preferences not found (undefined)", async () => {
    (mockDb.query as Mock).mockResolvedValue({ undefined });

    const result = await findUserPreferencesByIdPostgres(mockDb as Client, 999);

    expect(result).toBeNull();
  });

  it("should throw an error on database query failure", async () => {
    const error = new Error("Database error");
    (mockDb.query as Mock).mockRejectedValue(error);

    await expect(findUserPreferencesByIdPostgres(mockDb as Client, 1)).rejects.toThrow("Database error");
  });
});
