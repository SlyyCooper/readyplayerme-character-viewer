/**
 * src/components/AudioFace/faceMapping.ts
 * Maps audio analysis data to facial blendshapes
 * Used by AudioFaceController component
 */

import { AudioAnalysisResult, BlendshapeMapping } from '../../types';

// Constants for blendshape mapping sensitivity
const VOLUME_SENSITIVITY = 0.8;
const PITCH_SENSITIVITY = 0.5;
const BASE_MOUTH_OPEN = 0.1;
const MAX_MOUTH_OPEN = 0.7;

/**
 * Maps audio analysis data to facial blendshapes
 * @param audioData - The analyzed audio data
 * @returns Object mapping blendshape names to values (0-1)
 */
export const mapAudioToBlendshapes = (audioData: AudioAnalysisResult): BlendshapeMapping => {
  const { volume, pitch, isSpeaking } = audioData;
  
  // Base mapping with default values (neutral face)
  const blendshapes: BlendshapeMapping = {
    // Mouth shapes
    'jawOpen': 0,
    'mouthOpen': 0,
    'mouthWide': 0,
    'mouthPucker': 0,
    
    // Eye shapes
    'eyesClosed': 0,
    'eyeSquintLeft': 0,
    'eyeSquintRight': 0,
    
    // Brow shapes
    'browDownLeft': 0,
    'browDownRight': 0,
    'browInnerUp': 0,
    'browOuterUpLeft': 0,
    'browOuterUpRight': 0,
  };
  
  // If not speaking, return neutral face with minimal movement
  if (!isSpeaking) {
    // Add slight random movement for realism when not speaking
    blendshapes.eyesClosed = Math.random() * 0.05;
    return blendshapes;
  }
  
  // Map volume to mouth openness
  const jawOpenness = Math.min(BASE_MOUTH_OPEN + (volume * VOLUME_SENSITIVITY), MAX_MOUTH_OPEN);
  blendshapes.jawOpen = jawOpenness;
  blendshapes.mouthOpen = jawOpenness * 0.8;
  
  // Map pitch to mouth shape (wide vs pucker)
  if (pitch > 0.5) {
    // Higher pitch - wider mouth
    blendshapes.mouthWide = (pitch - 0.5) * 2 * PITCH_SENSITIVITY;
    blendshapes.mouthPucker = 0;
  } else {
    // Lower pitch - puckered mouth
    blendshapes.mouthPucker = (0.5 - pitch) * 2 * PITCH_SENSITIVITY;
    blendshapes.mouthWide = 0;
  }
  
  // Add subtle brow movement based on volume
  blendshapes.browInnerUp = volume * 0.3;
  
  return blendshapes;
}; 