import { Block } from '../../../shared/types/dataTypes';

import Button from './common/Button';
import { CloseIcon } from './common/Icons';
import type { Dispatch, SetStateAction } from 'react';

export default function ExplanationCard({
  block,
  setVisibility,
}: {
  block: Block;
  setVisibility: Dispatch<SetStateAction<boolean>>;
}) {
  if (block === null) {
    return <p>Není odemčena žádná gramatika.</p>;
  }

  return (
    <div className="flex h-full w-full flex-col gap-1">
      <div className="flex h-12 w-full gap-1">
        <div className="color-disabled shape-rectangular flex flex-10 items-center justify-start">
          <span
            style={{
              display: 'inline-block',
              width: '2.5em',
              textAlign: 'right',
              marginRight: '0.75em',
            }}
          >
            {block.block_order}
          </span>
          {block.block_name}
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
            __html: block.block_explanation,
          }}
        ></div>
      </div>
    </div>
  );
}
