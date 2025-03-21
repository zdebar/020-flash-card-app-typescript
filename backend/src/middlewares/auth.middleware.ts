import { NextFunction, Request, Response } from "express";
import { UserLogin } from "../types/dataTypes";
import { verifyToken } from "../utils/auth.utils";

/**
 * Authenticate JWT token, decodes user login parameters
 * @param req 
 * @param res 
 * @param next 
 * @returns 
 */
export async function authenticateTokenMiddleware(req: Request, res: Response, next: NextFunction): Promise<void> {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    res.status(401).json({ error: "No token" });
    return;
  }

  try {
    const decoded = await verifyToken(token);
    (req as any).user = decoded as UserLogin;
    next();
  } catch (err) {
    res.status(403).json({ error: "Invalid token" });
  }
}