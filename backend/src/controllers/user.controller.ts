import { Request, Response } from 'express';
import { getUserWords, updateUserWords } from "../services/word.service"; 
import logger from '../utils/logger.utils';
import { UserLogin } from '../types/dataTypes';
import { findUserById } from '../repository/user.repository';

/**
 * Controller for getting words for practice
 */
export async function getUserWordsController(req: Request, res: Response): Promise<void> {
  // Get user ID from the authenticated user in the token
  const userId = (req as any).user.id;

  // Get 'language' and 'block' from query parameters
  const { language, block } = req.query;

  // Validate if both 'language' and 'block' are provided
  if (!language || !block) {
    res.status(400).json({ error: 'Language and block are required.' });
    return;
  }

  // Make sure 'block' is a number
  const blockNumber = Number(block);
  if (isNaN(blockNumber) || blockNumber <= 0) {
    res.status(400).json({ error: 'Invalid block number.' });
    return;
  }

  try {
    // Fetch words for the user
    const words = await getUserWords(Number(userId), language as string, blockNumber);
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

/**
 * Finds user by ID, and res.json UserLogin (userID, username, email)
 */
export async function getUserProfileController(req: Request, res: Response): Promise<void> {
  const userId = (req as any).user.id;

  try {
    const user: UserLogin = await findUserById(userId);
    
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    res.json(user);
  } catch (err) {
    logger.error("Database error during authentication:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};