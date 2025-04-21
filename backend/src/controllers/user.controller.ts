import { Request, Response, NextFunction } from "express";
import { getUserService } from "../services/user.service";
import { postgresDBPool } from "../config/database.config.postgres";
import { User, Score } from "../types/dataTypes";
import { updateUserPostgres } from "../repository/user.repository.postgres";

/**
 *
 * @param req
 * @param res
 * @param next
 * @returns
 */
export async function getUserController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { uid, email, name, picture } = (req as any).user;
    const { user, score }: { user: User; score: Score[] } =
      await getUserService(postgresDBPool, uid);

    res.status(200).json({
      user,
      email,
      name,
      picture,
      score,
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
    const user: User = req.body as User;
    const userUpdated: User = await updateUserPostgres(postgresDBPool, user);
    res.json(userUpdated);
  } catch (err) {
    next(err);
  }
}
