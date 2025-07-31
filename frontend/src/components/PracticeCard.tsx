import { useEffect, useState, useCallback } from 'react';
import Button from './common/Button';
import { InfoIcon, SkipIcon, HintIcon, EyeIcon } from './common/Icons';
import config from '../config/config';
import { useAudioManager } from '../hooks/useAudioManager';
import {
  PracticeError,
  UserScore,
  Item,
} from '../../../shared/types/dataTypes';
import { usePatchOnUnmount } from '../hooks/usePatchOnUnmount';
import { fetchWithAuthAndParse } from '../utils/auth.utils';
import { useUser } from '../hooks/useUser';
import { useArray } from '../hooks/useArray';
import ContextInfoCard from './ContextCard';
import Loading from './common/Loading';
import { getErrorMessage } from '../utils/error.utils';
import { alternateDirection } from '../utils/practice.utils';
import Overlay from './common/Overlay';
import GuideHint from './common/GuideHint';
import VolumeSlider from './common/VolumeSlider';
import PlusMinus from './common/PlusMinus';

export default function PracticeCard() {
  const { userScore, setUserScore, languageID } = useUser();
  const apiPath = `/api/items/${languageID}/practice`;
  const { array, index, nextIndex, arrayLength, setReload, currentItem } =
    useArray<Item>(apiPath, 'GET');
  const {
    playAudio,
    setVolume,
    stopAudio,
    audioReload,
    setAudioReload,
    audioError,
    setAudioError,
  } = useAudioManager(array);

  const [userProgress, setUserProgress] = useState<number[]>([]);
  const [revealed, setRevealed] = useState(false);
  const [hintIndex, setHintIndex] = useState(0);
  const [infoVisibility, setInfoVisibility] = useState(false);
  const [error, setError] = useState<PracticeError | null>(null);
  const [activeOverlay, setActiveOverlay] = useState<string | null>('first');

  const direction = alternateDirection(currentItem?.progress);
  const isAudioDisabled = (direction && !revealed) || !currentItem?.audio;
  const noAudio = error === PracticeError.NoAudio;
  const firstOverlay = activeOverlay === 'first';
  const secondOverlay = activeOverlay === 'second';
  const currLanguage = userScore?.find(
    (lang) => lang.languageID === languageID
  );

  // Show Info by default if the item has showContextInfo set to true
  useEffect(() => {
    if (currentItem?.showContextInfo === true) {
      setInfoVisibility(true);
    }
  }, [currentItem]);

  // Reset audio error for new item
  useEffect(() => {
    setAudioError(false);
  }, [setAudioError, currentItem]);

  // Sending user progress to the server
  const patchItems = useCallback(
    async (onBlockEnd: boolean, updatedProgress: number[]) => {
      const updatedArray = array
        .filter((_, idx) => idx < updatedProgress.length)
        .map((item, idx) => ({
          ...item,
          progress: updatedProgress[idx],
        }));

      if (updatedArray.length === 0) return;
      setUserProgress([]);

      try {
        const response = await fetchWithAuthAndParse<{
          score: UserScore[] | null;
        }>(apiPath, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            items: updatedArray,
            onBlockEnd,
          }),
        });

        const newUserScore = response?.score || null;
        setUserScore(newUserScore);
      } catch (error) {
        console.error('Error posting words:', error);
      }
    },
    [apiPath, setUserScore, array]
  );

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
    ]
  );

  // Set direction based on current item progress, play audio if needed
  useEffect(() => {
    if (!direction && currentItem?.audio && !audioReload && !firstOverlay) {
      setTimeout(() => playAudio(currentItem.audio!), 100);
    }
  }, [currentItem, playAudio, audioReload, direction, firstOverlay]);

  // Patch items on unmount
  usePatchOnUnmount(patchItems, userProgress);

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
              <Button
                onClick={() => setInfoVisibility(true)}
                disabled={!currentItem?.hasContextInfo || !revealed}
                className="relative"
                aria-label="Zobrazit informace"
              >
                <GuideHint
                  visibility={secondOverlay}
                  text="gramatika"
                  style={{ left: '5px', bottom: '0px' }}
                />
                <InfoIcon />
              </Button>
              <Button
                onClick={() => {
                  updateItemArray(config.skipProgress);
                }}
                disabled={!revealed}
                className="relative"
                aria-label="Přeskočit slovíčko"
              >
                <GuideHint
                  visibility={secondOverlay}
                  text="přeskočit slovíčko"
                  style={{ right: '5px', bottom: '0px' }}
                />
                <SkipIcon></SkipIcon>
              </Button>
            </div>
            <div className="flex gap-1">
              {!revealed ? (
                <>
                  <Button
                    onClick={() => setHintIndex((prevIndex) => prevIndex + 1)}
                    className="relative"
                    aria-label="Nápověda"
                  >
                    <GuideHint
                      visibility={firstOverlay}
                      text="nápověda"
                      style={{ left: '5px', bottom: '0px' }}
                    />
                    <HintIcon></HintIcon>
                  </Button>
                  <Button
                    onClick={() => {
                      setRevealed(true);
                      if (activeOverlay === 'beforeSecond') {
                        setActiveOverlay('second');
                      }
                      if (direction && currentItem?.audio)
                        playAudio(currentItem.audio);
                      setHintIndex(0);
                    }}
                    className="relative"
                    aria-label="Zobrazit odpověď"
                  >
                    <GuideHint
                      visibility={firstOverlay}
                      text="odhalit překlad"
                      style={{ right: '5px', bottom: '0px' }}
                    />
                    <EyeIcon></EyeIcon>
                  </Button>
                </>
              ) : (
                <PlusMinus
                  onPlus={() => updateItemArray(config.plusProgress)}
                  onMinus={() => updateItemArray(config.minusProgress)}
                  helpVisibility={secondOverlay}
                />
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
}
