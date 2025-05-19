/**
 * Alternates the direction of the words based on their progress. CZ -> EN is even, EN -> CZ is odd.
 */
export function alternateDirection(progress: number) {
  return progress % 2 === 0;
}
