async function postData<T, U>(
  apiPath: string,
  body: U,
  storageKey?: string
): Promise<T | null> {
  const token = localStorage.getItem('token');

  if (!token) {
    return null;
  }

  try {
    const response = await fetch(apiPath, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      if (response.status === 401) {
        localStorage.removeItem('token');
        throw new Error('Unauthorized. Please log in again.');
      }
      const errorData = await response.json();
      throw new Error(errorData.message || 'An error occurred.');
    }

    const data = await response.json();
    console.log('Posted data response:', data);

    if (storageKey) {
      localStorage.setItem(storageKey, JSON.stringify(data));
    }

    return data;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export default postData;

interface UpgradeWord {
  id: number;
  progress: number;
}

export async function postUpgradeWords(words: UpgradeWord[]): Promise<boolean> {
  const API_PATH = `http://localhost:3000/user/updateUserWords`;

  try {
    const response = await postData<{ message: string }, UpgradeWord[]>(
      API_PATH,
      words
    );

    if (response) {
      console.log('Words upgraded successfully:', response.message);
      return true;
    } else {
      console.error('Failed to upgrade words.');
      return false;
    }
  } catch (error) {
    console.error('Error posting upgrade words:', error);
    return false;
  }
}
