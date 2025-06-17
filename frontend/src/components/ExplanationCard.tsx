import { BlockExplanation } from '../../../shared/types/dataTypes';
import Button from './common/Button';
import { CloseIcon } from './common/Icons';
import type { Dispatch, SetStateAction } from 'react';

export default function ExplanationCard({
  block,
  setVisibility,
}: {
  block: BlockExplanation;
  setVisibility: Dispatch<SetStateAction<boolean>>;
}) {
  return (
    <div className="flex h-full w-full flex-col gap-1">
      <div className="button-rectangular flex gap-1">
        <div className="color-disabled shape-rectangular flex flex-10 items-center justify-start">
          <h2
            style={{
              display: 'inline-block',
              width: '2.5em',
              textAlign: 'right',
              marginRight: '0.75em',
            }}
          >
            {block.blockSequence}
          </h2>
          <h2 className="ml-2 font-semibold">{block.blockName}</h2>
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
      <div className="color-disabled h-full p-4">
        <div
          className="flex flex-col justify-center"
          dangerouslySetInnerHTML={{
            __html: block.blockExplanation,
          }}
        ></div>
      </div>
    </div>
  );
}
