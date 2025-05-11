import { PostgresClient } from "../types/dataTypes";
import { UserScore, Item, ItemInfo } from "../../../shared/types/dataTypes";
import {
  getItemsRepository,
  patchItemsRepository,
  getScoreRepository,
  getItemInfoRepository,
} from "../repository/items.repository.postgres";
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
export async function patchItemsService(
  db: PostgresClient,
  uid: string,
  items: Item[]
): Promise<UserScore> {
  await patchItemsRepository(db, uid, items);
  return await getScoreRepository(db, uid);
}

/**
 * Gets a list of words for a given user and language ID from the database.
 */
export async function getItemInfoService(
  db: PostgresClient,
  itemId: number
): Promise<ItemInfo[]> {
  const itemInfo: ItemInfo[] = await getItemInfoRepository(db, itemId);

  if (!itemInfo || itemInfo.length === 0) {
    throw new Error(`No item info found for itemId: ${itemId}`);
  }

  return itemInfo.map((item) => ({
    ...item,
    items:
      item.items?.map((word) => ({
        ...word,
        audio: addAudioPath(word.audio),
      })) || [],
  }));
}
