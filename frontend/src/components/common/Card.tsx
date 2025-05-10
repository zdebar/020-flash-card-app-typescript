import { Item } from '../../../../shared/types/dataTypes';
import { VolumeIcon, MuteIcon } from './Icons';

interface CardProps {
  currentIndex: number;
  wordArray: Item[];
  direction: boolean;
  revealed: boolean;
  hintIndex?: number;
  muteAudio?: () => void;
  unmuteAudio?: () => void;
  mutedAudio?: boolean;
  setMutedAudio?: (muted: boolean) => void;
}

export default function Card({
  currentIndex,
  wordArray,
  direction,
  revealed,
  hintIndex,
  muteAudio,
  unmuteAudio,
  mutedAudio,
  setMutedAudio,
}: CardProps) {
  return (
    <div
      className={`color-disabled flex h-full w-full flex-col items-center justify-between p-4 ${!direction && 'color-highlighted rounded-sm'} `}
    >
      <div className="flex w-full justify-between">
        <div>
          {mutedAudio ? (
            <button
              onClick={() => {
                setMutedAudio?.(false);
                unmuteAudio?.();
              }}
            >
              <MuteIcon></MuteIcon>
            </button>
          ) : (
            <button
              onClick={() => {
                setMutedAudio?.(true);
                muteAudio?.();
              }}
            >
              <VolumeIcon></VolumeIcon>
            </button>
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
        {revealed
          ? wordArray[currentIndex]?.english
          : wordArray[currentIndex]?.english
              .slice(0, hintIndex ?? wordArray[currentIndex]?.english.length)
              .padEnd(wordArray[currentIndex]?.english.length, '\u00A0')}
      </p>
      <p className="pb-1">
        {revealed ? wordArray[currentIndex]?.pronunciation : '\u00A0'}
      </p>
      <p className="flex w-full justify-start text-sm">
        {wordArray[currentIndex]?.progress}
      </p>
    </div>
  );
}
