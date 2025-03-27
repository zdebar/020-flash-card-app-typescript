import { describe, it, expect, vi, beforeEach, Mock } from "vitest";
import { loginUserServicePostgres } from "./auth.service.postgres";
import { Client } from "pg";
import { findUserByEmailPostgres } from "../repository/user.repository.postgres";
import { createToken, comparePasswords } from "../utils/auth.utils";
import logger from "../utils/logger.utils";

// Mock external dependencies
vi.mock("../repository/user.repository.postgres", () => ({
  findUserByEmailPostgres: vi.fn(),
}));

vi.mock("../utils/auth.utils", () => ({
  comparePasswords: vi.fn(),
  createToken: vi.fn()
}));

vi.mock("../utils/logger.utils", async () => {
  const original = await vi.importActual("../utils/logger.utils");
  return {
    ...original,
    default: { 
      info: vi.fn(), 
      error: vi.fn()
    }
  };
});

describe("loginUserService", () => {
  let mockDb: Partial<Client>;

  beforeEach(() => {
    mockDb = {} as Client;
    (findUserByEmailPostgres as Mock).mockReset();
    (comparePasswords as Mock).mockReset();
    (createToken as Mock).mockReset();
    (logger.info as Mock).mockReset();
    (logger.error as Mock).mockReset();
  });

  it("should throw an error if user does not exist", async () => {
    (findUserByEmailPostgres as Mock).mockResolvedValue(null);

    await expect(loginUserServicePostgres(mockDb as Client, "test@example.com", "password123"))
      .rejects
      .toThrow("User doesn't exist.");
    
    expect(findUserByEmailPostgres).toHaveBeenCalledWith(mockDb, "test@example.com");
  });

  it("should throw an error if password is incorrect", async () => {
    const user = { id: 1, email: "test@example.com", password: "hashedPassword" };
    (findUserByEmailPostgres as Mock).mockResolvedValue(user);
    (comparePasswords as Mock).mockResolvedValue(false);

    await expect(loginUserServicePostgres(mockDb as Client, "test@example.com", "wrongpassword"))
      .rejects
      .toThrow("Invalid password.");
    
    expect(findUserByEmailPostgres).toHaveBeenCalledWith(mockDb, "test@example.com");
    expect(comparePasswords).toHaveBeenCalledWith("wrongpassword", "hashedPassword");
  });

  it("should successfully return a token when credentials are correct", async () => {
    const user = { id: 1, email: "test@example.com", password: "hashedPassword" };
    (findUserByEmailPostgres as Mock).mockResolvedValue(user);
    (comparePasswords as Mock).mockResolvedValue(true);
    (createToken as Mock).mockReturnValue("jwtToken");

    const token = await loginUserServicePostgres(mockDb as Client, "test@example.com", "password123");

    expect(findUserByEmailPostgres).toHaveBeenCalledWith(mockDb, "test@example.com");
    expect(comparePasswords).toHaveBeenCalledWith("password123", "hashedPassword");
    expect(token).toBe("jwtToken");
  });

  it("should log an error if there is an issue during login", async () => {
    const error = new Error("Database error");
    (findUserByEmailPostgres as Mock).mockRejectedValue(error);

    await expect(loginUserServicePostgres(mockDb as Client, "test@example.com", "password123"))
      .rejects
      .toThrowError(error);
    
    expect(logger.error).toHaveBeenCalledWith("Error during user login:", error);
  });
});
