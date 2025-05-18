import { useState, useEffect } from 'react';
import { fetchWithAuthAndParse } from '../utils/auth.utils';
import { useUser } from '../hooks/useUser';

export function useArray<T>(apiPath: string) {
  const [array, setArray] = useState<T[]>([]);
  const [index, setIndex] = useState(0);
  const [reload, setReload] = useState(false);
  const { loading, userInfo } = useUser();

  function wrapIndex(newIndex: number) {
    if (array.length === 0) return 0;
    return (newIndex + array.length) % array.length;
  }

  function nextIndex() {
    setIndex((prev) => wrapIndex(prev + 1));
  }

  function prevIndex() {
    setIndex((prev) => wrapIndex(prev - 1));
  }

  useEffect(() => {
    if (loading || !userInfo) return;
    const fetchData = async () => {
      try {
        const response = await fetchWithAuthAndParse<{
          data: T[] | null;
        }>(apiPath);
        setArray(response?.data || []);
        setIndex(0);
        setReload(false);
      } catch (error) {
        console.error('Error in fetching data:', error);
      }
    };
    fetchData();
  }, [loading, userInfo, apiPath, reload]);

  return {
    array,
    setItemArray: setArray,
    index,
    setIndex,
    nextIndex,
    prevIndex,
    arrayLength: array.length,
    setReload,
  };
}
