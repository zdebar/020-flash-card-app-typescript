import { Item } from '../../../../shared/types/dataTypes';

interface CardProps {
  currentIndex: number;
  wordArray: Item[];
  direction: boolean;
  revealed: boolean;
  hintIndex?: number;
  started?: boolean;
}

export default function Card({
  currentIndex,
  wordArray,
  direction,
  revealed,
  hintIndex,
  started = true,
}: CardProps) {
  return (
    <div
      className={`color-disabled flex h-full w-full flex-col items-center justify-between py-3 ${!started && 'color-highlighted rounded-sm'} `}
    >
      <p className="flex w-full justify-end pr-4 text-sm">
        {currentIndex + 1} / {wordArray.length}
      </p>
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
      <p className="flex w-full justify-start pl-6 text-sm">
        {wordArray[currentIndex]?.progress}
      </p>
    </div>
  );
}
