/**
 * src/hooks/useNvidiaAudio2Face.ts
 * Custom hook for using NVIDIA Audio2Face API
 * Used by AudioFaceController component for more realistic facial animations
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import { AudioAnalysisResult, BlendshapeMapping } from '../types';
import nvidiAudio2FaceService from '../services/NVIDIAAudio2FaceService';

// Audio recorder configuration
const AUDIO_CHUNK_DURATION = 2000; // 2 seconds of audio per API call

const useNvidiaAudio2Face = (
  enabled: boolean = false,
  apiKey?: string,
  model: 'MARK' | 'CLAIRE' | 'JAMES' = 'MARK'
): [AudioAnalysisResult, boolean, BlendshapeMapping[]] => {
  const [isInitialized, setIsInitialized] = useState<boolean>(false);
  const [audioResult, setAudioResult] = useState<AudioAnalysisResult>({
    volume: 0,
    pitch: 0,
    isSpeaking: false,
  });
  const [blendshapeFrames, setBlendshapeFrames] = useState<BlendshapeMapping[]>([]);
  
  const streamRef = useRef<MediaStream | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recordingIntervalRef = useRef<number | null>(null);
  const processingRef = useRef<boolean>(false);
  
  // Volume detection for isSpeaking status
  const analyserRef = useRef<AnalyserNode | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  
  // Initialize NVIDIA service when API key is provided
  useEffect(() => {
    if (apiKey && !nvidiAudio2FaceService.isReady()) {
      nvidiAudio2FaceService.initialize(apiKey, model);
    }
  }, [apiKey, model]);
  
  // Process recorded audio chunks
  const processAudioChunks = useCallback(async () => {
    if (audioChunksRef.current.length === 0 || processingRef.current) return;
    
    processingRef.current = true;
    const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
    audioChunksRef.current = []; // Clear for next batch
    
    try {
      // Convert blob to array buffer
      const arrayBuffer = await audioBlob.arrayBuffer();
      
      // Send to NVIDIA Audio2Face service
      const result = await nvidiAudio2FaceService.processAudioData(arrayBuffer);
      
      // Store the blendshape frames
      if (result.blendshapes) {
        setBlendshapeFrames([result.blendshapes]);
      }
    } catch (error) {
      console.error('Error processing audio with NVIDIA API:', error);
    } finally {
      processingRef.current = false;
    }
  }, []);
  
  // Start/stop audio recording based on enabled state
  useEffect(() => {
    if (!enabled) {
      cleanupAudio();
      return;
    }
    
    if (!apiKey) {
      console.error('API key is required for NVIDIA Audio2Face service');
      return;
    }
    
    const initAudio = async () => {
      try {
        // Request microphone access
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        streamRef.current = stream;
        
        // Create audio context and analyzer for volume detection
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        audioContextRef.current = audioContext;
        
        const analyser = audioContext.createAnalyser();
        analyser.fftSize = 2048;
        analyserRef.current = analyser;
        
        // Connect for volume analysis
        const source = audioContext.createMediaStreamSource(stream);
        source.connect(analyser);
        
        // Create media recorder for sending audio to NVIDIA API
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;
        
        mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            audioChunksRef.current.push(event.data);
          }
        };
        
        mediaRecorder.onstop = () => {
          processAudioChunks();
        };
        
        // Start recording
        mediaRecorder.start();
        
        // Set interval to stop and restart recording periodically
        recordingIntervalRef.current = window.setInterval(() => {
          if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
            mediaRecorderRef.current.stop();
            // Start a new recording segment after processing
            setTimeout(() => {
              if (mediaRecorderRef.current) {
                mediaRecorderRef.current.start();
              }
            }, 100);
          }
        }, AUDIO_CHUNK_DURATION);
        
        // Start analyzing volume for isSpeaking status
        analyzeVolume();
        setIsInitialized(true);
      } catch (error) {
        console.error('Error initializing audio for NVIDIA integration:', error);
      }
    };
    
    initAudio();
    
    return () => {
      cleanupAudio();
    };
  }, [enabled, apiKey, processAudioChunks]);
  
  // Analyze audio volume to detect speech
  const analyzeVolume = () => {
    if (!analyserRef.current) return;
    
    const analyser = analyserRef.current;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    
    const updateVolumeData = () => {
      if (!analyserRef.current) return;
      
      analyser.getByteFrequencyData(dataArray);
      
      // Calculate volume (average of frequency data)
      let sum = 0;
      for (let i = 0; i < bufferLength; i++) {
        sum += dataArray[i];
      }
      const volume = sum / bufferLength / 255; // Normalize to 0-1
      
      // Determine if speaking based on volume threshold
      const isSpeaking = volume > 0.05; // Simple threshold
      
      setAudioResult(prev => ({
        ...prev,
        volume,
        isSpeaking
      }));
      
      // Continue analyzing
      requestAnimationFrame(updateVolumeData);
    };
    
    updateVolumeData();
  };
  
  // Cleanup function
  const cleanupAudio = () => {
    if (recordingIntervalRef.current) {
      clearInterval(recordingIntervalRef.current);
      recordingIntervalRef.current = null;
    }
    
    if (mediaRecorderRef.current) {
      if (mediaRecorderRef.current.state === 'recording') {
        mediaRecorderRef.current.stop();
      }
    }
    
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    
    if (audioContextRef.current) {
      audioContextRef.current.close();
    }
    
    setIsInitialized(false);
    setBlendshapeFrames([]);
    audioChunksRef.current = [];
  };
  
  return [audioResult, isInitialized, blendshapeFrames];
};

export default useNvidiaAudio2Face; 