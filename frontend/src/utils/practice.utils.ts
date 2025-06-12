import languageLevelsConfig from '../config/languageLevels.config';

/**
 * Alternates the direction of the words based on their progress.
 * @param progress - The progress value.
 * @returns True if direction is CZ -> EN, false otherwise.
 */
export function alternateDirection(progress: number): boolean {
  return progress % 2 === 0;
}

/**
 * Determines the active language level and its threshold difference.
 * @param learned - The number of learned items.
 * @returns An object containing the level, threshold difference, words not learned today, and words learned today.
 */
export function getActiveLanguageLevel(
  learned: number,
  learnedToday: number
): {
  level: string;
  thresholdDifference: number;
  wordsNotToday: number;
  wordsToday: number;
} {
  const learnedNotToday = learned - learnedToday;

  for (let i = 0; i < languageLevelsConfig.length; i++) {
    if (learned < languageLevelsConfig[i].threshold) {
      const lowerThreshold = languageLevelsConfig[i - 1]?.threshold || 0;
      let wordsNotToday = learnedNotToday - lowerThreshold;
      let wordsToday = learnedToday;

      if (wordsNotToday < 0) {
        wordsToday = learnedToday + wordsNotToday;
        wordsNotToday = 0;
      }

      return {
        level: languageLevelsConfig[i].level,
        thresholdDifference: languageLevelsConfig[i].threshold - lowerThreshold,
        wordsNotToday,
        wordsToday,
      };
    }
  }

  // If learned exceeds the highest threshold, return the last level
  const lastItem = languageLevelsConfig[languageLevelsConfig.length - 1];
  const beforeLastItem = languageLevelsConfig[languageLevelsConfig.length - 2];
  const thresholdDifference = lastItem.threshold - beforeLastItem.threshold;

  return {
    level: lastItem.level,
    thresholdDifference: thresholdDifference,
    wordsNotToday: thresholdDifference,
    wordsToday: 0,
  };
}
