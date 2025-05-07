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

/**
 * Updates the progress of a word in the word array.
 */
export function updateItemObject(
  wordArray: Item[],
  currentIndex: number,
  progressIncrement: number,
  skipped: boolean
): Item[] {
  const updatedProgress = Math.max(
    wordArray[currentIndex].progress + progressIncrement,
    0
  );

  const updatedWordArray = [...wordArray];
  updatedWordArray[currentIndex] = {
    ...updatedWordArray[currentIndex],
    progress: updatedProgress,
    skipped: skipped,
  };

  return updatedWordArray;
}
