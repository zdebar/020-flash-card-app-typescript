import { Request, Response } from "express";
import { postgresDBPool } from "../config/database.config.postgres";
import { WordUpdate, WordNote } from "../types/dataTypes";
import {
  getWordsService,
  updateWordsService,
  insertNoteService,
} from "../services/practice.service";

import { Score, Word } from "../types/dataTypes";

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
    const userId: string = (req as any).user.id;
    const languageID: string = req.query.languageID as string;

    const words: Word[] = await getWordsService(
      postgresDBPool,
      Number(userId),
      Number(languageID)
    );

    res.status(200).json(words);
  } catch (err) {
    console.log("In practice controller", err);
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
    const userId: string = (req as any).user.id;
    const words: WordUpdate[] = req.body;

    const score: Score = await updateWordsService(
      postgresDBPool,
      Number(userId),
      words
    );

    res.status(200).json(score);
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
    const userId: string = (req as any).user.id;
    const noteData: WordNote = req.body;

    const result = await insertNoteService(postgresDBPool, noteData);

    res.status(200).send("Note added successfully");
  } catch (err) {
    next(err);
  }
}
