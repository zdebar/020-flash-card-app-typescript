import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../types/dataTypes";
import logger from "./logger.utils";

/**
 * Hashes a password using bcrypt with a salt round of 10.
 * @param password The plain-text password to be hashed.
 * @returns A promise that resolves to the hashed password, rejects with error.
 */
export async function hashPassword (password: string): Promise<string> {
  return await bcrypt.hash(password, 10);

};

/**
 * Compares a password with a hashed password using bcrypt.
 * @param password The plain-text password to compare.
 * @param hashedPassword The hashed password stored in the database.
 * @returns A promise that resolves to a boolean indicating if the passwords match, rejects with error.
 */
export async function comparePasswords(password: string, hashedPassword: string): Promise<boolean> {
  return await bcrypt.compare(password, hashedPassword);
}

/**
 * Will create an access token. The expiration time of the token is passed as a parameter.
 * @param user The user object that contains the necessary user information.
 * @param JWT_SECRET_KEY Secret key for signing the JWT token.
 * @param expiresIn Expiration time for JWT token (e.g., "1h", "24h").
 * @returns A promise that resolves to the JWT token string on success, reject with error on failure to create token.
 */
export async function createToken(user: User, JWT_SECRET_KEY: string | undefined, expiresIn: string | undefined): Promise<string> {
  if (!JWT_SECRET_KEY) {
    const errorMsg = 'JWT_SECRET is missing in environment variables.';
    throw new Error(errorMsg);
  }

  const payload: User = {
    id: user.id,
    username: user.username,
    email: user.email,
  };

  const expirationTime = expiresIn as jwt.SignOptions["expiresIn"];

  try {
    const token = jwt.sign(payload, JWT_SECRET_KEY, { expiresIn: expirationTime });
    return token;
  } catch (err: any) {
    const errorMsg = `Error creating JWT token ${err.message}`;
    throw new Error(errorMsg);
  }
}

/**
 * Verifies JWT token. Secret key is passed as a parameter.
 * @param token JWT token to verify
 * @param JWT_SECRET_KEY Secret key used to verify the JWT token
 * @returns A promise resolves to User data from JWT token, or rejects with error.
 */
export function verifyToken(token: string, JWT_SECRET_KEY: string): Promise<User> {
  return new Promise((resolve, reject) => {
    jwt.verify(token, JWT_SECRET_KEY, (err, decoded) => {
      if (err) {
        const errorMsg = `JWT verification failed ${err.message}`;
        reject(new Error(errorMsg));
      } else {
        resolve(decoded as User);
      }
    });
  });
}