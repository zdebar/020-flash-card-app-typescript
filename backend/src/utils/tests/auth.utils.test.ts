import {
  hashPassword,
  comparePasswords,
  createToken,
  verifyToken,
} from "../auth.utils";
import { describe, it, expect, afterAll } from "vitest";
import { User } from "../../types/dataTypes";
import config from "../../config/config";

console.log("JWT_SECRET:", config.JWT_SECRET);
console.log("JWT_EXPIRES_IN:", config.JWT_EXPIRES_IN);

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

  it("should handle empty passwords gracefully", async () => {
    const password = "";

    const hashedPassword = await hashPassword(password);
    expect(hashedPassword).not.toBe(password);

    const isMatch = await comparePasswords(password, hashedPassword);
    expect(isMatch).toBe(true);
  });

  it("should hash and verify very long passwords", async () => {
    const longPassword = "a".repeat(1000);

    const hashedPassword = await hashPassword(longPassword);
    expect(hashedPassword).not.toBe(longPassword);

    const isMatch = await comparePasswords(longPassword, hashedPassword);
    expect(isMatch).toBe(true);
  });

  it("should handle multiple password hashes in parallel", async () => {
    const passwords = ["password1", "password2", "password3"];
    const hashedPasswords = await Promise.all(
      passwords.map((password) => hashPassword(password))
    );

    hashedPasswords.forEach((hashedPassword, index) => {
      expect(hashedPassword).not.toBe(passwords[index]);
    });
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

  it("should create a valid JWT token and verify it", () => {
    const token = createToken(
      mockUser,
      config.JWT_SECRET,
      config.JWT_EXPIRES_IN
    );
    expect(typeof token).toBe("string");

    const decodedUser = verifyToken(token, config.JWT_SECRET);
    expect(decodedUser).toMatchObject(mockUser);
  });

  it("should fail verification with an invalid token", () => {
    expect(() =>
      verifyToken("invalid-token", config.JWT_SECRET)
    ).toThrowError();
  });

  it("should fail token creation if JWT_SECRET is missing", () => {
    const missingSecret = undefined;

    expect(() =>
      createToken(mockUser, missingSecret, config.JWT_EXPIRES_IN)
    ).toThrowError();
    expect(() => verifyToken("test-string", missingSecret)).toThrowError();
  });

  it("should fail verification for expired tokens", async () => {
    const shortExpiry = "1s";
    const token = createToken(mockUser, config.JWT_SECRET, shortExpiry);

    await new Promise((resolve) => setTimeout(resolve, 1100));

    expect(() => verifyToken(token, config.JWT_SECRET)).toThrowError(
      "jwt expired"
    );
  });

  it("should fail verification for malformed tokens", () => {
    const malformedToken = "malformed.token";

    expect(() => verifyToken(malformedToken, config.JWT_SECRET)).toThrowError();
  });

  it("should fail token creation if JWT_EXPIRES_IN is missing", () => {
    const missingExpiry = undefined;

    expect(() =>
      createToken(mockUser, config.JWT_SECRET, missingExpiry)
    ).toThrowError();
  });

  it("should fail token creation if JWT_EXPIRES_IN is invalid", () => {
    const invalidExpiry = "invalid-format";

    expect(() =>
      createToken(mockUser, config.JWT_SECRET, invalidExpiry)
    ).toThrowError();
  });
});
