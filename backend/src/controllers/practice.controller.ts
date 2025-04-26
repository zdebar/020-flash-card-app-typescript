import { Request, Response } from "express";
import { postgresDBPool } from "../config/database.config.postgres";
import {
  WordProgress,
  Note,
  UserScore,
  WordTransfer,
} from "../../../shared/types/dataTypes";
import {
  getWordsService,
  updateWordsService,
} from "../services/practice.service";
import { insertNotePostgres } from "../repository/practice.repository.postgres";

/**
 * Controller function to retrieve user-specific words based on source and target languages.
 *
 */
export async function getWordsController(
  req: Request,
  res: Response,
  next: Function
): Promise<void> {
  try {
    const uid: string = (req as any).user.uid;
    const words: WordTransfer[] = await getWordsService(postgresDBPool, uid);

    res.status(200).json({
      message: "User words retrieved successfully.",
      words,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * Updates the words associated with a user in the database. Sends back the updated score.
 */
export async function updateWordsController(
  req: Request,
  res: Response,
  next: Function
): Promise<void> {
  try {
    const uid: string = (req as any).user.uid;
    const words: WordProgress[] = req.body;

    const score: UserScore = await updateWordsService(
      postgresDBPool,
      uid,
      words
    );

    res.status(200).json({
      message: "User words updated successfully.",
      score,
    });
  } catch (err) {
    next(err);
  }
}

export async function insertNoteController(
  req: Request,
  res: Response,
  next: Function
): Promise<void> {
  try {
    const uid: string = (req as any).user.uid;
    const note: Note = req.body;

    await insertNotePostgres(postgresDBPool, uid, note);

    res.status(200).send({
      message: "Note added successfully.",
    });
  } catch (err) {
    next(err);
  }
}
