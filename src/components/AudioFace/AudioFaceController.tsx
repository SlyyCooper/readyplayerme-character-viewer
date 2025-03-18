/**
 * src/components/AudioFace/AudioFaceController.tsx
 * Component that maps audio analysis to facial blendshapes
 * Used by the Character component
 */

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { AudioFaceProps } from '../../types';
import useAudioAnalysis from '../../hooks/useAudioAnalysis';
import useNvidiaAudio2Face from '../../hooks/useNvidiaAudio2Face';
import { mapAudioToBlendshapes } from './faceMapping';

// Prefix for NVIDIA blendshapes
const NVIDIA_BLENDSHAPE_PREFIX = 'NVIDIA_blendshape_';

// Define type for morph dictionaries
interface MorphTargetDictionary {
  [key: string]: number;
}

const AudioFaceController = ({ 
  character, 
  isActive, 
  useNvidiaApi = false,
  apiKey,
  model = 'MARK'
}: AudioFaceProps) => {
  const [localAudioResult, localAudioInitialized] = useAudioAnalysis(!useNvidiaApi && isActive);
  const [nvidiaAudioResult, nvidiaInitialized, nvidiaBlendshapes] = useNvidiaAudio2Face(
    useNvidiaApi && isActive,
    apiKey,
    model as 'MARK' | 'CLAIRE' | 'JAMES'
  );
  
  // Use the appropriate audio results based on API flag
  const audioResult = useNvidiaApi ? nvidiaAudioResult : localAudioResult;
  const audioInitialized = useNvidiaApi ? nvidiaInitialized : localAudioInitialized;
  
  const meshesWithMorphTargets = useRef<THREE.Mesh[]>([]);
  const [currentBlendshapeFrame, setCurrentBlendshapeFrame] = useState(0);
  
  // Initialize and find all morph targets in the model
  useEffect(() => {
    if (!character) return;
    
    const morphTargetMeshes: THREE.Mesh[] = [];
    
    character.traverse((node: THREE.Object3D) => {
      if ((node as THREE.Mesh).isMesh) {
        const mesh = node as THREE.Mesh;
        const morphTargetDictionary = mesh.morphTargetDictionary as MorphTargetDictionary | undefined;
        
        // Check if the mesh has morph targets
        if (morphTargetDictionary && Object.keys(morphTargetDictionary).length > 0) {
          morphTargetMeshes.push(mesh);
          
          // Reset all morphs to 0
          if (mesh.morphTargetInfluences) {
            for (let i = 0; i < mesh.morphTargetInfluences.length; i++) {
              mesh.morphTargetInfluences[i] = 0;
            }
          }
        }
      }
    });
    
    meshesWithMorphTargets.current = morphTargetMeshes;
  }, [character]);
  
  // Update morph targets based on audio analysis
  useFrame(() => {
    if (!isActive || !audioInitialized || meshesWithMorphTargets.current.length === 0) return;
    
    // Get blendshapes either from NVIDIA API or local analysis
    let blendshapes;
    if (useNvidiaApi && nvidiaBlendshapes.length > 0) {
      // Use pre-computed blendshapes from NVIDIA API
      blendshapes = nvidiaBlendshapes[currentBlendshapeFrame];
      
      // Cycle through frames if we have multiple
      if (nvidiaBlendshapes.length > 1) {
        setCurrentBlendshapeFrame((prev) => 
          (prev + 1) % nvidiaBlendshapes.length
        );
      }
    } else {
      // Map audio analysis to blendshapes locally
      blendshapes = mapAudioToBlendshapes(audioResult);
    }
    
    // Apply blendshapes to all morphable meshes
    meshesWithMorphTargets.current.forEach(mesh => {
      const morphDict = mesh.morphTargetDictionary as MorphTargetDictionary | undefined;
      const morphInfluences = mesh.morphTargetInfluences;
      
      if (!morphDict || !morphInfluences) return;
      
      // Apply each blendshape value to its corresponding morph target
      Object.entries(blendshapes).forEach(([name, value]) => {
        // Try with NVIDIA prefix
        const nvidiaName = NVIDIA_BLENDSHAPE_PREFIX + name;
        let index = morphDict[nvidiaName];
        
        // If not found, try without prefix
        if (index === undefined) {
          index = morphDict[name];
        }
        
        // If found, apply the value
        if (index !== undefined && morphInfluences[index] !== undefined) {
          // Apply smoothing for a more natural transition
          const currentValue = morphInfluences[index];
          // Ensure value is a number for lerp
          const newValue = THREE.MathUtils.lerp(currentValue, value as number, 0.3);
          morphInfluences[index] = newValue;
        }
      });
    });
  });
  
  return null; // This is a controller component with no visual output
};

export default AudioFaceController; 