import config from "../config/config";
import { Item } from "../../../shared/types/dataTypes";

/**
 * Returns the next review date based on the progress and SRS intervals.
 */
export function getNextAt(progress: number): string | null {
  try {
    const interval = config.SRS[progress];
    if (interval === undefined) return null;

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
export function getDateAt(progress: number, threshold: number): string | null {
  try {
    if (progress >= threshold) {
      return new Date(Date.now()).toISOString();
    }
    return null;
  } catch (error) {
    throw new Error(
      `Error in getDateAt: ${
        (error as any).message
      } | progress: ${progress} | threshold: ${threshold}`
    );
  }
}

/**
 * Adds an audio file suffix (.opus) to a word object.
 */
export function addOpusSuffix(audio: string | null): string | null {
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
 * @param items - Array of Item objects.
 * @returns Array of Item objects with updated audio paths.
 */
export function addAudioSuffixToItems(items: Item[]): Item[] {
  return items.map((item) => ({
    ...item,
    audio: addOpusSuffix(item.audio),
  }));
}

/**
 * Converts an ISO date string to a shorter format (YYYY-MM-DD).
 * @param isoDate - The ISO date string to format.
 * @returns The formatted date string.
 */
export function formatDateShort(isoDate: string): string {
  try {
    return new Date(isoDate).toISOString().split("T")[0];
  } catch (error) {
    throw new Error(
      `Error in formatDateShort: ${
        (error as any).message
      } | isoDate: ${isoDate}`
    );
  }
}

/**
 * Converts Array of Items ISO date string to a shorter format (YYYY-MM-DD).
 * @param items - Array of Item objects.
 */
export function formatDatesShort(items: Item[]): void {
  items.forEach((item) => {
    item.nextDate = item.nextDate ? formatDateShort(item.nextDate) : null;
    item.learnedDate = item.learnedDate
      ? formatDateShort(item.learnedDate)
      : null;
    item.masteredDate = item.masteredDate
      ? formatDateShort(item.masteredDate)
      : null;
  });
}
