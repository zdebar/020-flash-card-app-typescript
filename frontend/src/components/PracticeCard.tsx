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
import { PracticeCardBar } from './common/PracticeCardBar';
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

export default function PracticeCard() {
  const apiPath = '/api/items';
  const { array, index, nextIndex, arrayLength, setReload, currentItem } =
    useArray<Item>(apiPath);
  const { playAudio, setVolume, stopAudio, audioReload, setAudioReload } =
    useAudioManager(array);

  const [userProgress, setUserProgress] = useState<number[]>([]);
  const [revealed, setRevealed] = useState(false);
  const [hintIndex, setHintIndex] = useState(0);
  const [infoVisibility, setInfoVisibility] = useState(false);
  const [error, setError] = useState<PracticeError | null>(null);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const [volume, setVolumeState] = useState(1);

  const [isOverlayVisible, setOverlayVisible] = useState(true);
  const [isSecondOverlayVisible, setSecondOverlayVisible] = useState(false);
  const [hasSecondOverlayShown, setHasSecondOverlayShown] = useState(false);

  const { setUserScore, userScore } = useUser();

  const direction = alternateDirection(currentItem?.progress);
  const isAudioDisabled = (direction && !revealed) || !currentItem?.audio;
  const noAudio = error === PracticeError.NoAudio;

  // Close guide overlay
  const handleCloseOverlay = () => {
    setOverlayVisible(false);
  };

  const handleCloseSecondOverlay = () => {
    setSecondOverlayVisible(false);
  };

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
    if (!direction && currentItem?.audio && !audioReload) {
      setTimeout(() => playAudio(currentItem.audio!), 100);
    }
  }, [currentItem, playAudio, audioReload, direction]);

  // Patch items on unmount
  usePatchOnUnmount(patchItems, userProgress);

  // Error setter
  useEffect(() => {
    if (!currentItem?.audio) {
      setError(PracticeError.NoAudio);
    } else {
      setError(null);
    }
  }, [currentItem]);

  // Handle volume change
  const handleVolumeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(event.target.value);
    setVolumeState(newVolume);
    setVolume(newVolume);
  };

  if (!arrayLength) return <Loading />;

  return (
    <>
      <Overlay
        isVisible={isOverlayVisible}
        onClose={handleCloseOverlay}
        isRevealed={false}
      />
      <Overlay
        isVisible={isSecondOverlayVisible}
        onClose={handleCloseSecondOverlay}
        isRevealed={true}
      ></Overlay>
      {infoVisibility ? (
        <InfoCard itemId={currentItem?.id} setVisibility={setInfoVisibility} />
      ) : (
        <div className="card relative">
          {/* Top bar with item info and user score */}
          <div className="flex min-h-13 justify-center gap-1.5">
            <Button
              onClick={() => {
                if (currentItem?.audio) playAudio(currentItem.audio);
              }}
              disabled={isAudioDisabled}
              className="shape-rectangular flex-1"
              aria-label="Přehrát audio"
            >
              <AudioIcon></AudioIcon>
            </Button>
            <PracticeCardBar
              blocks={userScore?.blockCount?.[0] || 0}
              className="flex-2"
            />
            <Button
              onClick={() => setInfoVisibility(true)}
              disabled={!currentItem?.has_info || !revealed}
              buttonColor="button-secondary"
              className="shape-rectangular flex-1"
              aria-label="Zobrazit informace"
            >
              <InfoIcon />
            </Button>
          </div>
          {/* Card content with item details */}
          <div
            className={`color-disabled flex h-full w-full flex-col items-center justify-between px-4 pt-3 pb-2 ${!direction && 'color-highlighted rounded-sm'} `}
          >
            <div className="flex w-full items-center justify-between">
              <div className="relative flex pt-1">
                <button
                  onClick={() => setShowVolumeSlider((prev) => !prev)}
                  aria-label="Nastavit hlasitost"
                  disabled={noAudio}
                >
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
              <p className="flex w-full justify-end text-sm">
                {index + 1} / {arrayLength}
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
              <p className="flex w-full justify-start text-sm">
                {currentItem?.progress}
              </p>
              <p className="text-sm whitespace-nowrap text-red-500">
                {getErrorMessage(error)}
              </p>
            </div>
          </div>
          {/* Practice Controls */}
          <div className="flex min-h-13 w-full justify-between gap-1">
            {!revealed ? (
              <>
                <Button
                  onClick={() => setHintIndex((prevIndex) => prevIndex + 1)}
                  className="shape-rectangular"
                  aria-label="Nápověda"
                >
                  <HintIcon></HintIcon>
                </Button>
                <Button
                  onClick={() => {
                    setRevealed(true);
                    if (!hasSecondOverlayShown) {
                      setSecondOverlayVisible(true);
                      setHasSecondOverlayShown(true);
                    }
                    if (direction && currentItem?.audio)
                      playAudio(currentItem.audio);
                    setHintIndex(0);
                  }}
                  className="shape-rectangular"
                  aria-label="Zobrazit odpověď"
                >
                  <EyeIcon></EyeIcon>
                </Button>
              </>
            ) : (
              <>
                <Button
                  onClick={() => {
                    updateItemArray(config.minusProgress);
                  }}
                  className="shape-rectangular button-secondary"
                  aria-label="Snížit skore"
                >
                  <MinusIcon></MinusIcon>
                </Button>
                <Button
                  onClick={() => {
                    updateItemArray(config.plusProgress);
                  }}
                  className="shape-rectangular button-secondary"
                  aria-label="Zvýšit skore"
                >
                  <PlusIcon></PlusIcon>
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
