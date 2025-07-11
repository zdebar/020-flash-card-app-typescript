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
import { addAudioPath } from "../utils/update.utils";
import sortItemsByProgress from "../utils/items.utils";

/**
 * Gets a list of words for a given user and language ID from the database.
 */
export async function getItemsService(
  db: PostgresClient,
  uid: string,
  languageID: number
): Promise<Item[]> {
  try {
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

    return words.map((word) => ({
      ...word,
      audio: addAudioPath(word.audio),
    }));
  } catch (error) {
    throw new Error(
      `Error in getItemsService: ${
        (error as any).message
      } | uid: ${uid} | languageID: ${languageID}`
    );
  }
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
  try {
    await patchItemsRepository(db, uid, items, onBlockEnd, languageID);
    return await getScoreRepository(db, uid);
  } catch (error) {
    throw new Error(
      `Error in patchItemsService: ${
        (error as any).message
      } | uid: ${uid} | items: ${JSON.stringify(
        items
      )} | onBlockEnd: ${onBlockEnd} | languageID: ${languageID}`
    );
  }
}

/**
 * Gets ItemInfo for given item ID from the database.
 */
export async function getItemInfoService(
  db: PostgresClient,
  itemId: number
): Promise<BlockExplanation[]> {
  try {
    const itemInfo: BlockExplanation[] = await getItemInfoRepository(
      db,
      itemId
    );

    if (!itemInfo || itemInfo.length === 0) {
      throw new Error(`No item info found for itemId: ${itemId}`);
    }

    return itemInfo;
  } catch (error) {
    throw new Error(
      `Error in getItemInfoService: ${
        (error as any).message
      } | itemId: ${itemId}`
    );
  }
}
