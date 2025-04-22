import { Request, Response, NextFunction } from "express";
import { getUserService } from "../services/user.service";
import { postgresDBPool } from "../config/database.config.postgres";
import {
  UserSettings,
  UserScore,
  UserInfo,
} from "../../../shared/types/dataTypes";
import { updateUserPostgres } from "../repository/user.repository.postgres";

/**
 * Gets user profile and score from the database. If the user is not found, it creates a new user.
 */
export async function getUserController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const uid: string = (req as any).user.uid;
    const {
      userSettings,
      userScore,
    }: { userSettings: UserSettings; userScore: UserScore[] } =
      await getUserService(postgresDBPool, uid);

    res.status(200).json({
      userSettings,
      userScore,
    });
  } catch (error) {
    console.error("Error in getUserController:", error);
    res.status(500).send("Internal Server Error");
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
    res.json(userUpdated);
  } catch (err) {
    next(err);
  }
}
