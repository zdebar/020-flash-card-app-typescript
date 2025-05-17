import { useState, useEffect } from 'react';
import { Block } from '../../../shared/types/dataTypes';
import { fetchWithAuthAndParse } from '../utils/auth.utils';
import Button from './common/Button';
import ExplanationCard from './ExplanationCard';
import { useUser } from '../hooks/useUser';

export default function GrammarList() {
  const [grammarArray, setGrammarArray] = useState([] as Block[]);
  const [explanationIndex, setExplanationIndex] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);
  const { loading, userInfo } = useUser();

  const apiPath = '/api/blocks/grammar';

  useEffect(() => {
    if (loading || !userInfo) return;
    const fetchData = async () => {
      try {
        const response = await fetchWithAuthAndParse<{
          blocks: Block[] | null;
        }>(apiPath);

        const blocks = response?.blocks || [];
        setGrammarArray(blocks);
      } catch (error) {
        console.error('Error in fetching data:', error);
      }
    };
    fetchData();
  }, [loading, userInfo]);

  return (
    <>
      {!showExplanation ? (
        <div className={`w-card flex h-full flex-col gap-1`}>
          {grammarArray.map((block) => (
            <Button
              key={block.block_id}
              className="button-rectangular flex h-8 justify-start px-2"
              onClick={() => {
                setShowExplanation(true);
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
        <ExplanationCard
          blocks={grammarArray}
          index={explanationIndex}
          setIndex={setExplanationIndex}
          setVisibility={setShowExplanation}
        />
      )}
    </>
  );
}
