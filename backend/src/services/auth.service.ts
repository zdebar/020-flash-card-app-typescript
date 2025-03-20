import logger from "../utils/logger";
import { hashPassword, comparePasswords, createToken } from "../utils/auth.utils";
import { findUserByEmail, findUserByUsername, insertUser } from "../repository/user.repository";

export async function registerUserService(username: string, email: string, password: string): Promise<string> {
  try {
    // Check if email already exists
    const existingEmail = await findUserByEmail(email);
    if (existingEmail) {
      throw new Error("Email is already taken.");
    }

    // Check if username already exists
    const existingUsername = await findUserByUsername(username);
    if (existingUsername) {
      throw new Error("Username is already taken.");
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Insert new user into the database
    await insertUser(username, email, hashedPassword);
    logger.info(`User registered successfully: ${username}`); 

    return "User registered successfully!";
  } catch (err) {
    logger.error("Error during user registration:", err);
    throw new Error(err.message); 
  }
}

export async function loginUserService(email: string, password: string): Promise<string> {
  try {
    // Find user by email
    const user = await findUserByEmail(email);
    if (!user) {
      throw new Error("User doesn't exist.");
    }

    // Compare password
    const passwordMatch = await comparePasswords(password, user.password);
    if (!passwordMatch) {
      throw new Error("Invalid password.");
    }

    // Create JWT token
    const token = await createToken(user);
    
    return token;
  } catch (err) {
    logger.error("Error during user login:", err);
    throw new Error(err.message); 
  }
}
