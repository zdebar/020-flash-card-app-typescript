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
  getWords,
  updateWords,
  getScore,
  getGrammar,
  getPronunciation,
  updateGrammar,
} from "../repository/practice.repository.postgres";
import { addAudioPath } from "../utils/update.utils";

/**
 * Gets a list of words for a given user and language ID from the database.
 */
export async function getWordsService(
  db: PostgresClient,
  uid: string
): Promise<Word[]> {
  const words: Word[] = await getWords(db, uid);
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
  await updateWords(db, uid, words);
  return await getScore(db, uid);
}

/**
 * Gets a list of words for a given user and language ID from the database.
 */
export async function getGrammarService(
  db: PostgresClient,
  uid: string
): Promise<GrammarLecture | null> {
  const grammar: GrammarLecture | null = await getGrammar(db, uid);

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

export async function updateGrammarService(
  db: PostgresClient,
  uid: string,
  progress: GrammarProgress
): Promise<UserScore> {
  await updateGrammar(db, uid, progress);
  return await getScore(db, uid);
}

export async function getPronunciationService(
  db: PostgresClient,
  block_id: number
): Promise<PronunciationLecture> {
  const pronunciation: PronunciationLecture = await getPronunciation(
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
