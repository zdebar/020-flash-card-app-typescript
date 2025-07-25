import { Dispatch, SetStateAction } from 'react';
import { useArray } from '../hooks/useArray.js';
import Loading from './common/Loading.js';
import type { BlockExplanation } from '../../../shared/types/dataTypes.js';
import InfoCard from './InfoCard.js';

export default function ContextCard({
  itemId,
  setVisibility,
}: {
  itemId: number;
  setVisibility: Dispatch<SetStateAction<boolean>>;
}) {
  const { array, index, nextIndex, prevIndex, arrayLength } =
    useArray<BlockExplanation>(`/api/items/${itemId}/info`, 'GET');

  const current = array?.[index];

  if (!current) {
    return <Loading />;
  }

  return (
    <InfoCard
      block={array[index] || null}
      setVisibility={setVisibility}
      handleNext={nextIndex}
      handlePrevious={prevIndex}
      index={index}
      arrayLength={arrayLength}
    />
  );
}
