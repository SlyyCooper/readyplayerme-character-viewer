/**
 * src/types/index.ts
 * Contains type definitions for the entire application
 * Used by components in Character and AudioFace
 */

import * as THREE from 'three';
import React from 'react';

// Character model types
export interface CharacterProps {
  modelPath: string;
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: [number, number, number];
  audioEnabled?: boolean;
  useNvidiaApi?: boolean;
  apiKey?: string;
  nvidiaModel?: 'MARK' | 'CLAIRE' | 'JAMES';
}

// Audio types
export interface AudioAnalysisResult {
  volume: number;
  pitch: number;
  isSpeaking: boolean;
}

// Audio to face mapping types
export interface BlendshapeMapping {
  [key: string]: number;
}

export interface AudioFaceProps {
  character: THREE.Group;
  isActive: boolean;
  useNvidiaApi?: boolean;
  apiKey?: string;
  model?: string;
}

// User interface types
export interface ControlPanelProps {
  toggleAudio: () => void;
  isAudioEnabled: boolean;
  resetCharacter: () => void;
  useNvidiaApi?: boolean;
  toggleNvidiaApi?: () => void;
  apiKey?: string;
  setApiKey?: (key: string) => void;
  nvidiaModel?: string;
  setNvidiaModel?: React.Dispatch<React.SetStateAction<'MARK' | 'CLAIRE' | 'JAMES'>>;
} 