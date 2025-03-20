import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../types/dataTypes";
import { Request, Response, NextFunction } from "express";

const JWT_SECRET_KEY = process.env.JWT_SECRET
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN // this should go expiresIn in jwt.sign, but there is some typescript issue, refactor

export async function hashPassword (password: string): Promise<string> {
  return await bcrypt.hash(password, 10);
};

export async function comparePasswords(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

export async function createToken(user: User): Promise<string> {
  return jwt.sign(
    { id: user.id, username: user.username, email: user.email },
    JWT_SECRET_KEY, 
    { expiresIn: "24h" }
  );
}

