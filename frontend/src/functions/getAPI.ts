export async function getAPI<T>(
  apiPath: string,
  setData: (data: T | null) => void
): Promise<T | null> {
  try {
    const response = await fetch(apiPath, {
      method: 'GET',
      credentials: 'include',
    });

    console.log('API response:', response);
    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Unauthorized. Please log in again.');
      }
      const errorData = await response.json();
      throw new Error(errorData.message || 'An error occurred.');
    }

    const data = await response.json();
    console.log('Fetched data:', data);
    setData(data);

    return data;
  } catch (error) {
    console.error(error);
    setData(null);
    return null;
  }
}
