/**
 * src/hooks/useAudioAnalysis.ts
 * Custom hook for analyzing audio input from microphone
 * Used by AudioFace component to drive facial animations
 */

import { useState, useEffect, useRef } from 'react';
import hark from 'hark';
import { AudioAnalysisResult } from '../types';

// Add hark module declaration
declare module 'hark';

// Add WebKit audio context type declaration
declare global {
  interface Window {
    webkitAudioContext: typeof AudioContext;
  }
}

interface SpeechEvents {
  on(event: 'speaking' | 'stopped_speaking', callback: () => void): void;
  stop(): void;
}

const useAudioAnalysis = (enabled: boolean = false): [AudioAnalysisResult, boolean] => {
  const [isInitialized, setIsInitialized] = useState<boolean>(false);
  const [audioResult, setAudioResult] = useState<AudioAnalysisResult>({
    volume: 0,
    pitch: 0,
    isSpeaking: false,
  });
  
  const streamRef = useRef<MediaStream | null>(null);
  const speechEventsRef = useRef<SpeechEvents | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  
  // Initialize audio analysis
  useEffect(() => {
    if (!enabled) {
      cleanupAudio();
      return;
    }
    
    const initAudio = async () => {
      try {
        // Request microphone access
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        streamRef.current = stream;
        
        // Create audio context and analyzer
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        audioContextRef.current = audioContext;
        
        const analyser = audioContext.createAnalyser();
        analyser.fftSize = 2048;
        analyserRef.current = analyser;
        
        // Connect the microphone stream to the analyzer
        const source = audioContext.createMediaStreamSource(stream);
        source.connect(analyser);
        
        // Use hark for speech detection
        const speechEvents = hark(stream, { threshold: -65 }) as SpeechEvents;
        speechEventsRef.current = speechEvents;
        
        speechEvents.on('speaking', () => {
          setAudioResult(prev => ({ ...prev, isSpeaking: true }));
        });
        
        speechEvents.on('stopped_speaking', () => {
          setAudioResult(prev => ({ ...prev, isSpeaking: false }));
        });
        
        // Start analyzing audio
        analyzeAudio();
        setIsInitialized(true);
      } catch (error) {
        console.error('Error initializing audio:', error);
      }
    };
    
    initAudio();
    
    return () => {
      cleanupAudio();
    };
  }, [enabled]);
  
  // Analyze audio data continuously
  const analyzeAudio = () => {
    if (!analyserRef.current || !audioContextRef.current) return;
    
    const analyser = analyserRef.current;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    
    const updateAudioData = () => {
      if (!analyserRef.current) return;
      
      analyser.getByteFrequencyData(dataArray);
      
      // Calculate volume (average of frequency data)
      let sum = 0;
      for (let i = 0; i < bufferLength; i++) {
        sum += dataArray[i];
      }
      const volume = sum / bufferLength / 255; // Normalize to 0-1
      
      // Simplified pitch detection (using dominant frequency)
      let maxValue = 0;
      let maxIndex = 0;
      for (let i = 0; i < bufferLength; i++) {
        if (dataArray[i] > maxValue) {
          maxValue = dataArray[i];
          maxIndex = i;
        }
      }
      const pitch = maxIndex / bufferLength;
      
      setAudioResult(prev => ({
        ...prev,
        volume,
        pitch,
      }));
      
      // Continue analyzing
      requestAnimationFrame(updateAudioData);
    };
    
    updateAudioData();
  };
  
  // Cleanup function
  const cleanupAudio = () => {
    if (speechEventsRef.current) {
      speechEventsRef.current.stop();
    }
    
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    
    if (audioContextRef.current) {
      audioContextRef.current.close();
    }
    
    setIsInitialized(false);
  };
  
  return [audioResult, isInitialized];
};

export default useAudioAnalysis; 