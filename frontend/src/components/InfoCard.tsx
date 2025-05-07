import { useInfoArray } from '../hooks/useInfoArray';
import Button from './common/Button';
import { NextIcon, PreviousIcon, CloseIcon } from './common/Icons';
import { useAudioManager } from '../hooks/useAudioManager';
import { useEffect } from 'react';

export default function InfoCard({
  itemId,
  setInfo,
}: {
  itemId: number;
  setInfo: (info: boolean) => void;
}) {
  const { infoArray, infoIndex, setInfoIndex } = useInfoArray(itemId);
  const { playAudio } = useAudioManager(infoArray?.[infoIndex]?.items ?? []);

  useEffect(() => {
    if (infoArray?.[infoIndex]?.items?.[0]?.audio) {
      playAudio(infoArray[infoIndex].items[0].audio);
    }
  }, [infoIndex, infoArray, playAudio]);

  if (infoArray?.length === 0) {
    return <p>Loading ... </p>;
  }

  function handlePrevious() {
    if (infoIndex > 0) {
      setInfoIndex(infoIndex - 1);
    }
  }

  function handleNext() {
    if (infoIndex < infoArray.length - 1) {
      setInfoIndex(infoIndex + 1);
    }
  }

  return (
    <div className="flex h-[320px] w-[320px] flex-col justify-between gap-1">
      <div className="flex h-12 w-full gap-1">
        <div className="color-secondary-disabled flex flex-10 flex-col justify-center pl-4">
          {infoArray?.[infoIndex].block_name}
        </div>
        <Button
          name="close"
          buttonColor="button-secondary"
          className="flex-2"
          onClick={() => setInfo(false)}
        >
          <CloseIcon />
        </Button>
      </div>
      <div className="color-secondary-disabled h-full flex-1">
        {infoArray?.[infoIndex].items.length === 0 ? (
          <div
            className="flex flex-col justify-center pl-4"
            dangerouslySetInnerHTML={{
              __html: infoArray?.[infoIndex].block_explanation,
            }}
          ></div>
        ) : (
          <div className="flex h-full flex-col gap-1">
            {infoArray?.[infoIndex].items.map((item) => (
              <Button
                key={item.id}
                buttonColor="button-secondary"
                onClick={() => playAudio(item.audio)}
              >
                {item.english} - {item.pronunciation}
              </Button>
            ))}
          </div>
        )}
      </div>

      <div className="flex gap-1">
        <Button
          name="previous"
          onClick={handlePrevious}
          disabled={infoIndex === 0}
        >
          <PreviousIcon />
        </Button>
        <Button
          name="next"
          onClick={handleNext}
          disabled={infoIndex === infoArray.length - 1}
        >
          <NextIcon />
        </Button>
      </div>
    </div>
  );
}
