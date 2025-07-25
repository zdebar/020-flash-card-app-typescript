import { Response, Request, NextFunction } from "express";
import {
  getUserService,
  resetUserLanguageService,
} from "../services/user.service";
import { postgresDBPool } from "../config/database.config.postgres";
import { UserScore } from "../../../shared/types/dataTypes";
import { validationResult } from "express-validator";

/**
 * Gets user profile and score from the database. If the user is not found, it creates a new user.
 */
export async function getUserController(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new Error(`Validation errors: ${JSON.stringify(errors.array())}`);
    }
    const { uid, name, email } = (req as any).user;

    if (!["demo@example.com", "zdebarth@gmail.com"].includes(email)) {
      res.status(403).json({
        message: "Přístup je prozatím uzavřen.",
      });
      return;
    }

    const userScore: UserScore[] = await getUserService(postgresDBPool, uid);

    res.status(200).json({
      message: "User settings and score retrieved successfully.",
      userScore,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * Resets a given language for the user. Will erase all corresponding user_items and return updated score.
 */
export async function resetUserLanguageController(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new Error(`Validation errors: ${JSON.stringify(errors.array())}`);
    }

    const { uid } = (req as any).user;
    const languageID: number = parseInt((req as any).params.languageID, 10);

    const score: UserScore[] = await resetUserLanguageService(
      postgresDBPool,
      uid,
      languageID
    );

    res.status(200).json({
      message: "User language reset and score retrieved successfully.",
      score,
    });
  } catch (err) {
    next(err);
  }
}
