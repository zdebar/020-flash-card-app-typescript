import { useEffect, useRef } from 'react';
import { Item } from '../../../shared/types/dataTypes';

export function usePatchOnUnmount(
  patchFn: (onBlockEnd: boolean, array: Item[]) => Promise<void>,
  index: number,
  updateArray: Item[]
) {
  const patchRef = useRef(patchFn);
  const indexRef = useRef(index);
  const updateArrayRef = useRef(updateArray);

  useEffect(() => {
    patchRef.current = patchFn;
  }, [patchFn]);

  useEffect(() => {
    indexRef.current = index;
  }, [index]);

  useEffect(() => {
    updateArrayRef.current = updateArray;
  }, [updateArray]);

  useEffect(() => {
    return () => {
      if (indexRef.current !== 0) {
        patchRef.current(false, updateArrayRef.current);
      }
    };
  }, []);
}
