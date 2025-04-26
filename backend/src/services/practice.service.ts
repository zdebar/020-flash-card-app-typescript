import { PostgresClient } from "../types/dataTypes";
import {
  WordProgress,
  UserScore,
  WordTransfer,
} from "../../../shared/types/dataTypes";
import {
  getWordsPostgres,
  updateWordsPostgres,
  getScorePostgres,
} from "../repository/practice.repository.postgres";
import { addAudioPathsToWords } from "../utils/update.utils";

/**
 * Gets a list of words for a given user and language ID from the database.
 */
export async function getWordsService(
  db: PostgresClient,
  uid: string
): Promise<WordTransfer[]> {
  const words: WordTransfer[] = await getWordsPostgres(db, uid);
  return addAudioPathsToWords(words);
}

/**
 * Updates the user's word progress in the PostgreSQL database and returns the updated score.
 */
export async function updateWordsService(
  db: PostgresClient,
  uid: string,
  words: WordProgress[]
): Promise<UserScore> {
  await updateWordsPostgres(db, uid, words);
  return await getScorePostgres(db, uid);
}
