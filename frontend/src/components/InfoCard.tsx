import { Dispatch, SetStateAction } from 'react';
import { CloseIcon, NextIcon, PreviousIcon } from './common/Icons';
import Button from './common/Button';
import type { BlockExplanation } from '../../../shared/types/dataTypes';
import ButtonReset from './common/ButtonReset';
import HelpOverlay from './common/HelpOverlay';
import { useState } from 'react';
import GuideHint from './common/GuideHint';

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
  const [isHelpVisible, setIsHelpVisible] = useState(false);

  return (
    <div className="card relative">
      <div className="flex gap-1">
        <ButtonReset
          disabled={!canReset}
          apiPath={`/api/blocks/${block.blockId}`}
          modalMessage="Opravdu chcete restartovat blok? Veškerý pokrok souvisejících položek bude ztracen."
          className="w-full items-center justify-start"
        >
          <div className="flex gap-2">
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
            <h2 className="font-display font-semibold">{block.blockName}</h2>
          </div>
          <GuideHint
            visibility={isHelpVisible}
            text={'restartovat progress'}
            style={{
              top: '30px',
              left: '5px',
            }}
          />
        </ButtonReset>
        <Button
          name="close"
          className="w-13 flex-shrink-0 flex-grow-0"
          onClick={() => setVisibility(false)}
          aria-label="Zavřít vysvětlení"
        >
          <CloseIcon />
        </Button>
      </div>
      <div className="color-disabled relative h-full overflow-y-auto p-4">
        <div
          dangerouslySetInnerHTML={{
            __html: block.blockExplanation,
          }}
        ></div>
        <HelpOverlay
          name="showInfoCardHelp"
          setIsHelpVisible={setIsHelpVisible}
        />
      </div>
      <div className="flex gap-1" role="group" aria-label="Navigace">
        <Button name="previous" onClick={handlePrevious} disabled={index === 0}>
          <PreviousIcon />
        </Button>
        <Button
          name="next"
          type="button"
          onClick={handleNext}
          disabled={index === arrayLength - 1}
        >
          <NextIcon />
        </Button>
      </div>
    </div>
  );
}
