import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { UserID } from "../types/dataTypes";
import config from "../config/config";

/**
 * Creates a hashed password.
 * Bcrypt, 10 salt rounds.
 *
 */
export async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, 10);
}

/**
 * Compares text password with a hashed password to determine if they match.
 * Bcrypt.
 *
 */
export async function comparePasswords(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return await bcrypt.compare(password, hashedPassword);
}

/**
 * Creates a JSON Web Token with key and expiration time from environment variables.
 *
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
 * @returns `UserID` if valid, otherwise throws an error.
 */
export function verifyToken(token: string): UserID {
  const decoded = jwt.verify(token, config.JWT_SECRET as string) as UserID;
  return decoded;
}
