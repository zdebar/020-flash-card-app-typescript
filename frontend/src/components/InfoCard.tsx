import Button from './common/Button';
import { CloseIcon } from './common/Icons';
import { Dispatch, SetStateAction } from 'react';
import PrevNextControls from './common/PrevNextControls';
import { useArray } from '../hooks/useArray';
import Loading from './common/Loading';
import type { BlockExplanation } from '../../../shared/types/dataTypes';

export default function InfoCard({
  itemId,
  setVisibility,
}: {
  itemId: number;
  setVisibility: Dispatch<SetStateAction<boolean>>;
}) {
  const { array, index, nextIndex, prevIndex, arrayLength } =
    useArray<BlockExplanation>(`/api/items/${itemId}/info`);

  const current = array?.[index];

  if (!current) {
    return <Loading />;
  }

  return (
    <div className="card">
      <div className="flex w-full gap-1">
        <div className="color-disabled shape-rectangular flex flex-col justify-center pl-4">
          <h2 className="font-semibold">{current.blockName}</h2>
        </div>
        <Button
          name="close"
          type="button"
          className="button-rectangular w-23"
          onClick={() => setVisibility(false)}
          aria-label="Zavřít informace"
        >
          <CloseIcon />
        </Button>
      </div>
      <div className="color-disabled h-full">
        <div
          className="flex flex-col justify-center p-4 text-sm"
          dangerouslySetInnerHTML={{
            __html: current.blockExplanation,
          }}
        ></div>
      </div>
      <PrevNextControls
        handleNext={nextIndex}
        handlePrevious={prevIndex}
        index={index}
        arrayLength={arrayLength}
      />
    </div>
  );
}
