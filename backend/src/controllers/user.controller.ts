import { Request, Response } from 'express';
import { getUserWords, updateUserWords } from "../services/word.service"; 
import logger from '../utils/logger';

/**
 * Controller for getting words for practice
 */
export async function getUserWordsController(req: Request, res: Response): Promise<void> {
  const userId = (req as any).user.id; 
  const { language, block } = req.query; 
  
  if (!language || !block) {
    res.status(400).json({ error: 'Language and block are required.' });
    return;
  }

  try {
    const words = await getUserWords(Number(userId), language as string, Number(block));
    res.status(200).json(words);
  } catch (error) {
    logger.error('Error fetching words for practice:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

/**
 * Controller for updating user words progress and next_at, adding words to user_words if not already in
 */
export async function updateUserWordsController(req: Request, res: Response): Promise<void> {
  const userId = (req as any).user.id;
  const { words, SRS } = req.body;

  if (!Array.isArray(words) || !Array.isArray(SRS)) {
    res.status(400).json({ error: 'Words and SRS intervals must be arrays.' });
    return;
  }

  try {
    await updateUserWords(Number(userId), words, SRS);
    res.status(200).json({ message: 'User words updated successfully.' });
  } catch (error) {
    logger.error('Error updating user words:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
