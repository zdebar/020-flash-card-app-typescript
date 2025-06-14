import { Response, Request, NextFunction } from "express";
import { getUserService } from "../services/user.service";
import { postgresDBPool } from "../config/database.config.postgres";
import { UserScore, UserSettings } from "../../../shared/types/dataTypes";

/**
 * Gets user profile and score from the database. If the user is not found, it creates a new user.
 */
export async function getUserController(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { uid, name, email } = (req as any).user;

    if (!["demo@example.com", "zdebarth@gmail.com"].includes(email)) {
      res.status(403).json({
        message: "Přístup je prozatím uzavřen.",
      });
      return;
    }

    const {
      userSettings,
      userScore,
    }: { userSettings: UserSettings; userScore: UserScore } =
      await getUserService(postgresDBPool, uid, name, email);

    res.status(200).json({
      message: "User settings and score retrieved successfully.",
      userSettings,
      userScore,
    });
  } catch (err) {
    (err as any).message = `Error in getUserController: ${
      (err as any).message
    } | uid: ${(req as any).user.uid} | name: ${
      (req as any).user.name
    } | email: ${(req as any).user.email}`;
    next(err);
  }
}
