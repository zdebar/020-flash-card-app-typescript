import { Response, Request, NextFunction } from "express";
import { getUserService } from "../services/user.service";
import { postgresDBPool } from "../config/database.config.postgres";
import { UserSettings, UserScore } from "../../../shared/types/dataTypes";
import { updateUserPostgres } from "../repository/user.repository.postgres";

/**
 * Gets user profile and score from the database. If the user is not found, it creates a new user.
 */
export async function getUserController(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const uid: string = (req as any).user.uid;
    const {
      userSettings,
      userScore,
    }: { userSettings: UserSettings; userScore: UserScore } =
      await getUserService(postgresDBPool, uid);
    res.status(200).json({
      message: "User settings and score retrieved successfully.",
      userSettings,
      userScore,
    });
  } catch (error) {
    next(error);
  }
}

/**
 *  Updates user profile in the database.
 */
export async function updateUserController(
  req: Request,
  res: Response,
  next: Function
): Promise<void> {
  try {
    const uid: string = (req as any).user.uid;
    const userSettings: UserSettings = req.body as UserSettings;
    const userUpdated: UserSettings = await updateUserPostgres(
      postgresDBPool,
      uid,
      userSettings
    );
    res.status(200).json({
      message: "User settings updates successfully.",
      userUpdated,
    });
  } catch (err) {
    next(err);
  }
}
