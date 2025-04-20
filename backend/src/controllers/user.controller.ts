import { Request, Response, NextFunction } from "express";
import { getUserService, updateUserService } from "../services/user.service";
import { postgresDBPool } from "../config/database.config.postgres";
import { User, Score } from "../types/dataTypes";

/**
 *
 * @param req
 * @param res
 * @param next
 * @returns
 */
export async function getUserProfileController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const userFirebase = (req as any).user;
    if (!userFirebase) {
      res.status(401).send("Unauthorized");
      return;
    }

    const { user, score }: { user: User; score: Score[] } =
      await getUserService(postgresDBPool, userFirebase.uid);

    res.status(200).json({
      user: user,
      email: userFirebase.email,
      name: userFirebase.name,
      picture: userFirebase.picture,
      score: score,
    });
  } catch (error) {
    console.error("Error in getUserController:", error);
    res.status(500).send("Internal Server Error");
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
