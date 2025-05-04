import { PostgresClient } from "../types/dataTypes";
import { ItemProgress, UserScore, Item } from "../../../shared/types/dataTypes";
import {
  getItemsRepository,
  updateItemsRepository,
  getScoreRepository,
} from "../repository/practice.repository.postgres";
import { addAudioPath } from "../utils/update.utils";

/**
 * Gets a list of words for a given user and language ID from the database.
 */
export async function getItemsService(
  db: PostgresClient,
  uid: string
): Promise<Item[]> {
  const words: Item[] = await getItemsRepository(db, uid);
  return words.map((word) => ({
    ...word,
    audio: addAudioPath(word.audio),
  }));
}

/**
 * Updates the user's word progress in the PostgreSQL database and returns the updated score.
 */
export async function updateItemsService(
  db: PostgresClient,
  uid: string,
  items: ItemProgress[]
): Promise<UserScore> {
  await updateItemsRepository(db, uid, items);
  return await getScoreRepository(db, uid);
}
