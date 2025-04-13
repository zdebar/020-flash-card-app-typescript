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
} from "../repository/word.repository.postgres";
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
): Promise<{ token: string; user: User }> {
  const hashedPassword = await hashPassword(password);
  const user = await insertUserPostgres(db, username, email, hashedPassword);

  const token = createToken(user.id);
  return { token, user };
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
  const passwordMatch = await comparePasswords(password, userLogin.password);

  if (!passwordMatch) {
    throw new UserError("Zadané heslo je nesprávné");
  }

  const token = createToken(userLogin.id);
  const { password: passwordToOmit, ...user } = userLogin;

  return { token, user };
}

/**
 * Retrieves the user preferences for a given user ID from the database.
 * TODO: consider deleteing, so far not used
 */
export async function getUserService(
  db: PostgresClient,
  userId: number
): Promise<User> {
  return await findUserByIdPostgres(db, userId);
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
