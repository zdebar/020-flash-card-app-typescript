import { Dispatch, SetStateAction } from 'react';
import PrevNextControls from './common/PrevNextControls';
import { useArray } from '../hooks/useArray';
import Loading from './common/Loading';
import type { BlockExplanation } from '../../../shared/types/dataTypes';
import ExplanationCard from './ExplanationCard';

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
      <ExplanationCard
        block={array[index] || null}
        setVisibility={setVisibility}
      />
      <PrevNextControls
        handleNext={nextIndex}
        handlePrevious={prevIndex}
        index={index}
        arrayLength={arrayLength}
      />
    </div>
  );
}
