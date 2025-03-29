import {
  hashPassword,
  comparePasswords,
  createToken,
  verifyToken,
} from "../auth.utils";
import { describe, it, expect, afterAll } from "vitest";
import { User } from "../../types/dataTypes";
import { JWT_SECRET, JWT_EXPIRES_IN } from "../../config/config";

console.log("JWT_SECRET:", JWT_SECRET);
console.log("JWT_EXPIRES_IN:", JWT_EXPIRES_IN);

describe("Password Hashing & Verification", () => {
  afterAll(() => {
    process.env.NODE_ENV = "development";
  });

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

  afterAll(() => {
    process.env.NODE_ENV = "development";
  });

  it("should create a valid JWT token and verify it", async () => {
    const token = await createToken(mockUser, JWT_SECRET, JWT_EXPIRES_IN);
    expect(typeof token).toBe("string");

    const decodedUser = await verifyToken(token, JWT_SECRET);
    expect(decodedUser).toMatchObject(mockUser);
  });

  it("should fail verification with an invalid token", async () => {
    await verifyToken("invalid-token", JWT_SECRET).catch(() => {});
    expect.objectContaining({
      error: expect.any(String),
      token: "invalid-token",
    });
  });

  it("should fail token creation if JWT_SECRET is missing", async () => {
    const missingSecret = undefined;

    await expect(
      createToken(mockUser, missingSecret, JWT_EXPIRES_IN)
    ).rejects.toThrowError(Error);
    await expect(
      verifyToken("test-string", missingSecret)
    ).rejects.toThrowError(Error);
  });
});
