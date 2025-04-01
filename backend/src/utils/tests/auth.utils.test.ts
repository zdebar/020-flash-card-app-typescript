import {
  hashPassword,
  comparePasswords,
  createToken,
  verifyToken,
} from "../auth.utils";
import { describe, it, expect, afterAll } from "vitest";
import { User } from "../../types/dataTypes";
import config from "../../config/config";

/**
 * hashPassword
 * - return hashed password if hashing is successful DONE
 *
 * comparePasswords
 * - return false if passwords do not match DONE
 * - return true if passwords match DONE
 *
 */

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
});

/**
 * createToken
 * - throw error if JWT_SECRET_KEY or JWT_EXPIRES_IN is not provided
 * - return token if JWT_SECRET_KEY and JWT_EXPIRES_IN are provided
 * - throw error if signing fails
 *
 * verifyToken
 * - throw error if JWT_SECRET_KEY is not provided DONE
 * - throw error if JWT_EXPIRES_IN is invalid DONE
 * - return decoded payload if token is valid DONE
 * - throw error if token verification fails DONE
 * - throw error if token is invalid DONE
 * - throw error if token is expired DONE
 *
 */
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

  it("should fail verification for expired tokens", async () => {
    const shortExpiry = "1s";
    const token = createToken(mockUser, config.JWT_SECRET, shortExpiry);

    await new Promise((resolve) => setTimeout(resolve, 1100));

    expect(() => verifyToken(token, config.JWT_SECRET)).toThrowError(
      "jwt expired"
    );
  });

  it("should fail token creation if JWT_SECRET is missing", () => {
    const missingSecret = undefined;

    expect(() =>
      createToken(mockUser, missingSecret, config.JWT_EXPIRES_IN)
    ).toThrowError();
    expect(() => verifyToken("test-string", missingSecret)).toThrowError(Error);
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
