import { NextFunction, Request, Response } from "express";
import { User } from "../types/dataTypes";
import { verifyToken } from "../utils/auth.utils";
import config from "../config/config";
import logger from "../utils/logger.utils";

/**
 * Middleware to authenticate and verify JWT token from request headers.
 * Decodes the token and attaches the decoded user information to the request object.
 * If the token is valid, the middleware allows the request to proceed; otherwise, it responds with an error.
 *
 * @param req - The incoming request object.
 * @param res - The outgoing response object.
 * @param next - The callback function to pass control to the next middleware.
 * @returns - A response with a status code of 401 if no token is provided or 403 if the token is invalid.
 *
 * @throws {Error} If the JWT verification fails, responds with a 403 status.
 */
export function authenticateTokenMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    logger.error(`Authentication failed: No token provided for ${req.ip}`);
    res.status(401).json({ error: "No authentication token" });
    return;
  }

  if (!config.JWT_SECRET) {
    logger.error("JWT secret is not defined in the configuration.");
    res.status(500).json({ error: "Internal server error" });
    return;
  }

  try {
    const decoded = verifyToken(token, config.JWT_SECRET);
    (req as any).user = decoded as User;
    next();
  } catch (err: any) {
    logger.debug(`Authentication failed: ${err.message}`);
    res.status(403).json({ error: "Authentication failed" });
  }
}
