import {
  hashPassword,
  comparePasswords,
  createToken,
} from "../utils/auth.utils";
import {
  insertUserPostgres,
  findUserLoginByEmailPostgres,
  findUserByIdPostgres,
  checkUserExistsById,
  updateUserPostgres,
} from "../repository/user.repository.postgres";
import {
  UserError,
  User,
  UserLogin,
  PostgresClient,
  WordUpdate,
  Word,
  Score,
} from "../types/dataTypes";
import {
  getWordsPostgres,
  updateWordsPostgres,
  getScorePostgres,
} from "../repository/practice.repository.postgres";
import { addAudioPathsToWords } from "../utils/progress.utils";

/**
 * Registers a new user in the system by hashing the provided password
 * and inserting the user details into the PostgreSQL database.
 */
export async function registerUserService(
  db: PostgresClient,
  username: string,
  email: string,
  password: string
): Promise<{ token: string; user: User; score: Score }> {
  const hashedPassword: string = await hashPassword(password);
  const user: User = await insertUserPostgres(
    db,
    username,
    email,
    hashedPassword
  );
  const score: Score = await getScorePostgres(db, user.id);
  const token: string = createToken(user.id);
  return { token, user, score };
}

/**
 * Authenticates a user by verifying their email and password, and generates a JWT token upon successful login.
 */
export async function loginUserService(
  db: PostgresClient,
  email: string,
  password: string
): Promise<{ token: string; user: User }> {
  const userLogin: UserLogin = await findUserLoginByEmailPostgres(db, email);
  const passwordMatch: boolean = await comparePasswords(
    password,
    userLogin.password
  );

  if (!passwordMatch) {
    throw new UserError("Zadané heslo je nesprávné");
  }

  const token: string = createToken(userLogin.id);
  const { password: passwordToOmit, ...user } = userLogin;

  return { token, user };
}

/**
 * Retrieves the user information and score for a given user ID from the database.
 */
export async function getUserService(
  db: PostgresClient,
  userId: number
): Promise<{ user: User; score: Score }> {
  const user: User = await findUserByIdPostgres(db, userId);
  const score: Score = await getScorePostgres(db, userId);
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
 * Gets a list of words for a given user and language ID from the database.
 */
export async function getWordsService(
  db: PostgresClient,
  userID: number,
  languageID: number,
  numWords?: number
): Promise<Word[]> {
  checkUserExistsById(db, userID);
  const words: Word[] = await getWordsPostgres(
    db,
    userID,
    languageID,
    numWords
  );

  return addAudioPathsToWords(words, languageID);
}

/**
 * Updates the user's word progress in the PostgreSQL database and returns the updated score.
 */
export async function updateWordsService(
  db: PostgresClient,
  userID: number,
  words: WordUpdate[]
): Promise<Score> {
  updateWordsPostgres(db, userID, words);
  return await getScorePostgres(db, userID);
}
