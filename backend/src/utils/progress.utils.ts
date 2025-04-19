import config from "../config/config";
import { Word } from "../types/dataTypes";

/**
 * Returns the next review date based on the progress and SRS intervals.
 */
export function getNextAt(progress: number): string | null {
  const interval = config.SRS[progress - 1] ?? null;
  if (interval) {
    return new Date(Date.now() + interval * 1000).toISOString();
  }
  return null;
}

/**
 * Returns the learned date if the progress is equal to the learnedAt threshold.
 */
export function getLearnedAt(progress: number): string | null {
  if (progress === config.learnedAt) {
    return new Date(Date.now()).toISOString();
  }
  return null;
}

/**
 * Returns the mastered date if the progress is equal to the masteredAt threshold.
 */
export function getMasteredAt(progress: number): string | null {
  if (progress >= config.SRS.length) {
    return new Date(Date.now()).toISOString();
  }
  return null;
}

/**
 * Adds audio file paths to a list of words based on the language ID.
 */
export function addAudioPathsToWords(words: Word[]): Word[] {
  return words.map((word: Word) => ({
    ...word,
    audio: `/${word.audio}.opus`,
  }));
}
