import { BlockExplanation } from '../../../shared/types/dataTypes';
import Loading from './common/Loading';
import ButtonReset from './common/ButtonReset';
import { useArray } from '../hooks/useArray';
import { useUser } from '../hooks/useUser';
import TopBar from './common/TopBar';

export default function GrammarPracticeList() {
  const { languageId } = useUser();
  const { array, arrayLength, loading, setArray } = useArray<BlockExplanation>(
    `/api/blocks/practice/${languageId}`,
    'GET'
  );

  return (
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
            <ButtonReset
              key={idx}
              disabled={false}
              apiPath={`/api/blocks/${block.blockId}`}
              modalMessage="Opravdu chcete restartovat blok? Veškerý pokrok souvisejících položek bude ztracen."
              className="h-C flex justify-start px-2"
              onReset={() => {
                setArray((prev) =>
                  prev.filter((b) => b.blockId !== block.blockId)
                );
              }}
            >
              <span className="mr-2 inline-block w-15 text-right">
                {block.blockSequence}
              </span>
              {block.blockName}
            </ButtonReset>
          ))}
        </div>
      )}
    </div>
  );
}
