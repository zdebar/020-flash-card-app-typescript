import { useState, useEffect } from 'react';
import { fetchWithAuthAndParse } from '../utils/auth.utils.js';
import { useUser } from './useUser.js';
import { Item } from 'firebase/analytics';

export function useError(item: Item, setError: (error: boolean) => void) {
  const [error, setError] = useState<PracticeError | null>(null);

  useEffect(() => {
    setError(false);
  }, [setError, item]);

  return {
    array,
    setArray,
    index,
    setIndex,
    nextIndex,
    prevIndex,
    loading,
    currentItem: array[index],
    arrayLength: array.length,
    reload,
    setReload,
  };
}
