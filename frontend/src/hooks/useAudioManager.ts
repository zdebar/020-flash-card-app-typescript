import { useCallback, useEffect, useRef } from 'react';
import { Item } from '../../../shared/types/dataTypes';
import { playAudioFromUseRef, fetchAudioFiles } from '../utils/audio.utils';

export function useAudioManager(wordArray: Item[]) {
  const audioCacheRef = useRef<Map<string, HTMLAudioElement>>(new Map());

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
      playAudioFromUseRef(audioCacheRef.current, audioPath);
    } else {
      console.warn(`Audio file not found in cache: ${audioPath}`);
    }
  }, []);

  return { playAudio };
}
