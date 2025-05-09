import { Item, ItemProgress } from '../../../shared/types/dataTypes';

/**
 * Alternates the direction of the words based on their progress. CZ -> EN is even, EN -> CZ is odd.
 */
export function alternateDirection(words: Item[], index: number = 0) {
  return words[index]?.progress % 2 === 0;
}

/**
 * Converts an array of Word objects to an array of objects containing only the id, progress, and skipped properties.
 */
export function convertToItemProgress(words: Item[]): ItemProgress[] {
  return words.map((word) => ({
    id: word.id,
    progress: word.progress,
    skipped: word.skipped,
  }));
}
