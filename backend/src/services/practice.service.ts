import { PostgresClient } from "../types/dataTypes";
import { WordProgress, UserScore, Item } from "../../../shared/types/dataTypes";
import {
  getWords,
  updateWords,
  getScore,
} from "../repository/vocabulary.repository.postgres";
import { addAudioPathsToWords } from "../utils/update.utils";

/**
 * Gets a list of words for a given user and language ID from the database.
 */
export async function getWordsService(
  db: PostgresClient,
  uid: string
): Promise<Item[]> {
  const words: Item[] = await getWords(db, uid);
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
  await updateWords(db, uid, words);
  return await getScore(db, uid);
}
