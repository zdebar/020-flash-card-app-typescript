import config from "../config/config";

export function getNextAt(progress: number = 1): string | null {
  const interval = config.SRS[progress - 1] ?? null;
  if (interval) {
    return new Date(Date.now() + interval * 1000).toISOString();
  }
  return null;
}

export function getLearnedAt(progress: number = 1): string | null {
  if (progress === config.learnedAt) {
    return new Date(Date.now()).toISOString();
  }
  return null;
}

export function getMasteredAt(progress: number = 1): string | null {
  if (progress >= config.masteredAt) {
    return new Date(Date.now()).toISOString();
  }
  return null;
}
