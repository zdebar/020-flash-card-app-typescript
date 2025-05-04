import { useCallback, useEffect, useRef } from 'react';
import {
  GrammarWord,
  PronunciationWord,
  Item,
} from '../../../shared/types/dataTypes';
import { cacheAudioFiles, playAudioFromCache } from '../utils/practice.utils';

export function useAudioManager(
  wordArray: Item[] | GrammarWord[] | PronunciationWord[]
) {
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
      if (wordArray.length > 0) {
        await cacheAudioFiles(wordArray, saveAudioToCache);
      }
    };

    cacheAudio();

    const currentRef = audioCacheRef.current;
    return () => {
      currentRef.clear();
    };
  }, [wordArray, saveAudioToCache]);

  const playAudio = useCallback((audioPath: string | null) => {
    if (audioPath) {
      playAudioFromCache(audioCacheRef.current, audioPath);
    }
  }, []);

  return { playAudio };
}
