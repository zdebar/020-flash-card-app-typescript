import { PostgresClient } from "../types/dataTypes";
import { OverviewItem } from "../../../shared/types/dataTypes";
import { addAudioPath } from "../utils/update.utils";
import {
  getOverviewSentencesRepository,
  getOverviewWordsRepository,
} from "../repository/overview.repository.postgres";

/**
 * Gets a list of words for a given user and language ID from the database.
 */
export async function getOverviewWordsService(
  db: PostgresClient,
  uid: string,
  limit: number,
  offset: number
): Promise<OverviewItem[]> {
  const words: OverviewItem[] = await getOverviewWordsRepository(
    db,
    uid,
    limit,
    offset
  );
  return words.map((word) => ({
    ...word,
    audio: addAudioPath(word.audio),
  }));
}

/**
 * Gets a list of sentences for a given user and language ID from the database.
 */
export async function getOverviewSentencesService(
  db: PostgresClient,
  uid: string,
  limit: number,
  offset: number
): Promise<OverviewItem[]> {
  const words: OverviewItem[] = await getOverviewSentencesRepository(
    db,
    uid,
    limit,
    offset
  );
  return words.map((word) => ({
    ...word,
    audio: addAudioPath(word.audio),
  }));
}
