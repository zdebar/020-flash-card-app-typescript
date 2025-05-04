import { fetchWithAuth } from './firebase.utils';

export default async function getData<T>(fetchPath: string): Promise<T> {
  try {
    const response = await fetchWithAuth(fetchPath);
    if (!response.ok) {
      const errorMessage = `Failed to fetch: ${response.status} ${response.statusText}`;
      console.error(errorMessage);
      throw new Error(errorMessage);
    }

    const data = await response.json();

    if (!data) {
      throw new Error('Response is empty or invalid');
    }

    return data;
  } catch (error) {
    console.error('Error in fetching data:', error);
    throw error;
  }
}
