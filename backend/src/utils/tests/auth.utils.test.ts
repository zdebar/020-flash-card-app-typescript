import {
  hashPassword,
  comparePasswords,
  createToken,
  verifyToken,
} from "../auth.utils";
import { describe, it, expect } from "vitest";
import { User } from "../../types/dataTypes";

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

describe("JWT Token Creation & Verification", () => {
  const mockUser = 1;

  it("should create a valid JWT token and verify it", () => {
    const token = createToken(mockUser);
    expect(typeof token).toBe("string");

    const decodedUser = verifyToken(token);
    expect(decodedUser).toEqual(mockUser);
  });

  it("should fail verification with an invalid token", () => {
    expect(() => verifyToken("invalid-token")).toThrowError();
  });
});
