import { checkUserExistsById } from "../repository/user.repository.postgres";
import {
  PostgresClient,
  WordUpdate,
  Word,
  Score,
  Note,
} from "../types/dataTypes";
import {
  getWordsPostgres,
  updateWordsPostgres,
  getScorePostgres,
} from "../repository/practice.repository.postgres";
import { addAudioPathsToWords } from "../utils/progress.utils";

/**
 * Gets a list of words for a given user and language ID from the database.
 */
export async function getWordsService(
  db: PostgresClient,
  userID: number,
  languageID: number
): Promise<Word[]> {
  checkUserExistsById(db, userID); // TODO: for development only, consider removing
  const words: Word[] = await getWordsPostgres(db, userID, languageID);

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
