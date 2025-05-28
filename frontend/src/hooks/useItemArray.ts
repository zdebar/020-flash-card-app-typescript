import { useState, useEffect } from 'react';
import { useArray } from './useArray';
import { alternateDirection } from '../utils/practice.utils';
import { Item } from '../../../shared/types/dataTypes';

export function useItemArray(apiPath: string) {
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
  } = useArray<Item>(apiPath);
  const [direction, setDirection] = useState<boolean>(false);

  useEffect(() => {
    if (currentItem) {
      const newDirection = alternateDirection(currentItem.progress);
      setDirection(newDirection);
    }
  }, [currentItem]);

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
    setDirection,
  };
}
