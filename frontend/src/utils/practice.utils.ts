import { Item } from '../../../shared/types/dataTypes';

/**
 * Alternates the direction of the words based on their progress. CZ -> EN is even, EN -> CZ is odd.
 */
export function alternateDirection(words: Item[], index: number = 0) {
  return words[index]?.progress % 2 === 0;
}
