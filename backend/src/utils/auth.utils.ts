import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { UserID } from "../types/dataTypes";
import config from "../config/config";

/**
 * Hashes a plain text password using bcrypt with a salt round of 10.
 *
 * @param password - The plain text password to be hashed.
 * @returns A promise that resolves to the hashed password as a string.
 */
export async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, 10);
}

/**
 * Compares a plain text password with a hashed password to determine if they match.
 *
 * @param password - The plain text password to compare.
 * @param hashedPassword - The hashed password to compare against.
 * @returns A promise that resolves to `true` if the passwords match, or `false` otherwise.
 */
export async function comparePasswords(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return await bcrypt.compare(password, hashedPassword);
}

/**
 * Creates a JSON Web Token (JWT) for the given user.
 *
 * @param user - The user object containing user details such as `id`, `username`, and `email`.
 * @returns The signed JWT as a string.
 */
export function createToken(userID: number): string {
  const expirationTime = config.JWT_EXPIRES_IN as jwt.SignOptions["expiresIn"];
  return jwt.sign({ id: userID.toString() }, config.JWT_SECRET as string, {
    expiresIn: expirationTime,
  });
}

/**
 * Verifies a JSON Web Token (JWT) and decodes its payload.
 *
 * @param token - The JWT string to be verified.
 * @returns The decoded payload as a `User` object if the token is valid.
 */
export function verifyToken(token: string): UserID {
  const decoded = jwt.verify(token, config.JWT_SECRET as string) as UserID;
  return decoded;
}
