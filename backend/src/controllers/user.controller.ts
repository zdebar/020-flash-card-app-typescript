import { Request, Response, NextFunction } from "express";
import {
  registerUserService,
  loginUserService,
  getUserService,
  updateUserService,
} from "../services/user.service";
import { postgresDBPool } from "../config/database.config.postgres";
import { validateRequiredUserFields } from "../utils/validate.utils";
import { User, Score } from "../types/dataTypes";

/**
 * Handles the user registration process.
 */
export async function registerUserController(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { username, email, password } = req.body;
    validateRequiredUserFields({ username, email, password });

    const { token, user, score } = await registerUserService(
      postgresDBPool,
      username,
      email,
      password
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    res
      .status(201)
      .json({ message: "Uživatel úspěšně zaregistrován.", user, score });
  } catch (err: any) {
    next(err);
  }
}

/**
 * Handles the login process for a user.
 */
export async function loginUserController(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { email, password } = req.body;
    validateRequiredUserFields({ email, password });

    const { token, user } = await loginUserService(
      postgresDBPool,
      email,
      password
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    res.json({ message: "Uživatel úspěšně přihlášen.", user });
  } catch (err: any) {
    next(err);
  }
}

/**
 * Handles the retrieval of user information. *
 */
export async function getUserController(
  req: Request,
  res: Response,
  next: Function
): Promise<void> {
  try {
    const userId: number = (req as any).user.id;
    const { user, score } = await getUserService(postgresDBPool, userId);
    res.json({ user, score });
  } catch (err) {
    next(err);
  }
}

export async function updateUserController(
  req: Request,
  res: Response,
  next: Function
): Promise<void> {
  try {
    const user: User = (req as any).user;
    const userUpdated: User = await updateUserService(postgresDBPool, user);
    res.json(userUpdated);
  } catch (err) {
    next(err);
  }
}
