import { Dispatch, SetStateAction } from 'react';
import { CloseIcon, AudioIcon } from './Icons.js';
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
  resetPath = '',
}: {
  item: Item;
  setVisibility: Dispatch<SetStateAction<boolean>>;
  canReset?: boolean;
  resetPath?: string;
}) {
  const { languageID } = useUser();
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
    <div className="card relative">
      <HelpOverlay
        name="showWordCardHelp"
        setIsHelpVisible={setIsHelpVisible}
      />
      <div className="flex gap-1">
        <ButtonReset
          disabled={!canReset}
          apiPath={resetPath}
          modalMessage="Opravdu chcete restartovat progress slovíčka?"
          className="w-full"
        >
          <h2 className="font-display relative font-normal">
            <span className="pr-4">progress</span>
            {item?.progress}
          </h2>
          <GuideHint
            visibility={isHelpVisible}
            text={'restartovat progress slovíčka'}
            style={{
              top: '30px',
              left: '5px',
            }}
          />
        </ButtonReset>
        <Button
          onClick={() => {
            playAudio(item.audio);
          }}
          className="h-A w-A relative flex-none"
        >
          <AudioIcon />
          <GuideHint
            visibility={isHelpVisible}
            text={'přehrát audio'}
            style={{
              top: '30px',
              left: '5px',
            }}
            className="text-left"
          />
        </Button>
        <Button
          name="close"
          className="w-13 flex-shrink-0 flex-grow-0"
          onClick={() => setVisibility(false)}
          aria-label="Zavřít vysvětlení"
        >
          <CloseIcon />
        </Button>
      </div>
      <div className="color-disabled relative flex h-full flex-col justify-between px-4 py-12">
        <VolumeSlider
          setVolume={setVolume}
          helpVisibility={false}
          style={{
            top: '5px',
            left: '10px',
          }}
          className="absolute"
        />
        <div className="grid grid-cols-2 items-start justify-start gap-0 overflow-y-auto">
          <p>česky</p>
          <p>{item?.czech}</p>
          {config.languages.find((lang) => lang.id === languageID)?.adverb}
          <p>{item?.translation}</p>
          <p className="pb-4">výslovnost</p>
          <p>{item?.pronunciation}</p>
          <p>datum příště</p>

          <p>{item?.nextDate}</p>
          <p>datum naučení</p>
          <p>{item?.learnedDate}</p>
          <p>datum dokončení</p>
          <p>{item?.masteredDate}</p>
        </div>
        <p className="error h-5 whitespace-nowrap">{getErrorMessage(error)}</p>
      </div>
    </div>
  );
}
