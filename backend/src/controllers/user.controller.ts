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
import { refreshTokenService } from "../services/user.service";

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

    if (email !== "zdebarth@gmail.com") {
      res.status(401).json({ message: "So far service is closed to public." });
      return;
    }

    validateRequiredUserFields({ username, email, password });

    const {
      refreshToken,
      token,
      user,
      score,
    }: { refreshToken: string; token: string; user: User; score: Score[] } =
      await registerUserService(postgresDBPool, username, email, password);

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    res.cookie("refreshToken", refreshToken, {
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

    const {
      refreshToken,
      token,
      user,
      score,
    }: { refreshToken: string; token: string; user: User; score: Score[] } =
      await loginUserService(postgresDBPool, email, password);

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    res.json({ message: "Uživatel úspěšně přihlášen.", user, score });
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

/**
 * Handles the refresh token process.
 */
export async function refreshTokenController(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      res.status(400).json({ message: "Refresh token is required." });
      return;
    }

    const newToken = await refreshTokenService(postgresDBPool, refreshToken);

    res.cookie("token", newToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    res.json({ message: "Token successfully refreshed." });
  } catch (err) {
    next(err);
  }
}
