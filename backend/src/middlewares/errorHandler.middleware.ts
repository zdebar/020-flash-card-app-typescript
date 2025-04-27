import { NextFunction, Response, Request } from "express";
import logger, { logErrorWithDetails } from "../utils/logger.utils";
import { UserError } from "../../../shared/types/dataTypes";
import { log } from "console";

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
    body: req.body,
    query: req.query,
    params: req.params,
  });

  // Send the response
  if (err instanceof UserError) {
    res.status(400).json({ message: err.message });
  } else {
    res.status(500).json({ message: "Interní chyba serveru" });
  }
}
