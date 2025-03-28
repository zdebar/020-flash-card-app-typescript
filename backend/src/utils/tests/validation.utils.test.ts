import { describe, it, expect } from 'vitest';
import { parseAndValidateRequestValue } from '../validation.utils';

describe('parseAndValidateRequestValue', () => {
  it('should throw an error when value is null', () => {
    expect(() => parseAndValidateRequestValue(null, 'srcLanguage')).toThrow(Error);
  });

  it('should throw an error when value is undefined', () => {
    expect(() => parseAndValidateRequestValue(undefined, 'srcLanguage')).toThrow(Error);
  });

  it('should throw an error when value is not a valid number', () => {
    expect(() => parseAndValidateRequestValue('abc', 'srcLanguage')).toThrow(Error);
  });

  it('should throw an error when value is 0 or negative number', () => {
    expect(() => parseAndValidateRequestValue('0', 'srcLanguage')).toThrow(Error);
    expect(() => parseAndValidateRequestValue('-1', 'srcLanguage')).toThrow(Error);
  });

  it('should return the number when valid number is passed', () => {
    expect(parseAndValidateRequestValue('1', 'srcLanguage')).toBe(1);
    expect(parseAndValidateRequestValue('100', 'srcLanguage')).toBe(100);
  });
});
