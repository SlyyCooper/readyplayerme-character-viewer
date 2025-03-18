/**
 * src/components/Character/Character.tsx
 * Component for loading and displaying the Ready Player Me character model
 * Used by the main App component
 */

import { useRef, useState, useEffect } from 'react';
import { useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { CharacterProps } from '../../types';
import AudioFaceController from '../AudioFace/AudioFaceController';

// Define GLTF result type
interface GLTFResult {
  scene: THREE.Group;
  scenes: THREE.Group[];
  cameras: THREE.Camera[];
  asset: object;
}

const Character = ({
  modelPath,
  position = [0, -1, 0],
  rotation = [0, 0, 0],
  scale = [1, 1, 1],
  audioEnabled = false,
  useNvidiaApi = false,
  apiKey,
  nvidiaModel = 'MARK',
}: CharacterProps) => {
  // Load the GLTF model
  const { scene } = useGLTF(modelPath) as GLTFResult;
  const characterRef = useRef<THREE.Group>(null);
  const [model, setModel] = useState<THREE.Group | null>(null);
  
  // Clone the scene to avoid modifying the cached original
  useEffect(() => {
    const clonedScene = scene.clone();
    
    // Apply materials and setup
    clonedScene.traverse((node: THREE.Object3D) => {
      if ((node as THREE.Mesh).isMesh) {
        const mesh = node as THREE.Mesh;
        
        // Make sure materials are properly set up
        if (mesh.material) {
          // Enable shadows
          mesh.castShadow = true;
          mesh.receiveShadow = true;
          
          // If it's a standard material, we can enhance it
          if (mesh.material instanceof THREE.MeshStandardMaterial) {
            const material = mesh.material as THREE.MeshStandardMaterial;
            material.needsUpdate = true;
            
            // Enhance material properties for better visual quality
            material.envMapIntensity = 1;
            material.roughness = 0.4;
            material.metalness = 0.1;
          }
        }
      }
    });
    
    setModel(clonedScene);
  }, [scene]);
  
  // Animation and updates
  useFrame((_state, delta) => {
    if (!characterRef.current) return;
    
    // Add subtle idle animation
    characterRef.current.rotation.y += delta * 0.05;
    
    // Could add more complex animations here if needed
  });
  
  if (!model) return null;
  
  return (
    <group 
      ref={characterRef}
      position={new THREE.Vector3(...position)}
      rotation={new THREE.Euler(...rotation)}
      scale={new THREE.Vector3(...scale)}
    >
      <primitive object={model} />
      
      {/* Audio face controller for facial animations */}
      {audioEnabled && model && (
        <AudioFaceController 
          character={model} 
          isActive={audioEnabled}
          useNvidiaApi={useNvidiaApi}
          apiKey={apiKey}
          model={nvidiaModel}
        />
      )}
    </group>
  );
};

export default Character; 