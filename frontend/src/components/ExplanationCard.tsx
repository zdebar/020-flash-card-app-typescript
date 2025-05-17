import { Block } from '../../../shared/types/dataTypes';
import PrevNextControls from './common/PrevNextControls';

import Button from './common/Button';
import { CloseIcon } from './common/Icons';
import type { Dispatch, SetStateAction } from 'react';

export default function ExplanationCard({
  blocks,
  index,
  setIndex,
  setVisibility,
}: {
  blocks: Block[];
  index: number;
  setIndex: Dispatch<SetStateAction<number>>;
  setVisibility: Dispatch<SetStateAction<boolean>>;
}) {
  if (blocks === null) {
    return <p>Není odemčena žádná gramatika.</p>;
  }

  return (
    <div className="card">
      <div className="flex w-full gap-1">
        <div className="color-disabled shape-rectangular flex flex-10 items-center justify-start">
          <span
            style={{
              display: 'inline-block',
              width: '2.5em',
              textAlign: 'right',
              marginRight: '0.75em',
            }}
          >
            {blocks[index].block_order}
          </span>
          {blocks[index].block_name}
        </div>
        <Button
          name="close"
          className="button-rectangular flex-2"
          onClick={() => {
            setVisibility(false);
          }}
        >
          <CloseIcon />
        </Button>
      </div>
      <div className="color-disabled h-full p-4">
        <div
          className="flex flex-col justify-center"
          dangerouslySetInnerHTML={{
            __html: blocks[index].block_explanation,
          }}
        ></div>
      </div>
      <PrevNextControls
        arrayLength={blocks.length}
        index={index}
        setIndex={setIndex}
      />
    </div>
  );
}
