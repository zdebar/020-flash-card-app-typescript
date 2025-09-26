/**
 * Determines if the practice direction is Czech to English based on progress. Odd progress means EN -> CZ, even means CZ -> EN.
 * @param progress - The progress value.
 * @returns True if direction is CZ -> EN, false otherwise.
 */
export function isCzechToEnglish(progress: number): boolean {
  return progress % 2 === 0;
}
