import { WordProgress } from '../../../shared/types/dataTypes';
import { fetchWithAuth } from './firebase.utils';
import { UserScore } from '../../../shared/types/dataTypes';

export async function patchWords(
  words: WordProgress[],
  patchPath: string
): Promise<UserScore | null> {
  try {
    const response = await fetchWithAuth(patchPath, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(words),
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
      return data.score;
    } catch {
      console.warn('Response succeeded, but data could not be parsed.');
      return null;
    }
  } catch (error) {
    console.error('Error posting words:', error);
    return null;
  }
}
