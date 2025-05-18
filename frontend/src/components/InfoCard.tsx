import Button from './common/Button';
import { CloseIcon } from './common/Icons';
import { useAudioManager } from '../hooks/useAudioManager';
import { Dispatch, SetStateAction } from 'react';
import PrevNextControls from './common/PrevNextControls';
import { useArray } from '../hooks/useArray';
import Loading from './common/Loading';
import type { ItemInfo } from '../../../shared/types/dataTypes';

export default function InfoCard({
  itemId,
  setVisibility,
}: {
  itemId: number;
  setVisibility: Dispatch<SetStateAction<boolean>>;
}) {
  const { array, index, nextIndex, prevIndex, arrayLength } =
    useArray<ItemInfo>(`/api/items/${itemId}/info`);
  const { playAudio } = useAudioManager(array?.[index]?.items ?? []);

  const current = array?.[index];

  if (!current) {
    return <Loading />;
  }

  return (
    <div className="card">
      <div className="flex w-full gap-1">
        <div className="color-disabled shape-rectangular flex flex-10 flex-col justify-center pl-4">
          <h2 className="font-semibold">{current.block_name}</h2>
        </div>
        <Button
          name="close"
          type="button"
          className="button-rectangular flex-2"
          onClick={() => setVisibility(false)}
          aria-label="Zavřít informace"
        >
          <CloseIcon />
        </Button>
      </div>
      <div className="color-disabled h-full">
        {current.items.length === 0 ? (
          <div
            className="flex flex-col justify-center pl-4"
            dangerouslySetInnerHTML={{
              __html: current.block_explanation,
            }}
          ></div>
        ) : (
          <div className="flex h-full flex-col gap-1">
            {current.items.map((item) => (
              <Button
                key={item.id}
                buttonColor="button-primary"
                className="button-rectangular px-12"
                onClick={() => playAudio(item.audio)}
                aria-label={`Přehrát ${item.english}`}
              >
                <div className="flex w-full justify-between">
                  <span>{item.english}</span>
                  <span>{item.pronunciation}</span>
                </div>
              </Button>
            ))}
          </div>
        )}
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
