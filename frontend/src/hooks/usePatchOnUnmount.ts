import { useEffect, useRef } from 'react';

export function usePatchOnUnmount(
  patchFn: (
    onPracticeBlockEnd: boolean,
    newProgress: number[]
  ) => Promise<void>,
  updatedProgress: number[]
) {
  const patchRef = useRef(patchFn);
  const updateArrayRef = useRef(updatedProgress);

  useEffect(() => {
    patchRef.current = patchFn;
  }, [patchFn]);

  useEffect(() => {
    updateArrayRef.current = updatedProgress;
  }, [updatedProgress]);

  useEffect(() => {
    return () => {
      patchRef.current(false, updateArrayRef.current);
    };
  }, []);
}
