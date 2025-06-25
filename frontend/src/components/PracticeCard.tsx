import { useEffect, useState, useCallback } from 'react';
import Button from './common/Button';
import {
  InfoIcon,
  AudioIcon,
  HintIcon,
  EyeIcon,
  PlusIcon,
  MinusIcon,
  VolumeIcon,
} from './common/Icons';
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
import InfoCard from './InfoCard';
import Loading from './common/Loading';
import { getErrorMessage } from '../utils/error.utils';
import { alternateDirection } from '../utils/practice.utils';
import Overlay from './common/Overlay';
import GuideHint from './common/GuideHint';

export default function PracticeCard() {
  const apiPath = '/api/items';
  const { array, index, nextIndex, arrayLength, setReload, currentItem } =
    useArray<Item>(apiPath);
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
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const [volume, setVolumeState] = useState(1);
  const [activeOverlay, setActiveOverlay] = useState<string | null>('first');

  const { setUserScore } = useUser();

  const direction = alternateDirection(currentItem?.progress);
  const isAudioDisabled = (direction && !revealed) || !currentItem?.audio;
  const noAudio = error === PracticeError.NoAudio;
  const firstOverlay = activeOverlay === 'first';
  const secondOverlay = activeOverlay === 'second';

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
          score: UserScore | null;
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

  // Handle volume change
  const handleVolumeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(event.target.value);
    setVolumeState(newVolume);
    setVolume(newVolume);
  };

  if (!arrayLength)
    return <Loading text="Nic k procvičování. Zkuste to později." />;

  return (
    <>
      {/* Main content */}
      {infoVisibility ? (
        <InfoCard itemId={currentItem?.id} setVisibility={setInfoVisibility} />
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
              className={`color-card relative flex h-full w-full flex-col items-center justify-between px-4 pt-3 pb-2 ${!direction && 'color-highlighted'} `}
            >
              <GuideHint
                visibility={secondOverlay}
                text="vyslovte slovíčko nahlas"
                style={{
                  top: '20px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                }}
              />
              <div className="flex w-full items-center justify-between">
                <div className="relative flex pt-1">
                  <button
                    onClick={() => setShowVolumeSlider((prev) => !prev)}
                    aria-label="Nastavit hlasitost"
                    disabled={noAudio}
                  >
                    <GuideHint
                      visibility={firstOverlay}
                      text="hlasitost"
                      style={{ left: '-10px' }}
                    />
                    <VolumeIcon />
                  </button>
                  {showVolumeSlider && (
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.01"
                      value={volume}
                      onChange={handleVolumeChange}
                      className="ml-2 w-24"
                      autoFocus
                      aria-valuenow={volume}
                      aria-valuemin={0}
                      aria-valuemax={1}
                      disabled={noAudio}
                    />
                  )}
                </div>
                <p className="relative flex w-full justify-end text-sm">
                  {index + 1} / {arrayLength}
                  <GuideHint
                    visibility={firstOverlay}
                    text="slovíčka v bloku"
                    style={{ right: '-10px' }}
                  />
                </p>
              </div>

              <div>
                <p className="text-center font-bold">
                  {direction || revealed ? currentItem.czech : '\u00A0'}
                </p>
                <p className="text-center">
                  {revealed || (noAudio && !direction)
                    ? currentItem?.english
                    : currentItem?.english
                        .slice(0, hintIndex ?? currentItem?.english.length)
                        .padEnd(currentItem?.english.length, '\u00A0')}
                </p>
                <p className="text-center">
                  {revealed ? currentItem?.pronunciation || '\u00A0' : '\u00A0'}
                </p>
              </div>
              <div className="flex w-full items-center justify-between">
                <p className="relative flex w-full justify-start text-sm">
                  {currentItem?.progress}
                  <GuideHint
                    visibility={firstOverlay}
                    text="pokrok slovíčka"
                    style={{ left: '-10px', top: '-55px' }}
                  />
                </p>
                <p className="color-error whitespace-nowrap">
                  {getErrorMessage(error)}
                </p>
              </div>
            </div>

            {/* Progress Bar with audi, blockcount and item infor */}
            <div className="flex justify-center gap-1">
              <Button
                onClick={() => {
                  if (currentItem?.audio) playAudio(currentItem.audio);
                }}
                disabled={isAudioDisabled}
                className="button-rectangular relative flex-1"
                aria-label="Přehrát audio"
              >
                <GuideHint
                  visibility={firstOverlay}
                  text="přehrát audio"
                  style={{ left: '5px' }}
                />
                <AudioIcon></AudioIcon>
              </Button>

              <Button
                onClick={() => setInfoVisibility(true)}
                disabled={!currentItem?.hasContextInfo || !revealed}
                className="button-rectangular relative flex-1"
                aria-label="Zobrazit informace"
              >
                <GuideHint
                  visibility={firstOverlay}
                  text="gramatika"
                  style={{ right: '5px' }}
                />
                <InfoIcon />
              </Button>
            </div>
            {/* Practice Controls */}
            <div className="flex w-full justify-between gap-1">
              {!revealed ? (
                <>
                  <Button
                    onClick={() => setHintIndex((prevIndex) => prevIndex + 1)}
                    className="button-rectangular relative"
                    aria-label="Nápověda"
                  >
                    <GuideHint
                      visibility={firstOverlay}
                      text="nápověda"
                      style={{ left: '5px' }}
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
                    className="button-rectangular relative"
                    aria-label="Zobrazit odpověď"
                  >
                    <GuideHint
                      visibility={firstOverlay}
                      text="odhalit překlad"
                      style={{ right: '5px' }}
                    />
                    <EyeIcon></EyeIcon>
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    onClick={() => {
                      updateItemArray(config.minusProgress);
                    }}
                    className="button-rectangular relative"
                    aria-label="Snížit skore"
                  >
                    <GuideHint
                      visibility={secondOverlay}
                      text="neznám"
                      style={{
                        left: '5px',
                      }}
                    />
                    <MinusIcon></MinusIcon>
                  </Button>
                  <Button
                    onClick={() => {
                      updateItemArray(config.plusProgress);
                    }}
                    className="button-rectangular relative"
                    aria-label="Zvýšit skore"
                  >
                    <GuideHint
                      visibility={secondOverlay}
                      text="znám"
                      style={{
                        right: '5px',
                      }}
                    />
                    <PlusIcon></PlusIcon>
                  </Button>
                </>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
}
