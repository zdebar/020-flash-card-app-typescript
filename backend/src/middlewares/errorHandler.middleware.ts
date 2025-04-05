import { NextFunction, Response, Request } from "express";
import logger from "../utils/logger.utils";
import { UserError } from "../types/dataTypes";

export default function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  // Log the error
  if (process.env.NODE_ENV !== "production") {
    logger.error("Error occurred", {
      message: err.message,
    });
  } else {
    logger.error("Error occurred", { message: err.message });
  }

  // Send the response
  if (err instanceof UserError) {
    res.status(400).json({ message: err.message });
  } else {
    res.status(500).json({ message: "Interní chyba serveru" });
  }
}
