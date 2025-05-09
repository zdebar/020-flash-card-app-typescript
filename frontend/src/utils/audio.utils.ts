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
 * Fetches the audio files for the words and caches them in the browser's cache storage and in useRef.
 */
export async function fetchAudioFiles(
  words: Item[],
  audioRef: Map<string, HTMLAudioElement>
) {
  const cache = await caches.open('audio-cache');

  for (const word of words) {
    if (word.audio) {
      // Check if the audio file is already cached
      const audioPath = word.audio;
      const cachedResponse = await cache.match(audioPath);
      if (!cachedResponse) {
        // If not cached, fetch the audio file from Supabase
        const { data } = supabase.storage
          .from('audio-files')
          .getPublicUrl(audioPath);

        // Check if the public URL is valid and fetch the audio file
        if (data.publicUrl) {
          const response = await fetch(data.publicUrl);
          if (response.ok) {
            const clonedResponse = response.clone();
            const audioBlob = await response.blob();
            // Save the audio blob to the cache and useRef
            cache.put(audioPath, clonedResponse);
            saveAudioToUseRef(audioRef, audioPath, audioBlob);
          }
        }
      } else {
        // If cached, use the cached response
        const audioBlob = await cachedResponse.blob();
        saveAudioToUseRef(audioRef, audioPath, audioBlob);
      }
    }
  }
}
