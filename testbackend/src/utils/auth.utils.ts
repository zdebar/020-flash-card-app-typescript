import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { UserLogin } from "../types/dataTypes";
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
 * Will create access token. Expiration time of token si defined in .env as JWT_EXPIRES_IN.
 * Reads password from .env as JWT_SECRET.
 * @param user 
 * @returns A string on success, error on fail. 
 */
export function createToken(user: UserLogin): string {
  const payload: UserLogin = {
    id: user.id,
    username: user.username,
    email: user.email,
  };  

  const JWT_SECRET_KEY = process.env.JWT_SECRET;
  const expiresIn = process.env.JWT_EXPIRES_IN as jwt.SignOptions["expiresIn"];
  
  if (!JWT_SECRET_KEY) {
    throw new Error("JWT_SECRET is missing in environment variables.");
  }

  return jwt.sign(payload, JWT_SECRET_KEY, { expiresIn: expiresIn });
}

/**
 * Verifys JWT token. Reads password from .env as JWT_SECRET.
 * @param token 
 * @returns A Promise with payload of JWT token, in format UserLogin.
 */
export function verifyToken(token: string): Promise<UserLogin> {
  return new Promise((resolve, reject) => {
    const JWT_SECRET_KEY = process.env.JWT_SECRET;

    if (!JWT_SECRET_KEY) {
      throw new Error("JWT_SECRET is missing in environment variables.");
    }

    jwt.verify(token, JWT_SECRET_KEY, (err, decoded) => {
      if (err) {
        reject(new Error("Invalid token"));
      } else {
        resolve(decoded as UserLogin);
      }
    });
  });
}
