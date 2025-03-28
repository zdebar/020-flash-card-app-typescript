import dotenv from 'dotenv';
import path from 'path';
import { describe, it, expect, vi } from 'vitest';
import { SRS } from './config';

describe('Environment Configuration', () => {
  it('should correctly resolve the path to the .env file', () => {
    const envPath = path.resolve(__dirname, "../../.env");
    expect(envPath).toBeTruthy();
  });

  it('should load environment variables correctly', () => {
    dotenv.config({ path: path.resolve(__dirname, "../../.env") });
    expect(process.env.JWT_SECRET).toBeDefined();
    expect(process.env.JWT_EXPIRES_IN).toBeDefined();
  });
  
  it('should be an array of numbers', () => {
    expect(Array.isArray(SRS)).toBe(true);
    SRS.forEach((item) => {
      expect(typeof item).toBe('number');
    });
  });
});
