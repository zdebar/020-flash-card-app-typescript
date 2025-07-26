import { PostgresClient } from "../types/dataTypes";
import {
  UserScore,
  Item,
  BlockExplanation,
} from "../../../shared/types/dataTypes";
import {
  getItemsRepository,
  updateUserItemsRepository,
  getItemInfoRepository,
  resetItemRepository,
} from "../repository/items.repository.postgres";
import {
  getScoreRepository,
  updateUserScoreRepository,
} from "../repository/user.repository.postgres";
import { addAudioPathsToWords } from "../utils/update.utils";
import sortItemsByProgress from "../utils/items.utils";

/**
 * Gets a list of words for a given user and language ID from the database.
 */
export async function getItemsService(
  db: PostgresClient,
  uid: string,
  languageID: number
): Promise<Item[]> {
  const words: Item[] = await getItemsRepository(db, uid, languageID);
  sortItemsByProgress(words);
  return addAudioPathsToWords(words);
}

/**
 * Updates the user's word progress in the PostgreSQL database and returns the updated score.
 */
export async function patchItemsService(
  db: PostgresClient,
  uid: string,
  items: Item[],
  onBlockEnd: boolean,
  languageID: number
): Promise<UserScore[]> {
  await updateUserItemsRepository(db, uid, items);
  if (onBlockEnd) {
    await updateUserScoreRepository(db, uid, languageID);
  }
  return await getScoreRepository(db, uid);
}

/**
 * Gets ItemInfo for given item ID from the database.
 */
export async function getItemInfoService(
  db: PostgresClient,
  itemId: number
): Promise<BlockExplanation[]> {
  const itemInfo: BlockExplanation[] = await getItemInfoRepository(db, itemId);

  if (!itemInfo || itemInfo.length === 0) {
    throw new Error(`No item info found for itemId: ${itemId}`);
  }

  return itemInfo;
}

/**
 * Updates the user's word progress in the PostgreSQL database and returns the updated score.
 */
export async function resetItemService(
  db: PostgresClient,
  uid: string,
  itemID: number
): Promise<UserScore[]> {
  await resetItemRepository(db, uid, itemID);
  return await getScoreRepository(db, uid);
}
