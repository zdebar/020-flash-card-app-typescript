import {
  hashPassword,
  comparePasswords,
  createToken,
  createRefreshToken,
  verifyRefreshToken,
} from "../utils/auth.utils";
import {
  insertUserPostgres,
  findUserLoginByEmailPostgres,
  findUserByIdPostgres,
  updateUserPostgres,
} from "../repository/user.repository.postgres";
import {
  UserError,
  UserID,
  User,
  UserLogin,
  PostgresClient,
  Score,
} from "../types/dataTypes";
import { getScorePostgres } from "../repository/practice.repository.postgres";

/**
 * Registers a new user in the system by hashing the provided password
 * and inserting the user details into the PostgreSQL database.
 */
export async function registerUserService(
  db: PostgresClient,
  username: string,
  email: string,
  password: string
): Promise<{
  token: string;
  refreshToken: string;
  user: User;
  score: Score[];
}> {
  const hashedPassword: string = await hashPassword(password);
  const user: User = await insertUserPostgres(
    db,
    username,
    email,
    hashedPassword
  );
  const score: Score[] = await getScorePostgres(db, user.id);
  const token: string = createToken(user.id);
  const refreshToken: string = createRefreshToken(user.id);
  return { token, refreshToken, user, score };
}

/**
 * Authenticates a user by verifying their email and password, and generates a JWT token upon successful login.
 */
export async function loginUserService(
  db: PostgresClient,
  email: string,
  password: string
): Promise<{
  token: string;
  refreshToken: string;
  user: User;
  score: Score[];
}> {
  const userLogin: UserLogin = await findUserLoginByEmailPostgres(db, email);
  const passwordMatch: boolean = await comparePasswords(
    password,
    userLogin.hashed_password
  );

  if (!passwordMatch) {
    throw new UserError("Zadané heslo je nesprávné");
  }

  const { hashed_password: passwordToOmit, ...user } = userLogin;
  const score: Score[] = await getScorePostgres(db, user.id);
  const token: string = createToken(user.id);
  const refreshToken: string = createRefreshToken(user.id);

  return { token, refreshToken, user, score };
}

/**
 * Retrieves the user information and score for a given user ID from the database.
 */
export async function getUserService(
  db: PostgresClient,
  userId: number
): Promise<{ user: User; score: Score[] }> {
  const user: User = await findUserByIdPostgres(db, userId);
  const score: Score[] = await getScorePostgres(db, userId);
  return { user, score };
}

/**
 * Retrieves the user preferences for a given user ID from the database.
 * TODO: consider deleteing, so far not used
 */
export async function updateUserService(
  db: PostgresClient,
  user: User
): Promise<User> {
  const userUpdated: User = await updateUserPostgres(db, user);
  return userUpdated;
}

/**
 * Refreshes the user's token using a valid refresh token.
 */
export async function refreshTokenService(
  db: PostgresClient,
  refreshToken: string
): Promise<string> {
  const userId: UserID = verifyRefreshToken(refreshToken);
  const user: User = await findUserByIdPostgres(db, Number(userId.id));

  if (!user) {
    throw new UserError("User not found.");
  }

  const newToken: string = createToken(user.id, "1h");
  return newToken;
}
