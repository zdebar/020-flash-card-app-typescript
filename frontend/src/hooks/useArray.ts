import { useState, useEffect } from 'react';
import { fetchWithAuthAndParse } from '../utils/auth.utils';
import { useUser } from '../hooks/useUser';

export function useArray<T>(apiPath: string) {
  const [itemArray, setItemArray] = useState<T[]>([]);
  const [index, setIndex] = useState(0);
  const { loading, userInfo } = useUser();

  function nextIndex() {
    setIndex((prevIndex) => (prevIndex + 1) % itemArray.length);
  }

  function prevIndex() {
    setIndex(
      (prevIndex) => (prevIndex - 1 + itemArray.length) % itemArray.length
    );
  }

  useEffect(() => {
    if (loading || !userInfo) return;
    const fetchData = async () => {
      try {
        const response = await fetchWithAuthAndParse<{
          blocks: T[] | null;
        }>(apiPath);
        setItemArray(response?.blocks || []);
      } catch (error) {
        console.error('Error in fetching data:', error);
      }
    };
    fetchData();
  }, [loading, userInfo, apiPath]);

  return {
    itemArray,
    index,
    setIndex,
    nextIndex,
    prevIndex,
    itemArrayLength: itemArray.length,
  };
}
