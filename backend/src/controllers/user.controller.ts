import { Request, Response, NextFunction } from "express";
import {
  registerUserService,
  loginUserService,
  getUserService,
} from "../services/user.service";
import { postgresDBPool } from "../config/database.config.postgres";
import { validateRequiredUserFields } from "../utils/validate.utils";

/**
 * Handles the user registration process.
 */
export async function registerUserController(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { username, email, password } = req.body;
    validateRequiredUserFields({ username, email, password });

    const { token, user } = await registerUserService(
      postgresDBPool,
      username,
      email,
      password
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    res.status(201).json({ message: "Uživatel úspěšně zaregistrován.", user });
  } catch (err: any) {
    next(err);
  }
}

/**
 * Handles the login process for a user.
 *
 * @param req - The HTTP request object, containing the user's email and password in the body.
 * @param res - The HTTP response object used to send the response back to the client.
 * @param next - The next middleware function to handle errors.
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
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { email, password } = req.body;
    validateRequiredUserFields({ email, password });

    const { token, user } = await loginUserService(
      postgresDBPool,
      email,
      password
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    res.json({ message: "Uživatel úspěšně přihlášen.", user });
  } catch (err: any) {
    next(err);
  }
}

/**
 * Handles the retrieval of a user's profile preferences.
 *
 * @param req - The HTTP request object, expected to contain the user's ID in `req.user.id`.
 * @param res - The HTTP response object used to send the user's preferences or an error response.
 * @param next - The next middleware function for error handling.
 * @returns A promise that resolves to void.
 *
 * @throws Will handle any errors that occur during database connection, preference retrieval, or response handling.
 *
 * This controller function:
 * 1. Extracts the user ID from the request object.
 * 2. Connects to the database.
 * 3. Retrieves the user's preferences using the `getUserPreferences` function.
 * 4. Sends the preferences as a JSON response.
 * 5. Handles any errors using `handleControllerError`.
 * 6. Ensures the database connection is closed in the `finally` block.
 */
export async function getUserProfileController(
  req: Request,
  res: Response,
  next: Function
): Promise<void> {
  try {
    const userId = (req as any).user.id;
    const userPrefer = await getUserService(postgresDBPool, userId);
    res.json(userPrefer);
  } catch (err) {
    next(err);
  }
}
