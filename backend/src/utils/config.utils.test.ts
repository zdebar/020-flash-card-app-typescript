import { describe, it, expect } from 'vitest';
import { convertSRSToSeconds } from './config.utils';

describe('convertToSeconds function', () => {
  it('should convert string intervals to seconds correctly', () => {
    const srs = ["0", "5m", "15m", "30m", "1h", "2h", "4h", "8h", "12h", "1d", "2", "3d", "4d", "6d", "8d", "12d", "16d", "20d", "30d", "40d"];
    
    const expected = [
      0, 300, 900, 1800, 3600, 7200, 14400, 28800, 43200, 86400, 2, 259200, 345600, 518400, 
      691200, 1036800, 1382400, 1728000, 2592000, 3456000
    ];

    const result = convertSRSToSeconds(srs);

    expect(result).toEqual(expected);
  });

  it('should handle single values without units as seconds', () => {
    const srs = ["2", "100", "500"];
    const expected = [2, 100, 500];

    const result = convertSRSToSeconds(srs);

    expect(result).toEqual(expected);
  });

  it('should handle edge case for "0" correctly', () => {
    const srs = ["0"];
    const expected = [0];

    const result = convertSRSToSeconds(srs);

    expect(result).toEqual(expected);
  });

  it('should handle invalid format gracefully', () => {
    const srs = ["1x", "5z", "hello"];
    const expected: number[] = [];

    const result = convertSRSToSeconds(srs);

    expect(result).toEqual(expected);
  });
});
