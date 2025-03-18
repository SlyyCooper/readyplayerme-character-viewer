/**
 * src/components/Character/ControlPanel.tsx
 * UI Component for controlling character features
 * Used by the main App component
 */

import React from 'react';
import { ControlPanelProps } from '../../types';

const ControlPanel = ({ toggleAudio, isAudioEnabled, resetCharacter }: ControlPanelProps) => {
  return (
    <div className="control-panel">
      <button 
        onClick={toggleAudio}
        className={`control-button ${isAudioEnabled ? 'active' : ''}`}
      >
        {isAudioEnabled ? 'Disable Audio' : 'Enable Audio'}
      </button>
      
      <button 
        onClick={resetCharacter}
        className="control-button"
      >
        Reset Character
      </button>
      
      <div className="instructions">
        <h3>Ready Player Me Viewer</h3>
        <p>
          {isAudioEnabled 
            ? 'Speak to animate the character\'s face' 
            : 'Enable audio to animate the character\'s face'}
        </p>
        <p className="note">
          Powered by NVIDIA Audio2Face technology
        </p>
      </div>
    </div>
  );
};

export default ControlPanel; 