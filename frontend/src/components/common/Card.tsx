import { useState } from 'react';
import { Item, PracticeError } from '../../../../shared/types/dataTypes';
import { VolumeIcon } from './Icons';

interface CardProps {
  item: Item;
  index: number;
  total: number;
  direction: boolean;
  revealed: boolean;
  hintIndex?: number;
  setVolume: (volume: number) => void;
  error: PracticeError | null;
}

function getErrorMessage(error: PracticeError | null) {
  switch (error) {
    case PracticeError.NoAudio:
      return 'Zvuk není k dispozici.';
    default:
      return '';
  }
}

export default function Card({
  item,
  index,
  total,
  direction,
  revealed,
  hintIndex,
  setVolume,
  error,
}: CardProps) {
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const [volume, setVolumeState] = useState(1);

  const noAudio = error === PracticeError.NoAudio;
  const errorMessage = getErrorMessage(error);

  const handleVolumeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(event.target.value);
    setVolumeState(newVolume);
    setVolume(newVolume);
  };

  return (
    <div
      className={`color-disabled flex h-full w-full flex-col items-center justify-between px-4 pt-3 pb-2 ${!direction && 'color-highlighted rounded-sm'} `}
    >
      <div className="flex w-full items-center justify-between">
        <div className="relative flex">
          <button
            onClick={() => setShowVolumeSlider((prev) => !prev)}
            aria-label="Nastavit hlasitost"
            disabled={noAudio}
          >
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
              aria-valuenow={volume}
              aria-valuemin={0}
              aria-valuemax={1}
              disabled={noAudio}
            />
          )}
        </div>
        <p className="flex w-full justify-end text-sm">
          {index + 1} / {total}
        </p>
      </div>

      <p className="pt-1 text-center font-bold">
        {direction || revealed ? item.czech : '\u00A0'}
      </p>
      <p className="text-center">
        {revealed || (noAudio && !direction)
          ? item?.english
          : item?.english
              .slice(0, hintIndex ?? item?.english.length)
              .padEnd(item?.english.length, '\u00A0')}
      </p>
      <p className="pb-1 text-center">
        {revealed ? item?.pronunciation || '\u00A0' : '\u00A0'}
      </p>
      <div className="flex w-full items-center justify-between">
        <p className="flex w-full justify-start text-sm">{item?.progress}</p>
        <p className="text-sm whitespace-nowrap text-red-500">{errorMessage}</p>
      </div>
    </div>
  );
}
