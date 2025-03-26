import bcrypt from "bcryptjs";
import jwt, {SignOptions} from "jsonwebtoken";
import { User } from "../types/dataTypes";
import 'dotenv/config';

/**
 * Hashing password with 10 salt round of bcrypt
 * @param password
 * @returns A Promise with hashed password on resolve, and an error on reject. 
 */
export function hashPassword (password: string): Promise<string> {
  return bcrypt.hash(password, 10);
};

/**
 * Compares password with hashed password with bcrypt.
 * @param password 
 * @param hashedPassword 
 * @returns A boolean Promise with true on resolve, and false on reject.
 */
export function comparePasswords(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

/**
 * Will create access token. Expiration time of token is passed as a parameter.
 * @param user 
 * @param JWT_SECRET_KEY Secret key for signing the JWT token
 * @param expiresIn Expiration time for the token
 * @returns A string on success, error on failure
 */
export function createToken(user: User, JWT_SECRET_KEY: string, expiresIn: string): string {
  const payload: User = {
    id: user.id,
    username: user.username,
    email: user.email,
    created_at: user.created_at,
  };

  if (!JWT_SECRET_KEY) {
    throw new Error("JWT_SECRET is missing in environment variables.");
  }

  const expirationTime = expiresIn as jwt.SignOptions["expiresIn"]

  return jwt.sign(payload, JWT_SECRET_KEY, {expiresIn: expirationTime});
}

/**
 * Verifies JWT token. Secret key is passed as a parameter.
 * @param token JWT token to verify
 * @param JWT_SECRET_KEY Secret key used to verify the JWT token
 * @returns A Promise with the decoded JWT payload (User)
 */
export function verifyToken(token: string, JWT_SECRET_KEY: string): Promise<User> {
  return new Promise((resolve, reject) => {
    jwt.verify(token, JWT_SECRET_KEY, (err, decoded) => {
      if (err) {
        reject(new Error("Invalid token"));
      } else {
        resolve(decoded as User);
      }
    });
  });
}