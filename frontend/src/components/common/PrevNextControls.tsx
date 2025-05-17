import { Dispatch, SetStateAction } from 'react';
import Button from './Button';
import { PreviousIcon, NextIcon } from './Icons';

export default function PrevNextControls({
  arrayLength,
  index,
  setIndex,
}: {
  arrayLength: number;
  index: number;
  setIndex: Dispatch<SetStateAction<number>>;
}) {
  function handlePrevious() {
    if (index > 0) {
      setIndex(index - 1);
    }
  }

  function handleNext() {
    if (index < arrayLength - 1) {
      setIndex(index + 1);
    }
  }

  return (
    <div className="flex gap-1">
      <Button
        name="previous"
        onClick={handlePrevious}
        className="button-rectangular"
        disabled={index === 0}
      >
        <PreviousIcon />
      </Button>
      <Button
        name="next"
        onClick={handleNext}
        className="button-rectangular"
        disabled={index === arrayLength - 1}
      >
        <NextIcon />
      </Button>
    </div>
  );
}
