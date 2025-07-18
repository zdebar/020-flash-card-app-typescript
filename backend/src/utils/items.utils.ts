import { Item } from "../../../shared/types/dataTypes";

export default function sortItemsByProgress(items: Item[]): Item[] {
  try {
    // Sorts items even first, then odd items. Gives better user experience.
    return items.sort((a, b) => {
      const isEvenA = a.progress % 2 === 0;
      const isEvenB = b.progress % 2 === 0;
      if (isEvenA && !isEvenB) return -1;
      if (!isEvenA && isEvenB) return 1;
      return 0;
    });
  } catch (error) {
    throw new Error(`Error in sortItemsByProgress: ${(error as any).message}`);
  }
}
