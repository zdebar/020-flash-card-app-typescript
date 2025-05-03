import { useState } from 'react';

export function useHint() {
  const [hintIndex, setHintIndex] = useState(0);

  const handleHint = () => {
    setHintIndex((prevIndex) => prevIndex + 1);
  };

  const resetHint = () => {
    setHintIndex(0);
  };

  return { hintIndex, handleHint, resetHint };
}
