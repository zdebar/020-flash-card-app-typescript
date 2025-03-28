import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../types/dataTypes";

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
 * @param JWT_EXPIRES_IN Expiration time for JWT token (e.g., "1h", "24h").
 * @returns A promise that resolves to the JWT token string on success, reject with error on failure to create token.
 */
export async function createToken(user: User, JWT_SECRET_KEY: string | undefined, JWT_EXPIRES_IN: string | undefined): Promise<string> {
  if (!JWT_SECRET_KEY || !JWT_EXPIRES_IN) throw new Error(`ENV variables not loaded!`)

  const payload: User = {
    id: user.id,
    username: user.username,
    email: user.email,
  };

  const expirationTime = JWT_EXPIRES_IN as jwt.SignOptions["expiresIn"];
  const token = jwt.sign(payload, JWT_SECRET_KEY, { expiresIn: expirationTime });
  return token;
}

/**
 * Verifies JWT token. Secret key is passed as a parameter.
 * @param token JWT token to verify
 * @param JWT_SECRET_KEY Secret key used to verify the JWT token
 * @returns A promise resolves to User data from JWT token, or rejects with error.
 */
export async function verifyToken(token: string, JWT_SECRET_KEY: string | undefined): Promise<User> {
  if (!JWT_SECRET_KEY) throw new Error(`ENV variables not loaded!`)

  return new Promise((resolve, reject) => {
    jwt.verify(token, JWT_SECRET_KEY, (err, decoded) => {
      if (err) {
        reject(err);
      } else {
        resolve(decoded as User);
      }
    });
  });
}
