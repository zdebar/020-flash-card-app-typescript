import { supabase } from '../config/supabase.config';
import { Item } from '../../../shared/types/dataTypes';

/**
 * Saves audio to useRef cache for modularity and reusability.
 */
export function saveAudioToUseRef(
  audioRef: Map<string, HTMLAudioElement>,
  audioPath: string,
  audioBlob: Blob | MediaSource
) {
  const audioUrl = URL.createObjectURL(audioBlob);
  const audio = new Audio(audioUrl);
  audioRef.set(audioPath, audio);
}

/**
 * Plays audio from the useRef. If the audio is not found, it logs an error.
 */
export function playAudioFromUseRef(
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
 * Fetches the audio files for the words and caches them in the browser's cache storage and in provided useRef.
 */
export async function fetchAndCacheAudioFiles(
  words: Item[],
  audioRef: Map<string, HTMLAudioElement>
) {
  const cache = await caches.open('audio-cache');

  for (const word of words) {
    const audioPath = word.audio;
    if (audioPath) {
      // Check if the audio file is already cached
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
            saveAudioToUseRef(audioRef, audioPath, audioBlob);
          }
        } else {
          console.error(
            `Invalid public URL for audio file: ${audioPath}. Skipping...`
          );
        }
      } else {
        // If cached, use the cached response
        const audioBlob = await cachedResponse.blob();
        saveAudioToUseRef(audioRef, audioPath, audioBlob);
      }
    }
  }
}

/**
 * Clears the audio cache in the browser's cache storage.
 */
export async function clearAudioCache() {
  await caches.delete('audio-cache');
}
