import { Request, Response, NextFunction, RequestHandler } from "express";
import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.SECRET_KEY

export const authenticateToken: RequestHandler = async (req: Request, res: Response, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  try {
    const user = await new Promise((resolve, reject) => {
      jwt.verify(token, SECRET_KEY, (err, decoded) => {
        if (err) reject(err);
        resolve(decoded);
      });
    });

    (req as any).user = user;
    next();
  } catch (err) {
    res.status(403).json({ error: "Invalid token" });
    return;
  }
};

