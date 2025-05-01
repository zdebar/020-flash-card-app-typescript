import { PostgresClient } from "../types/dataTypes";
import {
  WordProgress,
  UserScore,
  Word,
  GrammarLecture,
  PronunciationLecture,
  GrammarProgress,
} from "../../../shared/types/dataTypes";
import {
  getWordsRepository,
  updateWordsRepository,
  getScoreRepository,
  getGrammarRepository,
  getPronunciationRepository,
  updateGrammarRepository,
} from "../repository/practice.repository.postgres";
import { addAudioPath } from "../utils/update.utils";

/**
 * Gets a list of words for a given user and language ID from the database.
 */
export async function getWordsService(
  db: PostgresClient,
  uid: string
): Promise<Word[]> {
  const words: Word[] = await getWordsRepository(db, uid);
  return words.map((word) => ({
    ...word,
    audio: addAudioPath(word.audio),
  }));
}

/**
 * Updates the user's word progress in the PostgreSQL database and returns the updated score.
 */
export async function updateWordsService(
  db: PostgresClient,
  uid: string,
  words: WordProgress[]
): Promise<UserScore> {
  await updateWordsRepository(db, uid, words);
  return await getScoreRepository(db, uid);
}

/**
 * Gets a list of words for a given user and language ID from the database.
 */
export async function getGrammarService(
  db: PostgresClient,
  uid: string
): Promise<GrammarLecture | null> {
  const grammar: GrammarLecture | null = await getGrammarRepository(db, uid);

  if (!grammar) {
    return null;
  }

  const grammarWithPaths = {
    ...grammar,
    items: grammar.items.map((word) => ({
      ...word,
      audio: addAudioPath(word.audio),
    })),
  };
  return grammarWithPaths;
}

/**
 * Updates the user's grammar progress in the PostgreSQL database and returns the updated score.
 */
export async function updateGrammarService(
  db: PostgresClient,
  uid: string,
  progress: GrammarProgress
): Promise<UserScore> {
  await updateGrammarRepository(db, uid, progress);
  return await getScoreRepository(db, uid);
}

/**
 * Gets the pronunciation lecture for a given block ID from the database.
 */
export async function getPronunciationService(
  db: PostgresClient,
  block_id: number
): Promise<PronunciationLecture> {
  const pronunciation: PronunciationLecture = await getPronunciationRepository(
    db,
    block_id
  );

  const pronunciationWithPaths = {
    ...pronunciation,
    items: pronunciation.items.map((group) =>
      group.map((word) => ({
        ...word,
        audio: addAudioPath(word.audio),
      }))
    ),
  };
  return pronunciationWithPaths;
}
