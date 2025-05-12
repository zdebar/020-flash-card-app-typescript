import { Response, Request, NextFunction } from "express";
import { getUserService } from "../services/user.service";
import { postgresDBPool } from "../config/database.config.postgres";
import { UserScore, UserSettings } from "../../../shared/types/dataTypes";
import { patchNotesRepository } from "../repository/user.repository.postgres";

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
  } catch (error) {
    next(error);
  }
}

/**
 * Patch user notes for developer to database.
 */
export async function patchNotesController(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const uid: string = (req as any).user.uid;
    const { note }: { note: string } = req.body;
    console.log("note", note);
    await patchNotesRepository(postgresDBPool, uid, note);

    res.status(200).json({
      message: "User note updated successfully.",
    });
  } catch (error) {
    next(error);
  }
}
