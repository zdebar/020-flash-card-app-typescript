import { useCallback, useEffect, useRef, useState } from 'react';
import { Item } from '../../../shared/types/dataTypes';
import { fetchAndCacheAudioFiles } from '../utils/audio.utils';

export function useAudioManager(wordArray: Item[]) {
  const audioCacheRef = useRef<Map<string, HTMLAudioElement>>(new Map());
  const currentAudioRef = useRef<HTMLAudioElement | null>(null); // Track the currently playing audio
  const volumeRef = useRef(1); // Store the current volume (default is 1)
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioReload, setAudioReload] = useState(false);

  useEffect(() => {
    const cacheAudio = async () => {
      try {
        if (wordArray.length > 0) {
          await fetchAndCacheAudioFiles(wordArray, audioCacheRef.current);
          console.log('Audio files cached successfully.', wordArray);
        }

        setAudioReload(false);
      } catch (error) {
        console.error('Error caching audio files:', error);
      }
    };

    cacheAudio();
  }, [wordArray]);

  // Function to play audio
  const playAudio = useCallback((audioPath: string | null) => {
    if (audioPath && audioCacheRef.current.has(audioPath)) {
      const audio = audioCacheRef.current.get(audioPath);
      if (audio) {
        // Stop any currently playing audio
        if (currentAudioRef.current) {
          currentAudioRef.current.pause();
          currentAudioRef.current.currentTime = 0;
        }

        // Play the new audio
        audio.volume = volumeRef.current;
        currentAudioRef.current = audio;
        audio.currentTime = 0;

        audio
          .play()
          .then(() => {
            setIsPlaying(true);
          })
          .catch(() => {
            setIsPlaying(false);
          });

        audio.onended = () => {
          setIsPlaying(false);
        };

        audio.onpause = () => {
          setIsPlaying(false);
        };
      }
    } else {
      console.warn(`Audio file not found in cache: ${audioPath}`);
      setIsPlaying(false);
    }
  }, []);

  const stopAudio = useCallback(() => {
    if (currentAudioRef.current) {
      currentAudioRef.current.pause();
      currentAudioRef.current.currentTime = 0;
      currentAudioRef.current = null;
      setIsPlaying(false);
    }
  }, []);

  const muteAudio = useCallback(() => {
    if (currentAudioRef.current) {
      currentAudioRef.current.muted = true;
    }
  }, []);

  const unmuteAudio = useCallback(() => {
    if (currentAudioRef.current) {
      currentAudioRef.current.muted = false;
    }
  }, []);

  const setVolume = useCallback((volume: number) => {
    volumeRef.current = Math.min(Math.max(volume, 0), 1);
  }, []);

  return {
    playAudio,
    stopAudio,
    muteAudio,
    unmuteAudio,
    setVolume,
    isPlaying,
    audioReload,
    setAudioReload,
  };
}
