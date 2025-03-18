/**
 * src/components/Character/ControlPanel.tsx
 * UI Component for controlling character features
 * Used by the main App component
 */

import React, { useState } from 'react';
import { ControlPanelProps } from '../../types';

const ControlPanel = ({ 
  toggleAudio, 
  isAudioEnabled, 
  resetCharacter,
  useNvidiaApi = false,
  toggleNvidiaApi,
  apiKey = '',
  setApiKey,
  nvidiaModel = 'MARK',
  setNvidiaModel
}: ControlPanelProps) => {
  const [showApiSettings, setShowApiSettings] = useState(false);
  const [tempApiKey, setTempApiKey] = useState(apiKey);
  
  // Handle API key submission
  const handleApiKeySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (setApiKey) {
      setApiKey(tempApiKey);
    }
    setShowApiSettings(false);
  };
  
  // Handle model change
  const handleModelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (setNvidiaModel) {
      // Cast the value to the correct type
      const modelValue = e.target.value as 'MARK' | 'CLAIRE' | 'JAMES';
      setNvidiaModel(modelValue);
    }
  };
  
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
      
      {toggleNvidiaApi && (
        <button 
          onClick={toggleNvidiaApi}
          className={`control-button ${useNvidiaApi ? 'active' : ''}`}
        >
          {useNvidiaApi ? 'Use Browser Audio' : 'Use NVIDIA Audio2Face'}
        </button>
      )}
      
      {setApiKey && (
        <button 
          onClick={() => setShowApiSettings(!showApiSettings)}
          className="control-button settings"
        >
          API Settings
        </button>
      )}
      
      {showApiSettings && (
        <div className="api-settings">
          <form onSubmit={handleApiKeySubmit}>
            <div className="form-group">
              <label htmlFor="apiKey">NVIDIA API Key:</label>
              <input 
                id="apiKey"
                type="password" 
                value={tempApiKey} 
                onChange={(e) => setTempApiKey(e.target.value)}
                placeholder="Enter your NVIDIA API key"
              />
            </div>
            
            {setNvidiaModel && (
              <div className="form-group">
                <label htmlFor="nvidiaModel">Character Model:</label>
                <select 
                  id="nvidiaModel" 
                  value={nvidiaModel}
                  onChange={handleModelChange}
                >
                  <option value="MARK">Mark</option>
                  <option value="CLAIRE">Claire</option>
                  <option value="JAMES">James</option>
                </select>
              </div>
            )}
            
            <button type="submit" className="control-button">Save Settings</button>
          </form>
        </div>
      )}
      
      <div className="instructions">
        <h3>Ready Player Me Viewer</h3>
        <p>
          {isAudioEnabled 
            ? 'Speak to animate the character\'s face' 
            : 'Enable audio to animate the character\'s face'}
        </p>
        <p className="note">
          {useNvidiaApi 
            ? 'Powered by NVIDIA Audio2Face API' 
            : 'Powered by local audio analysis'}
        </p>
      </div>
    </div>
  );
};

export default ControlPanel; 