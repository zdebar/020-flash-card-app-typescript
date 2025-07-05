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
      <div className="color-disabled h-full px-6 py-4">
        <div
          dangerouslySetInnerHTML={{
            __html: block.blockExplanation,
          }}
          style={{
            margin: 0,
            lineHeight: '1.2',
          }}
        ></div>
      </div>
    </div>
  );
}
