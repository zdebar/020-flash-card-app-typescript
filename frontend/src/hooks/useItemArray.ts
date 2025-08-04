import { useState, useCallback } from 'react';
import { fetchWithAuthAndParse } from '../utils/auth.utils';
import { useArray } from './useArray';
import { alternateDirection } from '../utils/practice.utils';
import { Item, UserScore } from '../../../shared/types/dataTypes';
import { useUser } from './useUser';
import { usePatchOnUnmount } from './usePatchOnUnmount';

export function useItemArray(apiPath: string) {
  const [userProgress, setUserProgress] = useState<number[]>([]);
  const { setUserScore } = useUser();
  const {
    array,
    setArray,
    index,
    setIndex,
    nextIndex,
    prevIndex,
    currentItem,
    arrayLength,
    reload,
    setReload,
    loading,
  } = useArray<Item>(apiPath, 'GET');

  const direction = alternateDirection(currentItem?.progress);
  const showContextInfo = currentItem?.showContextInfo === true;

  // Sending user progress to the server
  const patchItems = useCallback(
    async (onBlockEnd: boolean, updatedProgress: number[]) => {
      const updatedArray = array
        .filter((_, idx) => idx < updatedProgress.length)
        .map((item, idx) => ({
          ...item,
          progress: updatedProgress[idx],
        }));

      if (updatedArray.length === 0) return;
      setUserProgress([]);

      try {
        const response = await fetchWithAuthAndParse<{
          score: UserScore[] | null;
        }>(apiPath, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            items: updatedArray,
            onBlockEnd,
          }),
        });

        const newUserScore = response?.score || null;
        setUserScore(newUserScore);
      } catch (error) {
        console.error('Error posting words:', error);
      }
    },
    [apiPath, setUserScore, array]
  );

  // Patch items on unmount
  usePatchOnUnmount(patchItems, userProgress);

  return {
    array,
    setArray,
    index,
    setIndex,
    nextIndex,
    prevIndex,
    currentItem,
    arrayLength,
    reload,
    setReload,
    direction,
    showContextInfo,
    userProgress,
    setUserProgress,
    patchItems,
    loading,
  };
}
