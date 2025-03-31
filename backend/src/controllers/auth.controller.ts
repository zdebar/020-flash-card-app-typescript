import { Request, Response } from "express";
import {
  registerUserService,
  loginUserService,
} from "../services/user.service";
import db from "../config/database.config.postgres";
import logger from "../utils/logger.utils";
import { closeDbConnection } from "../utils/database.utils";
import { handleControllerError } from "../utils/validation.utils";

/**
 * Handles the user registration process.
 *
 * This controller function validates the request body for required fields,
 * connects to the database, registers a new user, logs the user in, and
 * returns a success response with a token. If any errors occur during the
 * process, they are handled appropriately.
 *
 * @param req - The HTTP request object containing the user registration data.
 * @param res - The HTTP response object used to send the response.
 * @returns A promise that resolves to void.
 *
 * @throws Will handle and respond with an error if:
 * - Required fields (username, email, password) are missing.
 * - There is an issue with database connectivity or operations.
 * - Any other unexpected error occurs during the process.
 */
export async function registerUserController(
  req: Request,
  res: Response
): Promise<void> {
  const { username, email, password } = req.body;

  // res.status(400).json({ error: "Sorry. So far application is closed to public users." });
  // return;

  if (!username || !email || !password) {
    res
      .status(400)
      .json({ error: "Username, email and password are all required." });
    return;
  }

  try {
    await db.connect();
    await registerUserService(db, username, email, password);
    const token = await loginUserService(db, email, password);
    res.status(201).json({ message: "User registered successfully.", token });
  } catch (err: any) {
    handleControllerError(err, res, req);
  } finally {
    await closeDbConnection(db);
  }
}

/**
 * Handles the login process for a user.
 *
 * @param req - The HTTP request object, containing the user's email and password in the body.
 * @param res - The HTTP response object used to send the response back to the client.
 * @returns A Promise that resolves to void.
 *
 * @remarks
 * - If the email or password is missing, a 400 status code is returned with an error message.
 * - Connects to the database and calls the `loginUserService` to authenticate the user.
 * - If successful, a token is generated and sent back in the response.
 * - Logs the email of the user for whom the token was sent.
 * - Handles errors using `handleControllerError` and ensures the database connection is closed in the `finally` block.
 *
 * @throws Will handle any errors thrown during the login process and send an appropriate response.
 */
export async function loginUserController(
  req: Request,
  res: Response
): Promise<void> {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ error: "Email and password are required." });
    return;
  }

  try {
    await db.connect();
    const token = await loginUserService(db, email, password);
    logger.info(`Sent token for: ${email}`);
    res.json({ token });
  } catch (err: any) {
    handleControllerError(err, res, req);
  } finally {
    await closeDbConnection(db);
  }
}
