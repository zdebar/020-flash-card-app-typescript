import { NextFunction, Request, Response } from "express";
import logger from "../utils/logger.utils";
import { firebaseAuth } from "../config/firebase.config";

/**
 * Middleware to authenticate requests using Firebase ID tokens.
 */
export async function authenticate(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).send("Unauthorized");
    return;
  }

  const idToken = authHeader.split(" ")[1];

  try {
    const decodedToken = await firebaseAuth.verifyIdToken(idToken);
    const { uid, email, name, picture } = decodedToken;

    (req as any).user = { uid, email, name, picture }; // Will these be null if empty?
    next();
  } catch (error) {
    logger.error("Authentication failed:", error);
    res.status(401).send("Unauthorized");
  }
}
