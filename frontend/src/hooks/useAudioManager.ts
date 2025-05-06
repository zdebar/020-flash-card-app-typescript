import { useCallback, useEffect, useRef } from 'react';
import { Item } from '../../../shared/types/dataTypes';
import { cacheAudioFiles, playAudioFromCache } from '../utils/practice.utils';

export function useAudioManager(wordArray: Item[]) {
  const audioCacheRef = useRef<Map<string, HTMLAudioElement>>(new Map());

  const saveAudioToCache = useCallback(
    (audioPath: string, audioBlob: Blob | MediaSource) => {
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      audioCacheRef.current.set(audioPath, audio);
    },
    []
  );

  useEffect(() => {
    const cacheAudio = async () => {
      try {
        if (wordArray.length > 0) {
          await cacheAudioFiles(wordArray, saveAudioToCache);
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
  }, [wordArray, saveAudioToCache]);

  const playAudio = useCallback((audioPath: string | null) => {
    if (audioPath && audioCacheRef.current.has(audioPath)) {
      playAudioFromCache(audioCacheRef.current, audioPath);
    } else {
      console.warn(`Audio file not found in cache: ${audioPath}`);
    }
  }, []);

  return { playAudio };
}
