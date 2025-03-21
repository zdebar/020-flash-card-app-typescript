import { describe, it, expect, vi, Mock } from 'vitest';
import { getNewWords, getWordsAlreadyPracticed, getUserWords, updateUserWords } from '../services/word.service';
import { queryDatabase, executeQuery } from '../utils/db.utils';
import sqlite3 from 'sqlite3';

// Mocking the database utility functions
vi.mock('../utils/db.utils', () => ({
  queryDatabase: vi.fn(),
  executeQuery: vi.fn(),
}));

// Sample data
const mockUserId = 1;
const mockLanguage = 'en';
const mockBlock = 5;

describe('Word Service Functions', () => {

  it('should return new words from the database', async () => {
    const mockRows = [
      { word_id: 1, src: 'cat', trg: 'gato', prn: 'kat', language: 'en', audio: 'cat.mp3' },
      { word_id: 2, src: 'dog', trg: 'perro', prn: 'dog', language: 'en', audio: 'dog.mp3' },
    ];

    // Mock queryDatabase to return mockRows
    (queryDatabase as Mock).mockResolvedValue(mockRows);

    const words = await getNewWords({} as sqlite3.Database, mockUserId, mockLanguage, 2);

    expect(words).toHaveLength(2);
    expect(words[0].src).toBe('cat');
    expect(words[1].src).toBe('dog');
  });

  it('should return already practiced words from the database', async () => {
    const mockRows = [
      { word_id: 1, src: 'cat', trg: 'gato', prn: 'kat', audio: 'cat.mp3', progress: 1 },
      { word_id: 2, src: 'dog', trg: 'perro', prn: 'dog', audio: 'dog.mp3', progress: 1 },
    ];

    // Mock queryDatabase to return mockRows
    (queryDatabase as Mock).mockResolvedValue(mockRows);

    const words = await getWordsAlreadyPracticed({} as sqlite3.Database, mockUserId, mockLanguage, mockBlock);

    expect(words).toHaveLength(2);
    expect(words[0].src).toBe('cat');
    expect(words[1].src).toBe('dog');
  });

  it('should return a combination of practiced and new words', async () => {
    const mockPracticedWords = [
      { word_id: 1, src: 'cat', trg: 'gato', prn: 'kat', audio: 'cat.mp3', progress: 1 },
    ];
    const mockNewWords = [
      { word_id: 2, src: 'dog', trg: 'perro', prn: 'dog', audio: 'dog.mp3' },
    ];

    (queryDatabase as Mock).mockResolvedValueOnce(mockPracticedWords); // First query for practiced words
    (queryDatabase as Mock).mockResolvedValueOnce(mockNewWords); // Second query for new words

    const words = await getUserWords({} as sqlite3.Database, mockUserId, mockLanguage, mockBlock);

    expect(words).toHaveLength(2);
    expect(words[0].src).toBe('dog');
    expect(words[1].src).toBe('cat');
  });

  it('should handle errors during getNewWords', async () => {
    (queryDatabase as Mock).mockRejectedValueOnce(new Error('Database error'));

    try {
      await getNewWords({} as sqlite3.Database, mockUserId, mockLanguage, 2);
    } catch (err: any) {
      expect(err.message).toBe('Failed to get new words: Database error');
    }
  });

  it('should update user words correctly', async () => {
    const mockWords = [
      { word_id: 1, src: 'cat', trg: 'gato', prn: 'kat', audio: 'cat.mp3', progress: 0 },
      { word_id: 2, src: 'dog', trg: 'perro', prn: 'dog', audio: 'dog.mp3', progress: 1 },
    ];
    const mockSRS = [1, 2, 3];

    (executeQuery as Mock).mockResolvedValueOnce(undefined);

    await updateUserWords({} as sqlite3.Database, mockUserId, mockWords, mockSRS);

    expect(executeQuery).toHaveBeenCalledTimes(2); // One for each word
  });

  it('should handle errors during updateUserWords', async () => {
    const mockWords = [
      { word_id: 1, src: 'cat', trg: 'gato', prn: 'kat', audio: 'cat.mp3', progress: 0 },
    ];
    const mockSRS = [1, 2, 3];

    (executeQuery as Mock).mockRejectedValueOnce(new Error('Failed to update user words'));

    try {
      await updateUserWords({} as sqlite3.Database, mockUserId, mockWords, mockSRS);
    } catch (err: any) {
      expect(err.message).toBe('Error updating user_words: Failed to update user words');
    }
  });

});
