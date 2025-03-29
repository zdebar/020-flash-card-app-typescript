import { Request, Response } from 'express';
import { getWordsPostgres, updateWordsPostgres } from '../services/word.service.postgres';
import logger from '../utils/logger.utils';
import { getUserPreferences } from '../services/user.service';
import db from '../config/database.config.postgres';
import { closeDbConnection } from '../utils/database.utils';
import { handleControllerError } from '../utils/validation.utils';

/**
 * Controller for getting words for practice. 
 */
export async function getUserWordsController(req: Request, res: Response): Promise<void> {
  const userId = (req as any).user.id;
  const { srcLanguage, trgLanguage, block }: { srcLanguage?: string, trgLanguage?: string, block?: string } = req.query;

  try {
    await db.connect()
    const words = await getWordsPostgres(db, Number(userId), Number(srcLanguage), Number(trgLanguage), Number(block));
    res.status(200).json(words);
  } catch (err: any) {
    handleControllerError(err, res, req)
  } finally {
    await closeDbConnection(db)
  }
}

/**
 * Controller for updating user_words progress, next_at, learned_at. Will add words to user_words if not already in.
 */
export async function updateUserWordsController(req: Request, res: Response): Promise<void> {
  const userId = (req as any).user.id;
  const { words } = req.body;

  try { 
    await db.connect()
    await updateWordsPostgres(db, Number(userId), words);
    res.status(200).json({ message: "User words updated successfully." });
  } catch (err: any) {
    handleControllerError(err, res, req)
  } finally {
    await closeDbConnection(db)
  }
}

/**
 * Finds user by ID, and res.json UserLogin (userID, username, email)
 */
export async function getUserProfileController(req: Request, res: Response): Promise<void> {
  const userId = (req as any).user.id;

  try {   
    await db.connect()
    const userPrefer = await getUserPreferences(db, userId);
    res.json(userPrefer);
  } catch (err: any) {
    handleControllerError(err, res, req)
  } finally {
    await closeDbConnection(db)
  }
}
