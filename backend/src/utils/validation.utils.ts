import { UserError } from "../types/dataTypes";
import logger from "./logger.utils";
import { Response, Request } from "express";

/**
 * Handles errors in a controller by sending an appropriate HTTP response
 * and logging the error details.
 *
 * @param err - The error object that was thrown.
 * @param res - The Express response object used to send the HTTP response.
 * @param req - The Express request object containing details of the HTTP request.
 *
 * @remarks
 * - If the error is an instance of `UserError`, a 400 status code is returned
 *   with the error message and name.
 * - For other errors, a 500 status code is returned with a generic error message.
 * - All errors are logged with details about the request for debugging purposes.
 */
export function handleControllerError(err: Error, res: Response, req: Request) {
  if (err instanceof UserError) {
    res.status(400).json({ error: err.message, name: err.name });
  } else {
    res.status(500).json({
      error: "Internal Server Error",
      name: err.name,
    });
  }

  logger.error({
    message: err.message,
    name: err.name,
    stack: err.stack,
    request: {
      method: req.method,
      url: req.url,
      body: req.body,
      headers: req.headers,
    },
  });
}
