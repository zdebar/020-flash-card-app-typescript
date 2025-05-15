import { useEffect, useState } from 'react';
import { Item } from '../../../../shared/types/dataTypes';
import { VolumeIcon } from './Icons';
import config from '../../config/config';

interface CardProps {
  currentIndex: number;
  wordArray: Item[];
  direction: boolean;
  revealed: boolean;
  hintIndex?: number;
  setVolume: (volume: number) => void;
  error: string | null;
}

export default function Card({
  currentIndex,
  wordArray,
  direction,
  revealed,
  hintIndex,
  setVolume,
  error,
}: CardProps) {
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const [volume, setVolumeState] = useState(1); // Default volume is 1 (100%)
  const [noAudio, setNoAudio] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleVolumeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(event.target.value);
    setVolumeState(newVolume);
    setVolume(newVolume);
  };

  useEffect(() => {
    if (error === 'noAudio') {
      setNoAudio(true);
      setErrorMessage(config.errorMessages[error] || '');
    } else {
      setNoAudio(false);
      setErrorMessage('');
    }
  }, [error]);

  return (
    <div
      className={`color-disabled flex h-full w-full flex-col items-center justify-between px-4 pt-3 pb-2 ${!direction && 'color-highlighted rounded-sm'} `}
    >
      <div className="flex w-full items-center justify-between">
        <div className="relative flex">
          <button onClick={() => setShowVolumeSlider((prev) => !prev)}>
            <VolumeIcon />
          </button>
          {showVolumeSlider && (
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={handleVolumeChange}
              className="ml-2 w-24"
              autoFocus
            />
          )}
        </div>
        <p className="flex w-full justify-end text-sm">
          {currentIndex + 1} / {wordArray.length}
        </p>
      </div>

      <p className="pt-1 font-bold">
        {direction || revealed ? wordArray[currentIndex].czech : '\u00A0'}
      </p>
      <p>
        {revealed || noAudio
          ? wordArray[currentIndex]?.english
          : wordArray[currentIndex]?.english
              .slice(0, hintIndex ?? wordArray[currentIndex]?.english.length)
              .padEnd(wordArray[currentIndex]?.english.length, '\u00A0')}
      </p>
      <p className="pb-1">
        {revealed && wordArray[currentIndex]?.pronunciation
          ? wordArray[currentIndex].pronunciation
          : '\u00A0'}
      </p>
      <div className="flex w-full items-center justify-between">
        <p className="flex w-full justify-start text-sm">
          {wordArray[currentIndex]?.progress}
        </p>
        <p className="text-sm whitespace-nowrap text-red-500">{errorMessage}</p>
      </div>
    </div>
  );
}
