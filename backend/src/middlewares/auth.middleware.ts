import { Request, Response, NextFunction } from "express";
import logger from "../utils/logger.utils";
import { firebaseAuth, firebaseConfig } from "../config/firebase.config";

/**
 * Middleware to authenticate requests using Firebase ID tokens.
 */
export async function authenticate(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401).send("Unauthorized");
      return;
    }

    const idToken = authHeader.split(" ")[1];

    const decodedToken = await firebaseAuth
      .verifyIdToken(idToken)
      .catch((error: any) => {
        if (error.code === "auth/id-token-expired") {
          res.status(401).send("Unauthorized: Token has expired");
        } else {
          logger.error("Authentication failed:", error);
          res.status(401).send("Unauthorized");
        }
        throw error;
      });

    if (!decodedToken) return;

    const projectId = firebaseConfig.projectId;
    if (decodedToken.aud !== projectId) {
      res
        .status(401)
        .send("Unauthorized: Token does not belong to this project");
      return;
    }

    const { uid } = decodedToken;
    (req as any).user = { uid };
    next();
  } catch (error) {
    logger.error("Authentication failed:", error);
    res.status(401).send("Unauthorized");
  }
}
