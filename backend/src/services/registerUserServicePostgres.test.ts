import { describe, it, expect, vi, beforeEach, Mock } from "vitest";
import { registerUserServicePostgres } from "./auth.service.postgres";
import { Client } from "pg";
import { findUserByEmailPostgres, findUserByUsernamePostgres, insertUserPostgres } from "../repository/user.repository.postgres";
import { hashPassword } from "../utils/auth.utils";
import logger from "../utils/logger.utils";

// Mock external dependencies
vi.mock("../repository/user.repository.postgres", () => ({
  findUserByEmailPostgres: vi.fn(),
  findUserByUsernamePostgres: vi.fn(),
  insertUserPostgres: vi.fn(),
}));

vi.mock("../utils/auth.utils", () => ({
  hashPassword: vi.fn(),
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

describe("registerUserService", () => {
  let mockDb: Partial<Client>;

  beforeEach(() => {
    mockDb = {} as Client; 
    (findUserByEmailPostgres as Mock).mockReset();
    (findUserByUsernamePostgres as Mock).mockReset();
    (insertUserPostgres as Mock).mockReset();
    (hashPassword as Mock).mockReset();
    (logger.info as Mock).mockReset(); 
    (logger.error as Mock).mockReset(); 
  });

  it("should throw an error if email is already taken", async () => {
    (findUserByEmailPostgres as Mock).mockResolvedValue({ id: 1, email: "test@example.com" });

    await expect(registerUserServicePostgres(mockDb as Client, "newuser", "test@example.com", "password123"))
      .rejects
      .toThrow(Error);
    
    expect(findUserByEmailPostgres).toHaveBeenCalledWith(mockDb, "test@example.com");
  });

  it("should throw an error if username is already taken", async () => {
    (findUserByEmailPostgres as Mock).mockResolvedValue(null);
    (findUserByUsernamePostgres as Mock).mockResolvedValue({ id: 2, username: "existinguser" });

    await expect(registerUserServicePostgres(mockDb as Client, "existinguser", "new@example.com", "password123"))
      .rejects
      .toThrow(Error);

    expect(findUserByEmailPostgres).toHaveBeenCalledWith(mockDb, "new@example.com");
    expect(findUserByUsernamePostgres).toHaveBeenCalledWith(mockDb, "existinguser");
  });

  it("should successfully register a user when email and username are unique", async () => {
    (findUserByEmailPostgres as Mock).mockResolvedValue(null);
    (findUserByUsernamePostgres as Mock).mockResolvedValue(null);

    (hashPassword as Mock).mockResolvedValue("hashedPassword");
    (insertUserPostgres as Mock).mockResolvedValue(undefined);

    await registerUserServicePostgres(mockDb as Client, "newuser", "new@example.com", "password123");

    expect(findUserByEmailPostgres).toHaveBeenCalledWith(mockDb, "new@example.com");
    expect(findUserByUsernamePostgres).toHaveBeenCalledWith(mockDb, "newuser");
    expect(hashPassword).toHaveBeenCalledWith("password123");
    expect(insertUserPostgres).toHaveBeenCalledWith(mockDb, "newuser", "new@example.com", "hashedPassword");

    expect(logger.info).toHaveBeenCalledWith("User registered successfully: newuser");
  });

  it("should throw an error if there is an issue during registration", async () => {
    const error = new Error("Database error");
    (findUserByEmailPostgres as Mock).mockResolvedValue(null);
    (findUserByUsernamePostgres as Mock).mockResolvedValue(null);
    (insertUserPostgres as Mock).mockRejectedValue(error);

    await expect(registerUserServicePostgres(mockDb as Client, "newuser", "new@example.com", "password123"))
      .rejects
      .toThrow(Error);

    expect(logger.error).toHaveBeenCalledWith("Error during user registration:", error.message);
  });
});
