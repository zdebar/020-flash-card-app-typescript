import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../types/dataTypes";
import logger from "./logger.utils";

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
 * @param JWT_SECRET_KEY - The secret key used to sign the JWT. Must be provided.
 * @param JWT_EXPIRES_IN - The expiration time for the JWT. Must be provided.
 * @returns The signed JWT as a string.
 * @throws Will throw an error if `JWT_SECRET_KEY` or `JWT_EXPIRES_IN` is not provided.
 */
export function createToken(
  user: User,
  JWT_SECRET_KEY: string | undefined,
  JWT_EXPIRES_IN: string | undefined
): string {
  if (!JWT_SECRET_KEY || !JWT_EXPIRES_IN) {
    throw new Error(`JWT_SECRET_KEY or JWT_EXPIRES_IN not provided!`);
  }

  const payload: User = {
    id: user.id,
    username: user.username,
    email: user.email,
  };

  const expirationTime = JWT_EXPIRES_IN as jwt.SignOptions["expiresIn"];
  return jwt.sign(payload, JWT_SECRET_KEY, { expiresIn: expirationTime });
}

/**
 * Verifies a JSON Web Token (JWT) and decodes its payload.
 *
 * @param token - The JWT string to be verified.
 * @param JWT_SECRET_KEY - The secret key used to verify the token. If undefined, an error will be thrown.
 * @returns The decoded payload as a `User` object if the token is valid.
 * @throws An error if the `JWT_SECRET_KEY` is not provided or if the token verification fails.
 */
export function verifyToken(
  token: string,
  JWT_SECRET_KEY: string | undefined
): User {
  if (!JWT_SECRET_KEY) {
    throw new Error(`JWT_SECRET_KEY not provided!`);
  }

  const decoded = jwt.verify(token, JWT_SECRET_KEY);
  return decoded as User;
}
