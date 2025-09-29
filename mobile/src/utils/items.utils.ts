import { Item } from "../../../shared/types/dataTypes";

/**
 * Sort items by even and odd progress.
 * @param items
 * @returns
 */
export default function sortItemsEvenOdd(items: Item[]): Item[] {
  try {
    return items.sort((a, b) => {
      const isEvenA = a.progress % 2 === 0;
      const isEvenB = b.progress % 2 === 0;
      if (isEvenA && !isEvenB) return -1;
      if (!isEvenA && isEvenB) return 1;
      return 0;
    });
  } catch (error) {
    throw new Error(`Error in sortItemsEvenOdd: ${(error as any).message}`);
  }
}
