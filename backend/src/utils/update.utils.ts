import config from "../config/config";
import { Item } from "../../../shared/types/dataTypes";

/**
 * Returns the next review date based on the progress and SRS intervals.
 */
export function getNextAt(progress: number): string {
  try {
    const interval = config.SRS[progress] || 0;
    const randomFactor =
      1 + (Math.random() * 2 * config.srsRandomness - config.srsRandomness);
    const randomizedInterval = Math.round(interval * randomFactor);
    return new Date(Date.now() + randomizedInterval * 1000).toISOString();
  } catch (error) {
    throw new Error(
      `Error in getNextAt: ${(error as any).message} | progress: ${progress}`
    );
  }
}

/**
 * Returns the learnedAt date if the progress is equal to the learnedAt threshold.
 */
export function getLearnedAt(progress: number): string | null {
  try {
    if (progress >= config.learnedProgress) {
      return new Date(Date.now()).toISOString();
    }
    return null;
  } catch (error) {
    throw new Error(
      `Error in getLearnedAt: ${(error as any).message} | progress: ${progress}`
    );
  }
}

/**
 * Returns the mastered date if the progress is equal to the masteredAt threshold.
 */
export function getMasteredAt(progress: number): string | null {
  try {
    if (progress >= config.SRS.length) {
      return new Date(Date.now()).toISOString();
    }
    return null;
  } catch (error) {
    throw new Error(
      `Error in getMasteredAt: ${
        (error as any).message
      } | progress: ${progress}`
    );
  }
}

/**
 * Adds an audio file path to a word object based on the language ID.
 */
export function addAudioPath(audio: string | null): string | null {
  try {
    return audio ? `${audio}.opus` : null;
  } catch (error) {
    throw new Error(
      `Error in addAudioPath: ${(error as any).message} | audio: ${audio}`
    );
  }
}

/**
 * Adds audio paths to a list of words.
 * @param words - Array of Item objects.
 * @returns Array of Item objects with updated audio paths.
 */
export function addAudioPathsToWords(words: Item[]): Item[] {
  return words.map((word) => ({
    ...word,
    audio: addAudioPath(word.audio),
  }));
}
