import { Item } from '../../../shared/types/dataTypes';
import { supabase } from '../utils/supabase.utils';

export function alternateDirection(words: Item[], index: number = 0) {
  return words[index]?.progress % 2 === 0;
}

export async function cacheAudioFiles(
  words: { audio?: string | null }[],
  saveAudioToUseRef: (audioPath: string, audioBlob: Blob) => void
) {
  const cache = await caches.open('audio-cache');

  for (const word of words) {
    if (word.audio) {
      const audioPath = word.audio;
      const cachedResponse = await cache.match(audioPath);
      if (!cachedResponse) {
        const { data } = supabase.storage
          .from('audio-files')
          .getPublicUrl(audioPath);

        if (data.publicUrl) {
          const response = await fetch(data.publicUrl);
          if (response.ok) {
            const clonedResponse = response.clone();
            const audioBlob = await response.blob();
            cache.put(audioPath, clonedResponse);
            saveAudioToUseRef(audioPath, audioBlob);
          }
        }
      } else {
        const audioBlob = await cachedResponse.blob();
        saveAudioToUseRef(audioPath, audioBlob);
      }
    }
  }
}

export function playAudioFromCache(
  audioCache: Map<string, HTMLAudioElement>,
  audioPath: string | null
) {
  if (!audioPath) {
    return;
  }

  const audio = audioCache.get(audioPath);

  if (audio) {
    audio.currentTime = 0;
    audio.play().catch((error) => {
      console.error('Error playing audio:', error);
    });
  } else {
    console.error('Audio file not preloaded:', audioPath);
  }
}

/**
 * Converts an array of Word objects to an array of objects containing only the id, progress, and skipped properties.
 */
export function convertToWordProgress(words: Item[]) {
  return words.map((word) => ({
    id: word.id,
    progress: word.progress,
    skipped: word.skipped,
  }));
}

/**
 * Updates the progress of a word in the word array.
 */
export function updateWordProgress(
  wordArray: Item[],
  currentIndex: number,
  progressIncrement: number,
  skipped: boolean
): Item[] {
  const updatedProgress = Math.max(
    0,
    Math.min(wordArray[currentIndex].progress + progressIncrement, 100)
  );

  const updatedWordArray = [...wordArray];
  updatedWordArray[currentIndex] = {
    ...updatedWordArray[currentIndex],
    progress: updatedProgress,
    skipped: skipped,
  };

  return updatedWordArray;
}
