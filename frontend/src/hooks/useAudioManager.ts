import { useCallback, useEffect, useRef, useState } from 'react';
import { Item } from '../../../shared/types/dataTypes';
import { fetchAudioFiles } from '../utils/audio.utils';

export function useAudioManager(wordArray: Item[]) {
  const audioCacheRef = useRef<Map<string, HTMLAudioElement>>(new Map());
  const currentAudioRef = useRef<HTMLAudioElement | null>(null); // Track the currently playing audio
  const volumeRef = useRef(1); // Store the current volume (default is 1)
  const [isPlaying, setIsPlaying] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordedAudio, setRecordedAudio] = useState<Blob | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  // Fetch and cache audio files when the component mounts or wordArray changes
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
        audio.volume = volumeRef.current; // Set the volume to the current value
        currentAudioRef.current = audio;
        audio.currentTime = 0;

        audio
          .play()
          .then(() => {
            setIsPlaying(true);
          })
          .catch((error) => {
            console.error('Error playing audio:', error);
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

  // Start recording audio
  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: 'audio/webm',
        });
        setRecordedAudio(audioBlob);
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error starting audio recording:', error);
    }
  }, []);

  // Stop recording audio
  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  }, []);

  // Save recorded audio to a file
  const saveRecordedAudio = useCallback(() => {
    if (!recordedAudio) {
      console.warn('No recorded audio to save.');
      return;
    }

    // Vytvoření odkazu pro stažení
    const url = URL.createObjectURL(recordedAudio);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'recorded-audio.webm'; // Název souboru
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  }, [recordedAudio]);

  // Compare recorded audio with a given audio file
  const compareAudio = useCallback(
    async (audioPath: string) => {
      if (!recordedAudio || !audioCacheRef.current.has(audioPath)) {
        console.warn('Recorded audio or target audio file is missing.');
        return false;
      }

      const targetAudio = audioCacheRef.current.get(audioPath);
      if (!targetAudio) {
        console.warn('Target audio file not found in cache.');
        return false;
      }

      // Load and decode both audio files using the Web Audio API
      const audioContext = new AudioContext();

      const decodeAudio = async (audioBlob: Blob | HTMLAudioElement) => {
        const arrayBuffer =
          audioBlob instanceof Blob
            ? await audioBlob.arrayBuffer()
            : await fetch(audioBlob.src).then((res) => res.arrayBuffer());
        return await audioContext.decodeAudioData(arrayBuffer);
      };

      const recordedBuffer = await decodeAudio(recordedAudio);
      const targetBuffer = await decodeAudio(targetAudio);

      // Compare the audio buffers (e.g., by analyzing frequency data)
      const recordedData = recordedBuffer.getChannelData(0); // First channel
      const targetData = targetBuffer.getChannelData(0); // First channel

      // Simple comparison: Check if the waveforms are similar
      const similarity = recordedData.reduce((acc, value, index) => {
        return acc + Math.abs(value - (targetData[index] || 0));
      }, 0);

      console.log('Audio similarity score:', similarity);
      return similarity < 0.1;
    },
    [recordedAudio]
  );

  return {
    playAudio,
    stopAudio,
    muteAudio,
    unmuteAudio,
    setVolume,
    startRecording,
    stopRecording,
    compareAudio,
    saveRecordedAudio,
    isPlaying,
    isRecording,
    recordedAudio,
  };
}
