import { Dispatch, SetStateAction } from 'react';
import { CloseIcon, AudioIcon, RestartIcon } from './Icons.js';
import Button from './Button.js';
import { Item, PracticeError } from '../../../../shared/types/dataTypes.js';
import ButtonReset from './ButtonReset.js';
import { useUser } from '../../hooks/useUser.js';
import config from '../../config/config.js';
import { useAudioManager } from '../../hooks/useAudioManager.js';
import VolumeSlider from './VolumeSlider.js';
import { useEffect, useState } from 'react';
import { getErrorMessage } from '../../utils/error.utils';
import HelpOverlay from './HelpOverlay.js';
import GuideHint from './GuideHint.js';

export default function WordCard({
  item,
  setVisibility,
  canReset = false,
  onReset,
}: {
  item: Item;
  setVisibility: Dispatch<SetStateAction<boolean>>;
  canReset?: boolean;
  onReset?: () => void;
}) {
  const { languageId } = useUser();
  const { playAudio, setVolume, setAudioError, tryAudio, audioError } =
    useAudioManager([item]);
  const [error, setError] = useState<PracticeError | null>(null);
  const [isHelpVisible, setIsHelpVisible] = useState(false);

  // Reset audio error for new item
  useEffect(() => {
    setAudioError(false);
  }, [setAudioError, item]);

  // Error setter
  useEffect(() => {
    if (!item?.audio || audioError) {
      setError(PracticeError.NoAudio);
      const retryTimeout = setTimeout(() => {
        if (tryAudio(item.audio)) {
          setError(null);
        } else {
          setError(PracticeError.NoAudio);
        }
      }, 3000);

      return () => clearTimeout(retryTimeout);
    } else {
      setError(null);
    }
  }, [item, audioError, tryAudio]);

  return (
    <div className="help-overlay">
      <HelpOverlay
        name="showWordCardHelp"
        setIsHelpVisible={setIsHelpVisible}
      />
      <div className="card">
        <div className="flex gap-1">
          <ButtonReset
            disabled={!canReset}
            apiPath={`/api/items/${item?.id}/reset`}
            modalMessage="Opravdu chcete restartovat progress slovíčka?"
            className="relative flex w-full items-center justify-center"
            onReset={onReset}
          >
            <RestartIcon />
            <GuideHint
              visibility={isHelpVisible}
              text={'restartovat progress slovíčka'}
              style={{
                top: '5px',
                left: '5px',
                width: '30px',
              }}
            />
          </ButtonReset>
          <Button
            onClick={() => {
              playAudio(item.audio);
            }}
            className="h-A relative w-full"
          >
            <AudioIcon />
            <GuideHint
              visibility={isHelpVisible}
              text={'audio'}
              style={{
                top: '30px',
                left: '5px',
              }}
              className="text-left"
            />
          </Button>
          <Button
            name="close"
            className="relative w-13 flex-shrink-0 flex-grow-0"
            onClick={() => setVisibility(false)}
            aria-label="Zavřít vysvětlení"
          >
            <CloseIcon />
            <GuideHint
              visibility={isHelpVisible}
              text={'zpět'}
              style={{
                top: '30px',
                left: '5px',
              }}
            />
          </Button>
        </div>
        <div className="color-disabled relative flex h-full flex-col justify-between pt-12 pl-4">
          <VolumeSlider
            setVolume={setVolume}
            helpVisibility={false}
            style={{
              top: '15px',
              left: '15px',
            }}
            className="absolute"
          />
          <div className="grid grid-cols-2 items-start justify-start gap-0 overflow-y-auto pt-8">
            <p>česky</p>
            <p>{item?.czech}</p>
            {config.languages.find((lang) => lang.id === languageId)?.adverb}
            <p>{item?.translation}</p>
            <p className="pb-4">výslovnost</p>
            <p>{item?.pronunciation}</p>
            <p>datum příště</p>
            <p>{item?.nextDate || 'neprocvičováno'}</p>
            <p>datum naučení</p>
            <p>{item?.learnedDate || 'nenaučeno'}</p>
            <p className="pb-4">datum dokončení</p>
            <p>{item?.masteredDate || 'nedokončeno'}</p>
          </div>
          <p className="error h-5 whitespace-nowrap">
            {getErrorMessage(error)}
          </p>
        </div>
      </div>
    </div>
  );
}
