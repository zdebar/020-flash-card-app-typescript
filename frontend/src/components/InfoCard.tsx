import { Dispatch, SetStateAction } from 'react';
import { CloseIcon, NextIcon, PreviousIcon } from './common/Icons';
import Button from './common/Button';
import type { BlockExplanation } from '../../../shared/types/dataTypes';

export default function InfoCard({
  block,
  setVisibility,
  handleNext,
  handlePrevious,
  index,
  arrayLength,
}: {
  block: BlockExplanation;
  setVisibility: Dispatch<SetStateAction<boolean>>;
  handleNext: () => void;
  handlePrevious: () => void;
  index: number;
  arrayLength: number;
}) {
  return (
    <div className="card flex h-full flex-col gap-1">
      <div className="button-rectangular flex gap-1">
        <div className="color-disabled shape-rectangular flex flex-10 items-center justify-start pt-1">
          <h2
            style={{
              display: 'inline-block',
              width: '4em',
              textAlign: 'right',
              marginRight: '0em',
            }}
            className="font-display font-semibold"
          >
            {block.blockSequence}
          </h2>
          <h2 className="font-display ml-2 font-semibold">{block.blockName}</h2>
        </div>
        <Button
          name="close"
          type="button"
          className="button-rectangular flex-2"
          onClick={() => setVisibility(false)}
          aria-label="Zavřít vysvětlení"
        >
          <CloseIcon />
        </Button>
      </div>
      <div className="color-disabled h-full overflow-y-auto px-6 py-4">
        <div
          dangerouslySetInnerHTML={{
            __html: block.blockExplanation,
          }}
        ></div>
      </div>
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
    </div>
  );
}
