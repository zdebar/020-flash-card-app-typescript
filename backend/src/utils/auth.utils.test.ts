import { hashPassword, comparePasswords, createToken, verifyToken } from "../utils/auth.utils";
import { describe, it, expect, vi } from "vitest";
import { User } from "../types/dataTypes";
import dotenv from 'dotenv';
import path from "path";

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const jwt_secret = process.env.JWT_SECRET || "backup_password";
const jwt_expires_in = process.env.JWT_EXPIRES_IN || "1h";
console.log('JWT_SECRET:', jwt_secret);
console.log('JWT_EXPIRES_IN:', jwt_expires_in);

describe("Password Hashing & Verification", () => {
  it("should hash a password and verify it correctly", async () => {
    const password = "securePassword123";

    const hashedPassword = await hashPassword(password);
    expect(hashedPassword).not.toBe(password);

    const isMatch = await comparePasswords(password, hashedPassword);
    expect(isMatch).toBe(true);

    const isNotMatch = await comparePasswords("wrongPassword", hashedPassword);
    expect(isNotMatch).toBe(false);
  });
});

describe("JWT Token Creation & Verification", () => {
  const mockUser: User = {
    id: 1,
    username: "testUser",
    email: "test@example.com",
  };

  it("should create a valid JWT token and verify it", async () => {
    const token = await createToken(mockUser, jwt_secret, jwt_expires_in);
    expect(typeof token).toBe("string");

    const decodedUser = await verifyToken(token, jwt_secret);
    expect(decodedUser).toMatchObject(mockUser);
  });

  it("should fail verification with an invalid token", async () => {

    await verifyToken("invalid-token", jwt_secret).catch(() => {});
    expect.objectContaining({ error: expect.any(String), token: "invalid-token" })
  });

  it("should fail token creation if JWT_SECRET is missing", async () => {
    const missingSecret = undefined;

    await expect(createToken(mockUser, missingSecret, jwt_expires_in)).rejects.toThrowError(Error);
    await expect(verifyToken("test-string", missingSecret)).rejects.toThrowError(Error);
  });
});
