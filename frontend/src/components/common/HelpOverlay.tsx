import { useLocalStorage } from '../../hooks/useLocalStorage.js';
import Checkbox from './Checkbox.js';
import Overlay from './Overlay.js';
import { HelpIcon } from './Icons.js';
import { useEffect } from 'react';

export default function HelpOverlay({
  name,
  setIsHelpVisible,
}: {
  name: string;
  setIsHelpVisible: (value: boolean) => void;
}) {
  const { isTrue, isSavedTrue, setIsTrue, setIsSavedTrue, hideOverlay } =
    useLocalStorage(name);

  const handleCheckboxChange = (checked: boolean) => {
    setIsSavedTrue(!checked);
  };

  useEffect(() => {
    setIsHelpVisible(isTrue);
  }, [isTrue, setIsHelpVisible]);

  return (
    <>
      {isTrue && (
        <Overlay
          onClose={() => {
            hideOverlay(isSavedTrue);
          }}
        />
      )}
      <div
        className="absolute z-10"
        style={{
          bottom: '5px',
          right: '5px',
        }}
        onClick={() => setIsTrue(true)}
      >
        <HelpIcon />
      </div>
      {isTrue && (
        <Checkbox
          onChange={handleCheckboxChange}
          className="pl-1"
          checked={!isSavedTrue}
        />
      )}
    </>
  );
}
