import { hashPassword, comparePasswords, createToken, verifyToken } from "../utils/auth.utils";
import { describe, it, expect } from "vitest";
import { User } from "../types/dataTypes";
import dotenv from 'dotenv';
import path from "path";

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const jwt_secret = process.env.JWT_SECRET || "backup_password"
const jwt_expires_in = process.env.JWT_EXPIRES_IN || "1h"
console.log('JWT_SECRET:', jwt_secret);
console.log('JWT_EXPIRES_IN:', jwt_expires_in);

describe("Password Hashing & Verification", () => {
  it("should hash a password and verify it correctly", async () => {
    const password = "securePassword123";
    const hashedPassword = await hashPassword(password);

    expect(hashedPassword).not.toBe(password); 
    expect(await comparePasswords(password, hashedPassword)).toBe(true); 
    expect(await comparePasswords("wrongPassword", hashedPassword)).toBe(false);
  });
});

describe("JWT Token Creation & Verification", () => {
  const mockUser: User = {
    id: 1,
    username: "testUser",
    email: "test@example.com",
    created_at: "2025-03-26T14:30:00Z",
  };

  it("should create a valid JWT token and verify it", async () => {
    const token = createToken(mockUser, jwt_secret, jwt_expires_in);
    expect(typeof token).toBe("string");

    const decodedUser = await verifyToken(token, jwt_secret);
    expect(decodedUser).toMatchObject(mockUser);
  });

  it("should fail verification with an invalid token", async () => {
    await expect(verifyToken("invalid-token", jwt_secret)).rejects.toThrow("Invalid token");
  });
});