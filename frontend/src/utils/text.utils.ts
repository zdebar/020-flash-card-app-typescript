/**
 * Utility functions for text manipulation.
 * @param count
 * @returns
 */
export function getMoreText(count: number): string {
  if (count <= 4) return `další`;
  return `dalších`;
}
