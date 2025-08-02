import { useEffect, useState, useCallback } from 'react';
import {
  InfoIcon,
  SkipIcon,
  HintIcon,
  EyeIcon,
  PlusIcon,
  MinusIcon,
} from './common/Icons';
import config from '../config/config';
import { useAudioManager } from '../hooks/useAudioManager';
import { PracticeError } from '../../../shared/types/dataTypes';
import { useUser } from '../hooks/useUser';
import ContextInfoCard from './common/ContextInfoCard.js';
import Loading from './common/Loading';
import { getErrorMessage } from '../utils/error.utils';
import Overlay from './common/Overlay';
import GuideHint from './common/GuideHint';
import VolumeSlider from './common/VolumeSlider';

import { useItemArray } from '../hooks/useItemArray';
import ButtonWithHelp from './common/ButtonWithHelp';

export default function PracticeCard() {
  const { userScore, languageID } = useUser();
  const apiPath = `/api/items/${languageID}/practice`;

  const {
    array,
    index,
    nextIndex,
    arrayLength,
    setReload,
    currentItem,
    direction,
    showContextInfo,
    userProgress,
    setUserProgress,
    patchItems,
  } = useItemArray(apiPath);

  const {
    playAudio,
    setVolume,
    stopAudio,
    audioReload,
    setAudioReload,
    audioError,
    setAudioError,
  } = useAudioManager(array);

  const [revealed, setRevealed] = useState(false);
  const [hintIndex, setHintIndex] = useState(0);
  const [infoVisibility, setInfoVisibility] = useState(false);
  const [error, setError] = useState<PracticeError | null>(null);
  const [activeOverlay, setActiveOverlay] = useState<string | null>('first');

  const isAudioDisabled = (direction && !revealed) || !currentItem?.audio;
  const noAudio = error === PracticeError.NoAudio;
  const firstOverlay = activeOverlay === 'first';
  const secondOverlay = activeOverlay === 'second';

  const currLanguage = userScore?.find(
    (lang) => lang.languageID === languageID
  );

  // Show Info by default if the item has showContextInfo set to true
  useEffect(() => {
    setInfoVisibility(showContextInfo);
  }, [showContextInfo, currentItem]);

  // Reset audio error for new item
  useEffect(() => {
    setAudioError(false);
  }, [setAudioError, currentItem]);

  // Update userProgress, if end of array reached, patch items
  const updateItemArray = useCallback(
    async (progressIncrement: number = 0) => {
      setRevealed(false);
      stopAudio();

      const newProgress = Math.max(
        array[index].progress + progressIncrement,
        0
      );
      const updatedProgress = userProgress.concat(newProgress);

      if (arrayLength > 0) {
        if (index + 1 >= arrayLength) {
          await patchItems(true, updatedProgress);
          setAudioReload(true);
          setReload(true);
        } else {
          setUserProgress(updatedProgress);
          nextIndex();
        }
      }
    },
    [
      array,
      arrayLength,
      index,
      nextIndex,
      patchItems,
      setReload,
      setAudioReload,
      stopAudio,
      userProgress,
      setUserProgress,
    ]
  );

  // Set direction based on current item progress, play audio if needed
  useEffect(() => {
    if (!direction && currentItem?.audio && !audioReload && !firstOverlay) {
      setTimeout(() => playAudio(currentItem.audio!), 100);
    }
  }, [currentItem, playAudio, audioReload, direction, firstOverlay]);

  // Error setter
  useEffect(() => {
    if (!currentItem?.audio || audioError) {
      setError(PracticeError.NoAudio);
    } else {
      setError(null);
    }

    if (audioError) {
      let attempts = 0; // Initialize attempts counter
      const interval = setInterval(() => {
        if (attempts >= 3) {
          clearInterval(interval); // Stop after 3 attempts
          return;
        }
        playAudio(currentItem.audio);
        attempts++;
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [currentItem, audioError, playAudio]);

  if (!arrayLength)
    return <Loading text="Nic k procvičování. Zkuste to znovu později." />;

  return (
    <>
      {/* Main content */}
      {infoVisibility ? (
        <ContextInfoCard
          itemId={currentItem?.id}
          setVisibility={setInfoVisibility}
        />
      ) : (
        <>
          {/* First Overlay */}
          {firstOverlay && (
            <Overlay onClose={() => setActiveOverlay('beforeSecond')} />
          )}

          {/* Second Overlay */}
          {secondOverlay && <Overlay onClose={() => setActiveOverlay(null)} />}
          <div className="card">
            {/* Card content with item details */}
            <div
              className={`color-disabled relative flex h-full flex-col items-center justify-between px-4 pt-3 pb-2 ${!isAudioDisabled && 'color-audio'} `}
              onClick={() => {
                if (!isAudioDisabled) playAudio(currentItem.audio);
              }}
              aria-label="Přehrát audio"
            >
              <GuideHint
                visibility={secondOverlay}
                text="vyslovte slovíčko několikrát nahlas"
                style={{
                  top: '30px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                }}
                className="w-100 text-center"
              />
              <GuideHint
                visibility={secondOverlay}
                text="kliknutím na kartu se znovu přehraje audio "
                style={{
                  bottom: '30px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                }}
                className="w-100 text-center"
              />
              <div
                id="top-bar"
                className="relative flex w-full items-center justify-between"
              >
                <VolumeSlider
                  setVolume={setVolume}
                  helpVisibility={firstOverlay}
                />
                <p className="text-sm">
                  {index + 1} / {arrayLength}
                  <GuideHint
                    visibility={firstOverlay}
                    text="slovíčka v bloku"
                    style={{ right: '-10px', bottom: '-20px' }}
                  />
                </p>
              </div>
              <div id="item">
                <p className="text-center font-bold">
                  {direction || revealed ? currentItem.czech : '\u00A0'}
                </p>
                <p className="text-center">
                  {revealed || (noAudio && !direction)
                    ? currentItem?.translation
                    : currentItem?.translation
                        .slice(0, hintIndex ?? currentItem?.translation.length)
                        .padEnd(currentItem?.translation.length, '\u00A0')}
                </p>
                <p className="text-center">
                  {revealed ? currentItem?.pronunciation || '\u00A0' : '\u00A0'}
                </p>
              </div>
              <div
                className="relative flex w-full items-center justify-between"
                id="bottom-bar"
              >
                <p className="text-sm">
                  {currentItem?.progress}
                  <GuideHint
                    visibility={firstOverlay}
                    text="pokrok slovíčka"
                    style={{ left: '-10px', top: '-20px' }}
                  />
                </p>
                <p className="error h-5 whitespace-nowrap">
                  {getErrorMessage(error)}
                </p>
                <p className="text-sm">
                  {currLanguage?.blockCount[0]} / {config.dailyBlocks}
                  <GuideHint
                    visibility={firstOverlay}
                    text="bloků dnes"
                    style={{ right: '-10px', top: '-20px' }}
                  />
                </p>
              </div>
            </div>

            {/* Practice Controls */}
            <div id="practice-controls" className="flex gap-1">
              <ButtonWithHelp
                onClick={() => setInfoVisibility(true)}
                disabled={!currentItem?.hasContextInfo || !revealed}
                helpVisibility={secondOverlay}
                helpText="zobrazit informace"
                style={{ left: '5px', bottom: '0px' }}
                icon={<InfoIcon />}
              />
              <ButtonWithHelp
                onClick={() => {
                  updateItemArray(config.skipProgress);
                }}
                disabled={!revealed}
                helpVisibility={secondOverlay}
                helpText="přeskočit slovíčko"
                style={{ right: '5px', bottom: '0px' }}
                icon={<SkipIcon />}
              />
            </div>
            <div className="flex gap-1">
              {!revealed ? (
                <>
                  <ButtonWithHelp
                    onClick={() => setHintIndex((prevIndex) => prevIndex + 1)}
                    helpVisibility={firstOverlay}
                    helpText="nápověda"
                    style={{ left: '5px', bottom: '0px' }}
                    icon={<HintIcon />}
                  />
                  <ButtonWithHelp
                    onClick={() => {
                      setRevealed(true);
                      if (activeOverlay === 'beforeSecond') {
                        setActiveOverlay('second');
                      }
                      if (direction && currentItem?.audio)
                        playAudio(currentItem.audio);
                      setHintIndex(0);
                    }}
                    helpVisibility={firstOverlay}
                    helpText="odhalit překlad"
                    style={{ right: '5px', bottom: '0px' }}
                    icon={<EyeIcon />}
                  />
                </>
              ) : (
                <>
                  <ButtonWithHelp
                    onClick={() => updateItemArray(config.minusProgress)}
                    helpVisibility={secondOverlay}
                    helpText="neznám"
                    style={{
                      left: '5px',
                      bottom: '0px',
                    }}
                    icon={<MinusIcon />}
                  />
                  <ButtonWithHelp
                    onClick={() => updateItemArray(config.plusProgress)}
                    helpVisibility={secondOverlay}
                    helpText="znám"
                    style={{
                      right: '5px',
                      bottom: '0px',
                    }}
                    icon={<PlusIcon />}
                  />
                </>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
}
