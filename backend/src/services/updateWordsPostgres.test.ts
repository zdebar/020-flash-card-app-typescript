import { describe, it, expect, beforeAll, afterAll, vi } from 'vitest';
import { Client } from 'pg';
import { updateWordsPostgres } from './word.service.postgres'; 
import { SRS } from '../config/config';

const mockWords = [
  { id: 1, progress: 0, src: "", trg: "", prn: "", audio: "" },
  { id: 2, progress: 1, src: "", trg: "", prn: "", audio: "" },
  { id: 3, progress: 2, src: "", trg: "", prn: "", audio: "" }
];

const mockClient = {
  query: vi.fn(),
};

describe('updateWordsPostgres', () => {
  let originalDateNow: typeof Date.now;

  beforeAll(() => {
    originalDateNow = Date.now;
    vi.spyOn(Date, 'now').mockReturnValue(new Date('2025-03-27T00:00:00Z').getTime());
    mockClient.query.mockResolvedValueOnce({ rows: [] });
  });

  afterAll(() => {
    // Restore the original Date.now method
    vi.restoreAllMocks();
  });

  it('should update words in user_words table', async () => {
    const userId = 99;

    // Call the function
    await updateWordsPostgres(mockClient as unknown as Client, userId, mockWords);

    // Check if the query method was called with the correct parameters
    expect(mockClient.query).toHaveBeenCalledTimes(1);
    expect(mockClient.query).toHaveBeenCalledWith(
      expect.stringContaining('INSERT INTO user_words'),
      expect.arrayContaining([
        userId, 1, 1, expect.any(String), expect.any(String), null, // Progress 0 -> next_at calculated
        userId, 2, 1, expect.any(String), expect.any(String), null, // Progress 1 -> next_at calculated
        userId, 3, 2, expect.any(String), expect.any(String), null, // Progress 2 -> next_at calculated
      ])
    );
  });

  it('should handle errors correctly', async () => {
    mockClient.query.mockRejectedValueOnce(new Error('Test error'));

    const userId = 99;

    await expect(updateWordsPostgres(mockClient as unknown as Client, userId, mockWords))
      .rejects
      .toThrowError(Error);
  });

  it('should correctly calculate nextAt based on SRS intervals', async () => {
    const userId = 99;

    // Call the function
    await updateWordsPostgres(mockClient as unknown as Client, userId, mockWords);

    // Calculate expected `nextAt` based on `SRS` for progress 1 and 2
    const today = new Date('2025-03-27T00:00:00Z');
    const nextAt1 = new Date(today.getTime() + SRS[0] * 1000).toISOString();
    const nextAt2 = new Date(today.getTime() + SRS[0] * 1000).toISOString();
    const nextAt3 = new Date(today.getTime() + SRS[1] * 1000).toISOString();

    // Check that `nextAt` is calculated correctly
    expect(mockClient.query).toHaveBeenCalledWith(
      expect.stringContaining('INSERT INTO user_words'),
      expect.arrayContaining([
        userId, 1, 1, nextAt1, expect.any(String), null, // for progress 1 -> nextAt calculated
        userId, 2, 1, nextAt2, expect.any(String), null, // for progress 1 -> nextAt calculated
        userId, 3, 2, nextAt3, expect.any(String), null, // for progress 2 -> nextAt calculated
      ])
    );
  });

  it('should set learned_at when interval is null', async () => {
    const userId = 99;
  
    const mockWordsWithProgressZero = [{ id: 1, progress: 100, src: "", trg: "", prn: "", audio: "" }];
    await updateWordsPostgres(mockClient as unknown as Client, userId, mockWordsWithProgressZero);

    const today = new Date('2025-03-27T00:00:00Z');
    
    expect(mockClient.query).toHaveBeenCalledWith(
      expect.stringContaining('INSERT INTO user_words'),
      expect.arrayContaining([
        userId, 1, 1, expect.any(String), expect.any(String), today.toISOString(), // learned_at set to today
      ])
    );
  });
});
