import {
  UserScore,
  Item,
  BlockExplanation,
} from "../../../shared/types/dataTypes";
import { SQLiteDatabase } from "expo-sqlite";
import {
  getPracticeItemsRepository,
  updateUserItemsRepository,
  getItemInfoRepository,
  resetItemRepository,
  getUserItemsListRepository,
  getPracticeBlockRepository,
  updateUserBlockRepository,
} from "../repository/items.repository.postgres";
import {
  getUserScoreRepository,
  updateUserScoreRepository,
} from "../repository/user.repository.postgres";
import { addAudioSuffixToItems } from "../utils/update.utils";
import sortItemsEvenOdd from "../utils/items.utils";
import { getNextAt, getDateAt } from "../utils/update.utils";
import config from "../config/config";

/**
 * Gets practice items for a given user and language ID from the database.
 */
export async function getPracticeItemsService(
  db: SQLiteDatabase,
  uid: string
): Promise<Item[]> {
  let items: Item[] = await getPracticeBlockItemsRepository(db, uid);

  if (items.length === 0) {
    items = await getPracticeItemsRepository(db, uid);
    sortItemsEvenOdd(items);
  }

  return addAudioSuffixToItems(items);
}

/**
 * Gets a list of words for a given user and language ID from the database.
 */
export async function getUserItemsListService(
  db: SQLiteDatabase,
  uid: string
): Promise<Item[]> {
  const words: Item[] = await getUserItemsListRepository(db, uid);
  return addAudioSuffixToItems(words);
}

/**
 * Updates the user's word progress in the PostgreSQL database and returns the updated score.
 */
export async function updateUserPracticeService(
  db: SQLiteDatabase,
  uid: string,
  items: Item[],
  onPracticeBlockEnd: boolean
): Promise<UserScore[]> {
  const blockId = items[0]?.blockId;
  let finishedAt = null;

  if (blockId) {
    const progress =
      items.length > 0 ? Math.min(...items.map((item) => item.progress)) : 0;
    const nextAt = getNextAt(progress);
    finishedAt = getDateAt(progress, config.finishedProgress);

    console.log(
      `Updating block ${blockId} with progress ${progress}, nextAt ${nextAt}, finishedAt ${finishedAt}`
    );

    await updateUserBlockRepository(
      db,
      uid,
      blockId,
      progress,
      nextAt,
      finishedAt
    );
  }

  if (!blockId || finishedAt) {
    const itemIds = items.map((item) => item.id);
    const progresses = items.map((item) => item.progress);
    const nextAt = items.map((item) => getNextAt(item.progress));
    const learnedAt = items.map((item) =>
      getDateAt(item.progress, config.learnedProgress)
    );
    const masteredAt = items.map((item) =>
      getDateAt(item.progress, config.SRS.length)
    );

    await updateUserItemsRepository(
      db,
      uid,
      itemIds,
      progresses,
      nextAt,
      learnedAt,
      masteredAt
    );
  }

  if (onPracticeBlockEnd) {
    await updateUserScoreRepository(db, uid, languageId);
  }

  return await getUserScoreRepository(db, uid);
}

/**
 * Gets ItemInfo for given item ID from the database.
 */
export async function getItemInfoService(
  db: SQLiteDatabase,
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
  db: SQLiteDatabase,
  uid: string,
  itemId: number
): Promise<UserScore[]> {
  await resetItemRepository(db, uid, itemId);
  return await getUserScoreRepository(db, uid);
}
