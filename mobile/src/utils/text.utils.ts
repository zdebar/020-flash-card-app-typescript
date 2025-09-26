/**
 * Provides the correct Czech word for "more" based on the count.
 * @param count
 * @returns
 */
export function getMoreText(count: number): string {
  if (count <= 4) return `další`;
  return `dalších`;
}
