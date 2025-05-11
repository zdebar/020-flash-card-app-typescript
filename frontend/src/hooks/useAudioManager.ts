import { useCallback, useEffect, useRef } from 'react';
import { Item } from '../../../shared/types/dataTypes';
import { fetchAudioFiles } from '../utils/audio.utils';

export function useAudioManager(wordArray: Item[]) {
  const audioCacheRef = useRef<Map<string, HTMLAudioElement>>(new Map());
  const currentAudioRef = useRef<HTMLAudioElement | null>(null); // Track the currently playing audio
  const volumeRef = useRef(1); // Store the current volume (default is 1)

  useEffect(() => {
    const cacheAudio = async () => {
      try {
        if (wordArray.length > 0) {
          await fetchAudioFiles(wordArray, audioCacheRef.current);
        }
      } catch (error) {
        console.error('Error caching audio files:', error);
      }
    };

    cacheAudio();

    const currentRef = audioCacheRef.current;
    return () => {
      currentRef.clear();
    };
  }, [wordArray]);

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
        audio.volume = volumeRef.current; // Set the volume to the current value
        currentAudioRef.current = audio;
        audio.currentTime = 0;
        audio.play().catch((error) => {
          console.error('Error playing audio:', error);
        });
      }
    } else {
      console.warn(`Audio file not found in cache: ${audioPath}`);
    }
  }, []);

  const stopAudio = useCallback(() => {
    if (currentAudioRef.current) {
      currentAudioRef.current.pause();
      currentAudioRef.current.currentTime = 0;
      currentAudioRef.current = null;
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

  return { playAudio, stopAudio, muteAudio, unmuteAudio, setVolume };
}
