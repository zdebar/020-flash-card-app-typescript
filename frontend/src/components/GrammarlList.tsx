import { useState, useEffect } from 'react';
import { Block } from '../../../shared/types/dataTypes';
import { fetchWithAuthAndParse } from '../utils/auth.utils';
import Button from './common/Button';
import ExplanationCard from './ExplanationCard';
import { useUser } from '../hooks/useUser';

export default function GrammarList() {
  const [grammarArray, setGrammarArray] = useState([] as Block[]);
  const [explanationIndex, setExplanationIndex] = useState(
    null as number | null
  );
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
      {explanationIndex === null ? (
        <div className={`flex h-full w-full flex-col gap-1`}>
          {grammarArray.map((block, idx) => (
            <Button
              key={block.block_id}
              className="button-rectangular flex h-8 justify-start px-2"
              onClick={() => {
                setExplanationIndex(idx);
              }}
            >
              <span
                style={{
                  display: 'inline-block',
                  width: '2.5em',
                  textAlign: 'right',
                  marginRight: '0.75em', // add gap here
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
          block={grammarArray[explanationIndex]}
          setIndex={setExplanationIndex}
        />
      )}
    </>
  );
}
