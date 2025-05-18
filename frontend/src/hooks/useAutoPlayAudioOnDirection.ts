import { useEffect } from 'react';

export function useAutoPlayAudioOnDirection(
  direction: boolean,
  playAudio: (audioPath: string) => void,
  audio?: string | null | undefined
) {
  useEffect(() => {
    if (!direction && audio) {
      setTimeout(() => playAudio(audio!), 100);
    }
  }, [direction, playAudio, audio]);
}
