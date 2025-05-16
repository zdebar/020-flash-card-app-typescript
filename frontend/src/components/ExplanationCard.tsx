import { Block } from '../../../shared/types/dataTypes';

import Button from './common/Button';
import { CloseIcon } from './common/Icons';
import type { Dispatch, SetStateAction } from 'react';

export default function ExplanationCard({
  block,

  setIndex: setExplanationIndex,
}: {
  block: Block;
  setIndex: Dispatch<SetStateAction<number | null>>;
}) {
  if (block === null) {
    return <p>Není odemčena žádná gramatika.</p>;
  }

  return (
    <div className="card">
      <div className="flex w-full gap-1">
        <div className="color-disabled shape-rectangular flex flex-10 flex-col justify-center pl-4">
          {block.block_name}
        </div>
        <Button
          name="close"
          className="button-rectangular flex-2"
          onClick={() => setExplanationIndex(null)}
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
