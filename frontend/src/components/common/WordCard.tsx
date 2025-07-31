import { Dispatch, SetStateAction } from 'react';
import { CloseIcon } from './Icons.js';
import Button from './Button.js';
import { Item, PracticeError } from '../../../../shared/types/dataTypes.js';
import ButtonReset from './ButtonReset.js';
import { useUser } from '../../hooks/useUser.js';
import config from '../../config/config.js';
import { useAudioManager } from '../../hooks/useAudioManager.js';
import VolumeSlider from './VolumeSlider.js';
import { useEffect, useState } from 'react';
import { getErrorMessage } from '../../utils/error.utils';

export default function WordCard({
  item,
  setVisibility,
  canReset = false,
  resetPath = '',
}: {
  item: Item;
  setVisibility: Dispatch<SetStateAction<boolean>>;
  canReset?: boolean;
  resetPath?: string;
}) {
  const { languageID } = useUser();
  const { playAudio, setVolume, setAudioError, audioError } = useAudioManager([
    item,
  ]);
  const [error, setError] = useState<PracticeError | null>(null);

  // Reset audio error for new item
  useEffect(() => {
    setAudioError(false);
  }, [setAudioError, item]);

  // Error setter
  useEffect(() => {
    if (!item?.audio || audioError) {
      setError(PracticeError.NoAudio);
    } else {
      setError(null);
    }
  }, [item, audioError, playAudio]);

  return (
    <div className="card">
      <div className="flex gap-1">
        <ButtonReset
          disabled={!canReset}
          apiPath={resetPath}
          modalMessage="Opravdu chcete restartovat progress slovíčka?"
          className="w-full"
        >
          <h2 className="font-display font-semibold">Restartovat progress</h2>
        </ButtonReset>
        <Button
          name="close"
          className="w-13 flex-shrink-0 flex-grow-0"
          onClick={() => setVisibility(false)}
          aria-label="Zavřít vysvětlení"
        >
          <CloseIcon />
        </Button>
      </div>
      <div className="color-disabled h-full pt-3">
        <VolumeSlider
          setVolume={setVolume}
          helpVisibility={false}
          className="px-6 pb-2"
        />
        <div className="grid grid-cols-2 items-start justify-start gap-0 overflow-y-auto px-6 py-4">
          <p>česky</p>
          <p>{item?.czech}</p>
          {config.languages.find((lang) => lang.id === languageID)?.adverb}
          <p>{item?.translation}</p>
          <p>výslovnost</p>
          <p>{item?.pronunciation}</p>
          <p>progress</p>
          <p>{item?.progress}</p>
          <p>audio</p>
        </div>
        <p className="error h-5 whitespace-nowrap">{getErrorMessage(error)}</p>
      </div>
      <Button
        onClick={() => {
          playAudio(item.audio);
        }}
        className="h-A flex-none"
      >
        {item?.audio}
      </Button>
    </div>
  );
}
