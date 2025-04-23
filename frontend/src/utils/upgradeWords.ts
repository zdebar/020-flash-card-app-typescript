import { WordProgress } from '../../../shared/types/dataTypes';

export async function upgradeWords(words: WordProgress[]): Promise<boolean> {
  const API_PATH = `http://localhost:3000/api/words`;

  try {
    const response = await fetch(API_PATH, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ words }),
      credentials: 'include',
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Unauthorized. Please log in again.');
      }

      try {
        const errorData = await response.json();
        throw new Error(errorData.message || 'An error occurred.');
      } catch {
        throw new Error('Failed to parse error response.');
      }
    }

    try {
      const data = await response.json();
      console.log('Words upgraded successfully:', data);
      return true;
    } catch {
      console.warn('Upgrade succeeded, but response could not be parsed.');
      return true;
    }
  } catch (error) {
    console.error('Error posting upgrade words:', error);
    return false;
  }
}
