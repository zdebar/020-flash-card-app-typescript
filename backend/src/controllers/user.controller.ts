import { Request, Response } from 'express';
import { getUserWords, updateUserWords } from "../services/word.service.sqlite"; 
import logger from '../utils/logger.utils';
import { UserLogin } from '../types/dataTypes';
import { findUserById } from '../repository/user.repository';
import sqlite3 from 'sqlite3';

/**
 * Controller for getting words for practice. 
 * @param db searched database
 */
export function getUserWordsController(db: sqlite3.Database) {
  return async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = (req as any).user.id;
      const { language, block } = req.query;

      if (!language || !block) {
        res.status(400).json({ error: "Language and block are required." });
        return;
      }

      const blockNumber = Number(block);
      if (isNaN(blockNumber) || blockNumber <= 0) {
        res.status(400).json({ error: "Invalid block number." });
        return;
      }

      const words = await getUserWords(db, Number(userId), language as string, blockNumber);
      res.status(200).json(words);
    } catch (err: any) {
      logger.error("Error fetching words for practice:", err);
      res.status(500).json({ error: "Internal server error" });
    }
  };
}

/**
 * Controller for updating user words progress and next_at, adding words to user_words if not already in.
 * @param db updated database
 */
export function updateUserWordsController(db: sqlite3.Database) {
  return async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = (req as any).user.id;
      const { words, SRS } = req.body;

      if (!Array.isArray(words) || !Array.isArray(SRS)) {
        res.status(400).json({ error: "Words and SRS must be arrays." });
        return;
      }

      await updateUserWords(db, Number(userId), words, SRS);
      res.status(200).json({ message: "User words updated successfully." });
    } catch (err: any) {
      logger.error("Error updating user words:", err);
      res.status(500).json({ error: "Internal server error" });
    }
  };
}

/**
 * Finds user by ID, and res.json UserLogin (userID, username, email)
 * @param db searched database
 */
export function getUserProfileController(db: sqlite3.Database) {
  return async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = (req as any).user.id;
      const user: UserLogin | null = await findUserById(db, userId);

      if (!user) {
        res.status(404).json({ error: "User not found" });
        return;
      }

      res.json(user);
    } catch (err: any) {
      logger.error("Database error during authentication:", err);
      res.status(500).json({ error: "Internal server error" });
    }
  };
}