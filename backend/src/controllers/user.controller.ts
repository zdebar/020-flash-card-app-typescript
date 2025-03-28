import { Request, Response } from 'express';
import { getWordsPostgres, updateWordsPostgres } from '../services/word.service.postgres';
import logger from '../utils/logger.utils';
import { parseAndValidateRequestValue } from '../utils/validation.utils';
import { getUserPreferences } from '../services/user.service';

/**
 * Controller for getting words for practice. 
 * @param db searched database
 */
export async function getUserWordsController(req: Request, res: Response): Promise<void> {
  try {
    const userId = (req as any).user.id;
    const { srcLanguage, trgLanguage, block }: { srcLanguage?: string, trgLanguage?: string, block?: string } = req.query;

    const srcLanguageNumber = parseAndValidateRequestValue(srcLanguage, 'srcLanguage');
    const trgLanguageNumber = parseAndValidateRequestValue(trgLanguage, 'trgLanguage');
    const blockNumber = parseAndValidateRequestValue(block, 'block');

    const words = await getWordsPostgres(Number(userId), srcLanguageNumber, trgLanguageNumber, blockNumber);
    res.status(200).json(words);
  } catch (err: any) {
    logger.error("Error fetching words for practice:", err.message);
    res.status(500).json("Out of service. Please try again later.");
  }
}

/**
 * Controller for updating user_words progress, next_at, learned_at. Will add words to user_words if not already in.
 * @param db updated database
 */
export async function updateUserWordsController(req: Request, res: Response): Promise<void> {
  try {
    const userId = (req as any).user.id;
    const { words } = req.body;

    if (!Array.isArray(words)) {
      throw new Error(`Invalid or empty words array provided by user ${userId}: ${JSON.stringify(words)}`)
    }

    await updateWordsPostgres(Number(userId), words);
    res.status(200).json({ message: "User words updated successfully." });
  } catch (err: any) {
    logger.error("Error updating user words:", err.message);
    res.status(500).json("Out of service. Please try again later.");
  }
}

/**
 * Finds user by ID, and res.json UserLogin (userID, username, email)
 * @param db searched database
 */
export async function getUserProfileController(req: Request, res: Response): Promise<void> {
  try {
    const userId = (req as any).user.id;
    const userPrefer = getUserPreferences(userId);
    res.json(userPrefer);
  } catch (err: any) {
    logger.error("Error getting user preferences:", err.message);
    res.status(500).json("Out of service. Please try again later.");
  }
}
