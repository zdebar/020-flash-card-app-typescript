import { Dispatch, SetStateAction } from 'react';
import { CloseIcon, NextIcon, PreviousIcon } from './common/Icons';
import Button from './common/Button';
import type { BlockExplanation } from '../../../shared/types/dataTypes';
import ButtonReset from './common/ButtonReset';
export default function InfoCard({
  block,
  setVisibility,
  handleNext,
  handlePrevious,
  index,
  arrayLength,
  canReset = false,
}: {
  block: BlockExplanation;
  setVisibility: Dispatch<SetStateAction<boolean>>;
  handleNext: () => void;
  handlePrevious: () => void;
  index: number;
  arrayLength: number;
  canReset?: boolean;
}) {
  return (
    <div className="card">
      <div className="button-rectangular gap-tiny flex">
        <ButtonReset
          disabled={!canReset}
          apiPath={`/api/blocks/${block.blockId}`}
          modalMessage="Opravdu chcete restartovat blok? Veškerý pokrok souvisejících položek bude ztracen."
          className="flex items-center justify-start"
        >
          <div className="gap-small flex items-center">
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
            <h2 className="font-display ml-2 font-semibold">
              {block.blockName}
            </h2>
          </div>
        </ButtonReset>
        <Button
          name="close"
          type="button"
          className="button-rectangular w-13 flex-shrink-0 flex-grow-0"
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
