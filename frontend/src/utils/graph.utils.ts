import config from '../config/config';

const COLORS = config.colors;

export function getBarColor(level: number) {
  if (level <= 5) return COLORS[0];
  if (level <= 10) return COLORS[1];
  if (level <= 15) return COLORS[2];
  return COLORS[3];
}
