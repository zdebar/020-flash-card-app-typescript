import { UserError } from "../types/dataTypes";
import logger from "./logger.utils";
import { Response, Request } from "express";

/**
 * Parses and validates a request value, ensuring it is a positive number.
 *
 * @param value - The value to be parsed and validated. Can be a string, undefined, or null.
 * @param paramName - The name of the parameter being validated, used for error messages.
 * @returns The parsed number if it is valid and greater than 0.
 * @throws {Error} If the value is not provided, not a number, or not greater than 0.
 */
export function parseAndValidateRequestValue(
  value: string | undefined | null,
  paramName: string
): number {
  if (!value) {
    throw new Error(`${paramName} is required, but was not provided.`);
  }

  const numberValue = Number(value);
  if (isNaN(numberValue) || numberValue <= 0) {
    throw new Error(`Invalid ${paramName} number: ${value}`);
  }
  return numberValue;
}

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
      error: "Something went wrong. Please try again later.",
      name: err.name,
    });
  }

  logger.error({
    err,
    request: {
      method: req.method,
      url: req.url,
      body: req.body,
      headers: req.headers,
    },
  });
}
