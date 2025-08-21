import { PostgresClient } from "../types/dataTypes";
import {
  UserScore,
  Item,
  BlockExplanation,
} from "../../../shared/types/dataTypes";
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
  getScoreRepository,
  updateUserScoreRepository,
} from "../repository/user.repository.postgres";
import { addAudioSuffixToItems, formatDatesShort } from "../utils/update.utils";
import sortItemsEvenOdd from "../utils/items.utils";
import { getNextAt, getDateAt } from "../utils/update.utils";
import config from "../config/config";

/**
 * Gets practice items for a given user and language ID from the database.
 */
export async function getPracticeItemsService(
  db: PostgresClient,
  uid: string,
  languageId: number
): Promise<Item[]> {
  let items: Item[] = await getPracticeBlockRepository(db, uid, languageId);

  if (items.length === 0) {
    items = await getPracticeItemsRepository(db, uid, languageId);
    sortItemsEvenOdd(items);
  }

  return addAudioSuffixToItems(items);
}

/**
 * Gets a list of words for a given user and language ID from the database.
 */
export async function getItemsListService(
  db: PostgresClient,
  uid: string,
  languageId: number
): Promise<Item[]> {
  const words: Item[] = await getUserItemsListRepository(db, uid, languageId);
  formatDatesShort(words);
  return addAudioSuffixToItems(words);
}

/**
 * Updates the user's word progress in the PostgreSQL database and returns the updated score.
 */
export async function updateUserPracticeService(
  db: PostgresClient,
  uid: string,
  items: Item[],
  onRoundEnd: boolean,
  languageId: number
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

  if (onRoundEnd) {
    await updateUserScoreRepository(db, uid, languageId);
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
  itemId: number
): Promise<UserScore[]> {
  await resetItemRepository(db, uid, itemId);
  return await getScoreRepository(db, uid);
}
