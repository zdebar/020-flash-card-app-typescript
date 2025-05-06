import { supabase } from '../config/supabase.config';
import { Item } from '../../../shared/types/dataTypes';

/**
 * Saves audio to cache for modularity and reusability.
 */
export function saveAudioToCache(
  audioCache: Map<string, HTMLAudioElement>,
  audioPath: string,
  audioBlob: Blob | MediaSource
) {
  const audioUrl = URL.createObjectURL(audioBlob);
  const audio = new Audio(audioUrl);
  audioCache.set(audioPath, audio);
}

/**
 * Plays audio from the cache. If the audio is not found in the cache, it logs an error.
 */
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
 * Fetches the audio files for the words and caches them in the browser's cache storage.
 */
export async function fetchAudioFiles(
  words: Item[],
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
