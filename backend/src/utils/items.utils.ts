import { Item } from "../../../shared/types/dataTypes";

export default function sortItemsByProgress(items: Item[]): Item[] {
  try {
    // Sorts items even first, then odd items. Stable sort by original index.
    return items
      .map((item, idx) => ({ item, idx }))
      .sort((a, b) => {
        const isEvenA = a.item.progress % 2 === 0;
        const isEvenB = b.item.progress % 2 === 0;
        if (isEvenA && !isEvenB) return -1;
        if (!isEvenA && isEvenB) return 1;
        // Stable: fallback to original index
        return a.idx - b.idx;
      })
      .map(({ item }) => item);
  } catch (error) {
    throw new Error(`Error in sortItemsByProgress: ${(error as any).message}`);
  }
}
