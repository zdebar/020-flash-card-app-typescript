import { useState } from 'react';
import { Block } from '../../../shared/types/dataTypes';
import PrevNextControls from './common/PrevNextControls';
import Loading from './common/Loading';
import Button from './common/Button';
import ExplanationCard from './ExplanationCard';

import { useArray } from '../hooks/useArray';

export default function GrammarList() {
  const { array, index, setIndex, nextIndex, prevIndex, arrayLength } =
    useArray<Block>('/api/blocks/grammar');
  const [showExplanation, setShowExplanation] = useState(false);

  if (!arrayLength)
    return <Loading text="Není odemčena žádná lekce gramatiky" />;

  return (
    <>
      {!showExplanation ? (
        <div className={`w-card flex h-full flex-col gap-1`}>
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
                {block.block_order}
              </span>
              {block.block_name}
            </Button>
          ))}
        </div>
      ) : (
        <div className="card">
          <ExplanationCard
            block={array[index] || null}
            setVisibility={setShowExplanation}
          />
          <PrevNextControls
            handleNext={nextIndex}
            handlePrevious={prevIndex}
            index={index}
            arrayLength={arrayLength}
          />
        </div>
      )}
    </>
  );
}
