import { useEffect, useRef } from 'react';

export function usePatchOnUnmount(
  patchFn: (onBlockEnd: boolean) => Promise<void>,
  index: number
) {
  const patchRef = useRef(patchFn);
  const indexRef = useRef(index);

  useEffect(() => {
    patchRef.current = patchFn;
  }, [patchFn]);

  useEffect(() => {
    indexRef.current = index;
  }, [index]);

  useEffect(() => {
    return () => {
      if (indexRef.current !== 0) {
        patchRef.current(false);
      }
    };
  }, []);
}
