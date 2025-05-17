import { useState, useEffect, useCallback, useRef } from 'react';
import { Item, UserScore } from '../../../shared/types/dataTypes';
import { alternateDirection } from '../utils/practice.utils';
import { useUser } from './useUser';
import { fetchWithAuthAndParse } from '../utils/auth.utils';
import { useArray } from './useArray';

export function useItemArray() {
  const apiPath = '/api/items';
  const {
    itemArray,
    setItemArray,
    index,
    nextIndex,
    itemArrayLength,
    setReload,
  } = useArray<Item>(apiPath);
  const [direction, setDirection] = useState(false); // true = czech to english, false = english to czech
  const { setUserScore } = useUser();

  useEffect(() => {
    setDirection(alternateDirection(itemArray[index]));
  }, [itemArray, index]);

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
            items: itemArray,
            onBlockEnd,
          }),
        });

        const newUserScore = response?.score || null;
        setUserScore(newUserScore);
      } catch (error) {
        console.error('Error posting words:', error);
      }
    },
    [itemArray, apiPath, setUserScore]
  );

  const updateItemsRef =
    useRef<(onBlockEnd: boolean) => Promise<void>>(patchItems);
  const updateIndexRef = useRef(index);

  useEffect(() => {
    updateItemsRef.current = patchItems;
  }, [patchItems]);

  useEffect(() => {
    updateIndexRef.current = index;
  }, [index]);

  // Update items on unmount
  useEffect(() => {
    return () => {
      if (updateIndexRef.current != 0) {
        updateItemsRef.current(false);
      }
    };
  }, []);

  // Update the item in Array
  const updateItemArray = useCallback(
    async (progressIncrement: number = 0) => {
      const updatedItemArray = [...itemArray];

      if (!itemArray[index]) return;
      updatedItemArray[index] = {
        ...updatedItemArray[index],
        progress: Math.max(itemArray[index].progress + progressIncrement, 0),
      };

      if (itemArrayLength > 0) {
        if (index + 1 >= itemArrayLength) {
          await updateItemsRef.current(true);
          setReload(true);
        } else {
          setItemArray(updatedItemArray);
          nextIndex();
        }
      }
    },
    [itemArray, index, itemArrayLength, setItemArray, nextIndex, setReload]
  );

  return {
    itemArray,
    currentItem: itemArray?.[index],
    index,
    itemArrayLength,
    direction,
    updateItemArray,
  };
}
