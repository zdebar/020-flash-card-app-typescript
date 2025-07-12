import { PostgresClient } from "../types/dataTypes";
import {
  UserScore,
  Item,
  BlockExplanation,
} from "../../../shared/types/dataTypes";
import {
  getItemsRepository,
  patchItemsRepository,
  getScoreRepository,
  getItemInfoRepository,
  getGrammarBlockRepository,
} from "../repository/items.repository.postgres";
import { addAudioPath, addAudioPathsToWords } from "../utils/update.utils";
import sortItemsByProgress from "../utils/items.utils";

/**
 * Gets a list of words for a given user and language ID from the database.
 */
export async function getItemsService(
  db: PostgresClient,
  uid: string,
  languageID: number
): Promise<Item[]> {
  let words: Item[] = await getItemsRepository(db, uid, languageID);
  let foundNewGrammar = false;
  let grammarWords: Item[] = [];

  for (const word of words) {
    if (word.showContextInfo) {
      grammarWords = await getGrammarBlockRepository(db, uid, word.id);
      foundNewGrammar = true;
      break;
    }
  }

  if (!foundNewGrammar) {
    sortItemsByProgress(words);
  } else {
    words = grammarWords;
  }

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
  await patchItemsRepository(db, uid, items, onBlockEnd, languageID);
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
