import { describe, it, expect, vi, beforeEach, Mock } from "vitest";
import { findUserById } from "./user.repository";
import db from "../config/database.config";

vi.mock("../config/database.config", () => {
  return {
    default: {
      get: vi.fn(),
      all: vi.fn(),
      run: vi.fn(),
      close: vi.fn(),
    },
  };
});

describe("findUserById", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return a user when found in the database", async () => {
    const mockUser = { id: 1, username: "testuser", email: "test@example.com" };
    (db.get as Mock).mockImplementation((_query, _params, callback) => {
      callback(null, mockUser);
    });

    const result = await findUserById(1);
    expect(result).toEqual(mockUser);
  });

  it("should return null if the user is not found in SQLite", async () => {
    (db.get as Mock).mockImplementation((_query, _params, callback) => {
      callback(null, null); 
    });

    const result = await findUserById(999);
    expect(result).toBeNull();
  });

  it("should return null if the user is not found in PostgreSQL", async () => {
    (db.get as Mock).mockImplementation((_query, _params, callback) => {
      callback(null, undefined); 
    });

    const result = await findUserById(999);
    expect(result).toBeNull();
  });

  it("should reject when there is a database error", async () => {
    const mockError = new Error("Database error");
    (db.get as Mock).mockImplementation((_query, _params, callback) => {
      callback(mockError, null);
    });

    await expect(findUserById(1)).rejects.toThrow("Database error");
  });
});
