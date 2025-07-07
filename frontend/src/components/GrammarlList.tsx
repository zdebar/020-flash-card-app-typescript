import { useState } from 'react';
import { BlockExplanation } from '../../../shared/types/dataTypes';
import Loading from './common/Loading';
import Button from './common/Button';
import InfoCard from './InfoCard';

import { useArray } from '../hooks/useArray';

export default function GrammarList() {
  const { array, index, setIndex, nextIndex, prevIndex, arrayLength } =
    useArray<BlockExplanation>('/api/blocks/grammar');
  const [showExplanation, setShowExplanation] = useState(false);

  if (!arrayLength)
    return <Loading text="Není odemčena žádná lekce gramatiky" />;

  return (
    <>
      {!showExplanation ? (
        <div className="max-w-card flex h-full flex-col gap-1 overflow-y-auto">
          {array.map((block, idx) => (
            <Button
              key={idx}
              className="button-rectangular flex h-8 justify-start px-2"
              onClick={() => {
                setShowExplanation(true);
                setIndex(idx);
              }}
            >
              <span
                style={{
                  display: 'inline-block',
                  width: '2.5em',
                  textAlign: 'right',
                  marginRight: '0.75em',
                }}
              >
                {block.blockSequence}
              </span>
              {block.blockName}
            </Button>
          ))}
        </div>
      ) : (
        <InfoCard
          block={array[index] || null}
          setVisibility={setShowExplanation}
          handleNext={nextIndex}
          handlePrevious={prevIndex}
          index={index}
          arrayLength={arrayLength}
        />
      )}
    </>
  );
}
