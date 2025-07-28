import { useState, useEffect } from 'react';

export function useHelp(key: string) {
  const savedVisibility = localStorage.getItem(key) ?? 'true';

  const [isHelpVisible, setIsHelpVisible] = useState(() => {
    return savedVisibility == 'true'; // Default: true
  });

  const [isSavedTrue, setIsSavedTrue] = useState(() => {
    return savedVisibility == 'true'; // Default: true
  });

  const hideOverlay = (saveLocal: boolean) => {
    setIsHelpVisible(false);
    localStorage.setItem(key, String(saveLocal));
  };

  useEffect(() => {
    if (isHelpVisible) {
      const storedValue = localStorage.getItem(key) ?? 'true';
      setIsSavedTrue(storedValue == 'true');
    }
  }, [isHelpVisible, key]);

  return {
    isHelpVisible,
    setIsHelpVisible,
    isSavedTrue,
    setIsSavedTrue,
    hideOverlay,
  };
}
