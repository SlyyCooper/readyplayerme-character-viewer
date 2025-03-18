/**
 * src/App.tsx
 * Main application component
 * Acts as the entry point for the application
 */

import { useState, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, OrbitControls, PerspectiveCamera, Stats } from '@react-three/drei';
import Character from './components/Character/Character';
import ControlPanel from './components/Character/ControlPanel';
import './App.css';

// Use a static path to the model
const MODEL_PATH = '/src/assets/models/character.glb';

function App() {
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [cameraPosition, setCameraPosition] = useState<[number, number, number]>([0, 1, 3]);
  
  // NVIDIA Audio2Face API settings
  const [useNvidiaApi, setUseNvidiaApi] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [nvidiaModel, setNvidiaModel] = useState<'MARK' | 'CLAIRE' | 'JAMES'>('MARK');
  
  // Toggle audio for face animation
  const toggleAudio = () => {
    setAudioEnabled(!audioEnabled);
  };
  
  // Toggle between browser audio and NVIDIA API
  const toggleNvidiaApi = () => {
    setUseNvidiaApi(!useNvidiaApi);
  };
  
  // Reset character view
  const resetCharacter = () => {
    setCameraPosition([0, 1, 3]);
  };
  
  return (
    <div className="app-container">
      <div className="canvas-container">
        <Canvas shadows>
          <color attach="background" args={['#f5f5f5']} />
          
          {/* Camera and controls */}
          <PerspectiveCamera 
            makeDefault 
            position={cameraPosition} 
            fov={50}
          />
          <OrbitControls
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            minDistance={1}
            maxDistance={10}
            target={[0, 0.8, 0]}
          />
          
          {/* Lighting */}
          <ambientLight intensity={0.5} />
          <directionalLight 
            position={[5, 5, 5]} 
            intensity={1} 
            castShadow 
            shadow-mapSize={[1024, 1024]}
          />
          
          {/* Environment */}
          <Environment preset="studio" />
          
          {/* Character */}
          <Suspense fallback={null}>
            <Character 
              modelPath={MODEL_PATH}
              position={[0, -1, 0]}
              audioEnabled={audioEnabled}
              useNvidiaApi={useNvidiaApi}
              apiKey={apiKey}
              nvidiaModel={nvidiaModel}
            />
          </Suspense>
          
          {/* Performance stats (can be removed in production) */}
          <Stats />
        </Canvas>
      </div>
      
      <ControlPanel 
        toggleAudio={toggleAudio}
        isAudioEnabled={audioEnabled}
        resetCharacter={resetCharacter}
        useNvidiaApi={useNvidiaApi}
        toggleNvidiaApi={toggleNvidiaApi}
        apiKey={apiKey}
        setApiKey={setApiKey}
        nvidiaModel={nvidiaModel}
        setNvidiaModel={setNvidiaModel}
      />
    </div>
  );
}

export default App;
