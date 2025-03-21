import { hashPassword, comparePasswords, createToken, verifyToken } from "../utils/auth.utils";
import { describe, it, expect } from "vitest";
import { UserLogin } from "../types/dataTypes";
import 'dotenv/config';

console.log('JWT_SECRET:', process.env.JWT_SECRET);
console.log('JWT_EXPIRES_IN:', process.env.JWT_EXPIRES_IN);

describe("Password Hashing & Verification", () => {
  it("should hash a password and verify it correctly", async () => {
    const password = "securePassword123";
    const hashedPassword = await hashPassword(password);

    expect(hashedPassword).not.toBe(password); // Hash must be different
    expect(await comparePasswords(password, hashedPassword)).toBe(true); // Should match
    expect(await comparePasswords("wrongPassword", hashedPassword)).toBe(false); // Should fail
  });
});

describe("JWT Token Creation & Verification", () => {
  const mockUser: UserLogin = {
    id: 1,
    username: "testUser",
    email: "test@example.com",
  };

  it("should create a valid JWT token and verify it", async () => {
    const token = createToken(mockUser);
    expect(token).toBeDefined();
    expect(typeof token).toBe("string");

    const decodedUser = await verifyToken(token);
    expect(decodedUser).toMatchObject(mockUser);
  });

  it("should fail verification with an invalid token", async () => {
    await expect(verifyToken("invalid-token")).rejects.toThrow("Invalid token");
  });
});