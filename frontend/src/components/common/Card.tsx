import { Word } from '../../../../shared/types/dataTypes';

interface CardProps {
  currentIndex: number;
  wordArray: Word[];
  direction: boolean;
  revealed: boolean;
}

export default function Card({
  currentIndex,
  wordArray,
  direction,
  revealed,
}: CardProps) {
  return (
    <div
      className={`color-secondary-disabled flex h-[150px] w-full flex-col items-center justify-between py-3 shadow-none`}
    >
      <p className="flex w-full justify-end pr-4 text-sm">
        {currentIndex + 1} / {wordArray.length}
      </p>
      <p className="pt-1 font-bold">
        {direction || revealed ? wordArray[currentIndex].czech : undefined}
      </p>
      <p>{revealed ? wordArray[currentIndex]?.english : '\u00A0'}</p>
      <p className="pb-1">
        {revealed ? wordArray[currentIndex]?.pronunciation : '\u00A0'}
      </p>
      <p className="flex w-full justify-start pl-6 text-sm">
        {revealed ? wordArray[currentIndex]?.progress : '\u00A0'}
      </p>
    </div>
  );
}
