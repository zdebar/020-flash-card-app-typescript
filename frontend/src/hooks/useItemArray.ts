import { useState, useEffect, useCallback } from 'react';
import { usePatchOnUnmount } from './usePatchOnUnmount';
import { Item, UserScore } from '../../../shared/types/dataTypes';
import { alternateDirection } from '../utils/practice.utils';
import { useUser } from './useUser';
import { fetchWithAuthAndParse } from '../utils/auth.utils';
import { useArray } from './useArray';

export function useItemArray() {
  const apiPath = '/api/items';
  const { array, setItemArray, index, nextIndex, arrayLength, setReload } =
    useArray<Item>(apiPath);
  const [direction, setDirection] = useState(false); // true = czech to english, false = english to czech
  const { setUserScore } = useUser();

  useEffect(() => {
    setDirection(alternateDirection(array[index]));
  }, [array, index]);

  // Update items on unmount - Ref, Update Ref, Effect on unmount
  const patchItems = useCallback(
    async (onBlockEnd: boolean) => {
      try {
        const response = await fetchWithAuthAndParse<{
          score: UserScore | null;
        }>(apiPath, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            items: array,
            onBlockEnd,
          }),
        });

        const newUserScore = response?.score || null;
        setUserScore(newUserScore);
      } catch (error) {
        console.error('Error posting words:', error);
      }
    },
    [array, apiPath, setUserScore]
  );

  usePatchOnUnmount(patchItems, index);

  // Update the item in Array
  const updateItemArray = useCallback(
    async (progressIncrement: number = 0) => {
      const updatedItemArray = [...array];

      if (!array[index]) return;
      updatedItemArray[index] = {
        ...updatedItemArray[index],
        progress: Math.max(array[index].progress + progressIncrement, 0),
      };

      if (arrayLength > 0) {
        if (index + 1 >= arrayLength) {
          await patchItems(true);
          setReload(true);
        } else {
          setItemArray(updatedItemArray);
          nextIndex();
        }
      }
    },
    [array, index, arrayLength, setItemArray, nextIndex, setReload, patchItems]
  );

  return {
    itemArray: array,
    currentItem: array?.[index],
    index,
    itemArrayLength: arrayLength,
    direction,
    updateItemArray,
  };
}
