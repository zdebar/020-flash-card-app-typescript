import Button from './Button';
import { PreviousIcon, NextIcon } from './Icons';

export default function PrevNextControls({
  handleNext,
  handlePrevious,
  index,
  arrayLength,
}: {
  handleNext: () => void;
  handlePrevious: () => void;
  index: number;
  arrayLength: number;
}) {
  return (
    <div className="flex gap-1" role="group" aria-label="Navigace">
      <Button
        name="previous"
        type="button"
        onClick={handlePrevious}
        className="button-rectangular"
        disabled={index === 0}
      >
        <PreviousIcon />
      </Button>
      <Button
        name="next"
        type="button"
        onClick={handleNext}
        className="button-rectangular"
        disabled={index === arrayLength - 1}
      >
        <NextIcon />
      </Button>
    </div>
  );
}
