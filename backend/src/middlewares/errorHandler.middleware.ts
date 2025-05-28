import { NextFunction, Response, Request } from "express";
import { logErrorWithDetails } from "../utils/logger.utils";
import { UserError } from "../../../shared/types/dataTypes";

/**
 * Middleware to handle errors in the application. All errors are allowed to propagate here.
 */
export default function errorHandlerMiddleware(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  // Log the error
  logErrorWithDetails(err, "errorHandlerMiddleware", {
    method: req.method,
    url: req.originalUrl,
  });

  // Send the response
  if (err instanceof UserError) {
    res.status(400).json({ error: err.message });
  } else {
    res.status(500).json({ error: "Interní chyba serveru" });
  }
}
