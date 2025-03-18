import db from '../config/database';
import { Request, Response, RequestHandler } from "express";
import { UserLogin } from '../types/dataTypes';
import logger from '../utils/logger';


export const getUserProfile: RequestHandler = (req: Request, res: Response) => {
  db.get<UserLogin>(
    "SELECT id, username, email FROM users WHERE id = ?", [(req as any).user.id], (err, user) => {
      if (err) {
        logger.error("Database error during authentication:", err);
        return res.status(500).json({ error: "Internal server error" });
      }

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      res.json(user);
    }
  );
};