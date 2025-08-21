import { useState } from 'react';
import { BlockExplanation } from '../../../shared/types/dataTypes';
import Loading from './common/Loading';
import Button from './common/Button';
import InfoCard from './InfoCard';
import { useArray } from '../hooks/useArray';
import { useUser } from '../hooks/useUser';
import TopBar from './common/TopBar';

export default function GrammarList() {
  const { languageId } = useUser();
  const {
    array,
    index,
    setIndex,
    nextIndex,
    prevIndex,
    setArray,
    arrayLength,
    loading,
  } = useArray<BlockExplanation>(`/api/blocks/grammar/${languageId}`, 'GET');
  const [showExplanation, setShowExplanation] = useState(false);

  return (
    <>
      {!showExplanation ? (
        <div className="w-card list">
          <TopBar text="Gramatika" toLink="/userOverview" />
          {!arrayLength && !loading && (
            <Loading text="Není odemčena žádná lekce gramatiky" timeDelay={0} />
          )}
          {loading ? (
            <Loading />
          ) : (
            <div className="list overflow-y-auto">
              {array.map((block, idx) => (
                <Button
                  key={idx}
                  className="h-C flex justify-start px-2"
                  onClick={() => {
                    setShowExplanation(true);
                    setIndex(idx);
                  }}
                >
                  <span className="mr-2 inline-block w-15 text-right">
                    {block.blockSequence}
                  </span>
                  {block.blockName}
                </Button>
              ))}
            </div>
          )}
        </div>
      ) : (
        <InfoCard
          block={array[index] || null}
          setVisibility={setShowExplanation}
          handleNext={nextIndex}
          handlePrevious={prevIndex}
          index={index}
          arrayLength={arrayLength}
          canReset={true}
          onReset={() => {
            setShowExplanation(false);
            setArray((prev) => prev.filter((_, i) => i !== index));
          }}
        />
      )}
    </>
  );
}
