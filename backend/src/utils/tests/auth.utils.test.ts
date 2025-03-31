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

  it("should create a valid JWT token and verify it", () => {
    const token = createToken(mockUser, JWT_SECRET, JWT_EXPIRES_IN);
    expect(typeof token).toBe("string");

    const decodedUser = verifyToken(token, JWT_SECRET);
    expect(decodedUser).toMatchObject(mockUser);
  });

  it("should fail verification with an invalid token", () => {
    expect(() => verifyToken("invalid-token", JWT_SECRET)).toThrowError();
  });

  it("should fail token creation if JWT_SECRET is missing", () => {
    const missingSecret = undefined;

    expect(() =>
      createToken(mockUser, missingSecret, JWT_EXPIRES_IN)
    ).toThrowError("ENV variables not loaded!");
    expect(() => verifyToken("test-string", missingSecret)).toThrowError(
      "ENV variables not loaded!"
    );
  });
});
