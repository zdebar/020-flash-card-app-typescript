import { Request, Response } from "express";
import {
  getWordsPostgres,
  updateWordsPostgres,
} from "../repository/word.service.postgres";
import { getUserPreferences } from "../services/user.service";
import { postgresDBPool } from "../config/database.config.postgres";
import config from "../config/config";

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
  const userId = (req as any).user.id;
  const { srcLanguage, trgLanguage }: GetUserWordsQuery = req.query;

  try {
    const words = await getWordsPostgres(
      postgresDBPool,
      Number(userId),
      Number(srcLanguage),
      Number(trgLanguage),
      config.block
    );
    res.status(200).json(words);
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
  const userId = (req as any).user.id;
  const { words } = req.body;

  try {
    await updateWordsPostgres(postgresDBPool, Number(userId), words);
    res.status(200).json({ message: "User words updated successfully." });
  } catch (err) {
    next(err);
  }
}

/**
 * Handles the retrieval of a user's profile preferences.
 *
 * @param req - The HTTP request object, expected to contain the user's ID in `req.user.id`.
 * @param res - The HTTP response object used to send the user's preferences or an error response.
 * @param next - The next middleware function for error handling.
 * @returns A promise that resolves to void.
 *
 * @throws Will handle any errors that occur during database connection, preference retrieval, or response handling.
 *
 * This controller function:
 * 1. Extracts the user ID from the request object.
 * 2. Connects to the database.
 * 3. Retrieves the user's preferences using the `getUserPreferences` function.
 * 4. Sends the preferences as a JSON response.
 * 5. Handles any errors using `handleControllerError`.
 * 6. Ensures the database connection is closed in the `finally` block.
 */
export async function getUserProfileController(
  req: Request,
  res: Response,
  next: Function
): Promise<void> {
  const userId = (req as any).user.id;

  try {
    const userPrefer = await getUserPreferences(postgresDBPool, userId);
    res.json(userPrefer);
  } catch (err) {
    next(err);
  }
}
