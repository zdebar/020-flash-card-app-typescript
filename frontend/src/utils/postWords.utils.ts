import { WordProgress } from '../../../shared/types/dataTypes';
import { fetchWithAuth } from './firebase.utils';
import { UserScore } from '../../../shared/types/dataTypes';
import config from '../config/config';

export async function postWords(
  words: WordProgress[],
  setScore: (score: UserScore) => void
): Promise<boolean> {
  const API_PATH = `${config.Url}/api/words`;

  try {
    const response = await fetchWithAuth(API_PATH, {
      method: 'POST',
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

      if (data) {
        setScore(data);
      }

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
