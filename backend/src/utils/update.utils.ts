import config from "../config/config";

/**
 * Returns the next review date based on the progress and SRS intervals.
 */
export function getNextAt(progress: number): string {
  const interval = config.SRS[progress] || 0;
  const randomFactor =
    1 + (Math.random() * 2 * config.srsRandomness - config.srsRandomness);
  const randomizedInterval = Math.round(interval * randomFactor);
  return new Date(Date.now() + randomizedInterval * 1000).toISOString();
}

/**
 * Returns the learnedAt date if the progress is equal to the learnedAt threshold.
 */
export function getLearnedAt(progress: number): string | null {
  if (progress >= config.learnedProgress) {
    return new Date(Date.now()).toISOString();
  }
  return null;
}

/**
 * Returns the mastered date if the progress is equal to the masteredAt threshold.
 */
export function getMasteredAt(progress: number): string | null {
  if (progress >= config.SRS.length) {
    return new Date(Date.now()).toISOString();
  }
  return null;
}

/**
 * Adds an audio file path to a word object based on the language ID.
 */
export function addAudioPath(audio: string | null): string | null {
  return audio ? `${audio}.opus` : null;
}
