import { Item } from '../../../shared/types/dataTypes';

/**
 * Alternates the direction of the words based on their progress. CZ -> EN is even, EN -> CZ is odd.
 */
export function alternateDirection(item: Item) {
  return item?.progress % 2 === 0;
}
