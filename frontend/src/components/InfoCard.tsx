import Button from './common/Button';
import { CloseIcon } from './common/Icons';
import { useAudioManager } from '../hooks/useAudioManager';
import { Dispatch, SetStateAction } from 'react';
import PrevNextControls from './common/PrevNextControls';
import { useArray } from '../hooks/useArray';
import type { ItemInfo } from '../../../shared/types/dataTypes';

export default function InfoCard({
  itemId,
  setVisibility,
}: {
  itemId: number;
  setVisibility: Dispatch<SetStateAction<boolean>>;
}) {
  const { itemArray, index, nextIndex, prevIndex, itemArrayLength } =
    useArray<ItemInfo>(`/api/items/${itemId}/info`);
  const { playAudio } = useAudioManager(itemArray?.[index]?.items ?? []);

  if (itemArray?.length === 0) {
    return <p>Loading ... </p>;
  }

  return (
    <div className="card">
      <div className="flex w-full gap-1">
        <div className="color-disabled shape-rectangular flex flex-10 flex-col justify-center pl-4">
          {itemArray?.[index].block_name}
        </div>
        <Button
          name="close"
          className="button-rectangular flex-2"
          onClick={() => setVisibility(false)}
        >
          <CloseIcon />
        </Button>
      </div>
      <div className="color-disabled h-full">
        {itemArray?.[index].items.length === 0 ? (
          <div
            className="flex flex-col justify-center pl-4"
            dangerouslySetInnerHTML={{
              __html: itemArray?.[index].block_explanation,
            }}
          ></div>
        ) : (
          <div className="flex h-full flex-col gap-1">
            {itemArray?.[index].items.map((item) => (
              <Button
                key={item.id}
                buttonColor="button-primary button-rectangular px-12"
                onClick={() => playAudio(item.audio)}
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
        arrayLength={itemArrayLength}
      />
    </div>
  );
}
