import { Request, Response } from "express";
import {
  getWordsPostgres,
  updateWordsPostgres,
} from "../repository/word.service.postgres";
import { postgresDBPool } from "../config/database.config.postgres";
import config from "../config/config";
import { WordUpdate } from "../types/dataTypes";

interface GetUserWordsQuery {
  srcLanguage?: string;
  trgLanguage?: string;
}

/**
 * Controller function to retrieve user-specific words based on source and target languages.
 *
 * @param req - The HTTP request object, which includes the user's ID and query parameters
 *              for source and target languages.
 * @param res - The HTTP response object used to send the response back to the client.
 * @param next - The next middleware function for error handling.
 * @returns A promise that resolves to void. Sends a JSON response with the retrieved words
 *          or handles errors appropriately.
 *
 * @throws Will handle and respond to any errors that occur during database connection,
 *         word retrieval, or other operations.
 */
export async function getUserWordsController(
  req: Request,
  res: Response,
  next: Function
): Promise<void> {
  try {
    const userId = (req as any).user.id;
    const { srcLanguage, trgLanguage }: GetUserWordsQuery = req.query;

    const words = await getWordsPostgres(
      postgresDBPool,
      Number(userId),
      Number(srcLanguage),
      Number(trgLanguage),
      config.block
    );

    // Add audio file URLs to each word
    const wordsWithAudio = words.map((word: any) => ({
      ...word,
      audio: `/${trgLanguage}/${word.audio}.opus`,
    }));

    res.status(200).json(wordsWithAudio);
  } catch (err) {
    next(err);
  }
}

/**
 * Updates the words associated with a user in the database.
 *
 * @param req - The HTTP request object, which includes the user's ID and the words to update.
 * @param res - The HTTP response object used to send the response back to the client.
 * @param next - The next middleware function for error handling.
 * @returns A promise that resolves to void. Sends a JSON response indicating success or handles errors.
 *
 * @throws Will handle any errors that occur during the database connection, update operation, or response handling.
 */
export async function updateUserWordsController(
  req: Request,
  res: Response,
  next: Function
): Promise<void> {
  try {
    const userId = (req as any).user.id;
    const { words } = req.body;
    await updateWordsPostgres(
      postgresDBPool,
      Number(userId),
      words as WordUpdate[]
    );
    res.status(200).json({ message: "Uživatelká slova aktualizována." });
  } catch (err) {
    next(err);
  }
}
