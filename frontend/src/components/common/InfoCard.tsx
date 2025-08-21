import { Dispatch, SetStateAction } from 'react';
import { CloseIcon, NextIcon, PreviousIcon } from './Icons.js';
import Button from './Button.js';
import type { BlockExplanation } from '../../../../shared/types/dataTypes.js';
import ButtonReset from './ButtonReset.js';
import HelpOverlay from './HelpOverlay.js';
import { useState } from 'react';
import GuideHint from './GuideHint.js';

export default function InfoCard({
  block,
  setVisibility,
  handleNext,
  handlePrevious,
  index,
  arrayLength,
  canReset = false,
  onReset,
}: {
  block: BlockExplanation;
  setVisibility: Dispatch<SetStateAction<boolean>>;
  handleNext: () => void;
  handlePrevious: () => void;
  index: number;
  arrayLength: number;
  canReset?: boolean;
  onReset?: () => void;
}) {
  const [isHelpVisible, setIsHelpVisible] = useState(false);

  return (
    <div className="help-overlay">
      <HelpOverlay
        name="showInfoCardHelp"
        setIsHelpVisible={setIsHelpVisible}
      />
      <div className="card">
        <div className="flex gap-1">
          <ButtonReset
            disabled={!canReset}
            apiPath={`/api/blocks/${block.blockId}`}
            modalMessage="Opravdu chcete restartovat blok? Veškerý pokrok souvisejících položek bude ztracen."
            className="relative w-full items-center justify-start"
            onReset={onReset}
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
            className="relative w-13 flex-shrink-0 flex-grow-0"
            onClick={() => setVisibility(false)}
            aria-label="Zavřít vysvětlení"
          >
            <CloseIcon />
            <GuideHint
              visibility={isHelpVisible}
              text={'zpět'}
              style={{
                top: '30px',
                left: '5px',
              }}
            />
          </Button>
        </div>
        <div className="color-disabled relative h-full overflow-y-auto p-4">
          <div
            dangerouslySetInnerHTML={{
              __html: block.blockExplanation,
            }}
          ></div>
        </div>
        <div className="flex gap-1" role="group" aria-label="Navigace">
          <Button
            name="previous"
            onClick={handlePrevious}
            disabled={index === 0}
          >
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
    </div>
  );
}
