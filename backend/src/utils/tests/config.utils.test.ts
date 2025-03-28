import { describe, it, expect, beforeEach } from 'vitest';
import { convertSRSToSeconds } from '../config.utils';

describe('convertToSeconds function', () => {
  
  it('should convert string intervals to seconds correctly', () => {
    const srs = ["0m", "5m", "15m", "30m", "1h", "2h", "4h", "8h", "12h", "1d", "2d", "3d", "4d", "6d", "8d", "12d", "16d", "20d", "30d", "40d"];
    const expected = [
      0, 300, 900, 1800, 3600, 7200, 14400, 28800, 43200, 86400, 172800, 259200, 345600, 518400, 
      691200, 1036800, 1382400, 1728000, 2592000, 3456000
    ];    

    const result = convertSRSToSeconds(srs);
    expect(result).toEqual(expected);
  });

  it('should throw Error for format without units', () => {
    const srs = ["2"];

    expect(() => convertSRSToSeconds(srs)).toThrow(Error);
  });

  it('should throw Error for incorrect units', () => {
    const srs = ["0t"];

    expect(() => convertSRSToSeconds(srs)).toThrow(Error);
  });

  it('should throw Error for strings', () => {
    const srs = ["hello"];

    expect(() => convertSRSToSeconds(srs)).toThrow(Error);
  });

  it('should throw Error for empty value', () => {
    const srs = [""];

    expect(() => convertSRSToSeconds(srs)).toThrow(Error);
  });

  it('should throw Error for no number', () => {
    const srs = ["m"];

    expect(() => convertSRSToSeconds(srs)).toThrow(Error);
  });
});
