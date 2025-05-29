import { useState, useCallback, useRef } from 'react';
import { fetchWithAuthAndParse } from '../utils/auth.utils';
import toWav from 'audiobuffer-to-wav';

export function usePronunciation() {
  const [isAudioChecking, setIsAudioChecking] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const startRecording = useCallback(async () => {
    try {
      console.log('Starting audio recording...');
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        console.log('ondataavailable event triggered:', event.data);
        if (event.data.size > 0) {
          console.log('Audio chunk received:', event.data);
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.log('Error starting audio recording:', error);
    }
  }, []);

  const stopRecording = useCallback(
    async (englishText: string, ipaText: string) => {
      if (!mediaRecorderRef.current) return;

      // Stop the recorder
      await new Promise<void>((resolve) => {
        mediaRecorderRef.current!.onstop = () => {
          console.log('MediaRecorder stopped.');
          resolve();
        };
        mediaRecorderRef.current!.stop();
      });
      setIsRecording(false);

      console.log('Audio chunks before filtering:', audioChunksRef.current); // Debugging line

      // Filter out empty chunks
      const validChunks = audioChunksRef.current.filter(
        (chunk) => chunk.size > 0
      );
      if (validChunks.length === 0) {
        console.log(
          'No valid audio chunks received. Recording may have failed.'
        );
        return;
      }

      console.log('Valid audio chunks:', validChunks); // Debugging line

      // Create the Blob from the valid chunks
      const audioBlob = new Blob(validChunks, {
        type: 'audio/wav',
      });
      console.log('Audio Blob:', audioBlob); // Debugging line

      if (audioBlob.size === 0) {
        console.log('Audio Blob is empty. Recording may have failed.');
        return;
      }

      const audioContext = new AudioContext();
      const arrayBuffer = await audioBlob.arrayBuffer();
      const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
      const wavBuffer = toWav(audioBuffer);
      const wavBlob = new Blob([wavBuffer], { type: 'audio/wav' });

      console.log('WAV Blob:', wavBlob); // Debugging line

      setIsAudioChecking(true);

      try {
        const wavArrayBuffer = await wavBlob.arrayBuffer();
        console.log('WAV buffer being sent:', wavArrayBuffer); // Debugging line

        const response = await fetchWithAuthAndParse<{
          data: { similarity: number[]; tips: string[] };
        }>('/api/items/pronunciation', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/octet-stream',
            'x-english-text': englishText,
            'x-ipa-text': encodeURIComponent(ipaText),
          },
          body: wavArrayBuffer,
        });

        console.log('Pronunciation response:', response);
        if (!response) {
          throw new Error('Failed to process pronunciation');
        }

        const { similarity, tips } = response.data;
        console.log('Pronunciation similarity:', similarity);
      } catch (error) {
        console.log('Error processing pronunciation:', error);
      } finally {
        setIsAudioChecking(false);
      }
    },
    []
  );

  return {
    isAudioChecking,
    isRecording,
    startRecording,
    stopRecording,
  };
}
