/**
 * src/services/NVIDIAAudio2FaceService.ts
 * Service for interacting with NVIDIA Audio2Face API
 * Used by AudioFaceController component to get professional facial animations
 */

import axios from 'axios';
import { BlendshapeMapping } from '../types';

// API Configuration
const API_ENDPOINT = 'https://grpc.nvcf.nvidia.com:443';
const API_MODELS = {
  MARK: 'b85c53f3-5d18-4edf-8b12-875a400eb798',
  CLAIRE: 'a05a5522-3059-4dfd-90e4-4bc1699ae9d4',
  JAMES: '52f51a79-324c-4dbe-90ad-798ab665ad64'
};

// Define response data interface
interface NvidiaResponseData {
  frame_rate?: number;
  blendshapes?: Array<Record<string, number>>;
  status?: string;
  error?: string;
}

class NVIDIAAudio2FaceService {
  private apiKey: string | null = null;
  private selectedModel: string = API_MODELS.MARK;
  private isInitialized: boolean = false;

  /**
   * Initialize the service with an API key
   */
  initialize(apiKey: string, model: 'MARK' | 'CLAIRE' | 'JAMES' = 'MARK'): void {
    this.apiKey = apiKey;
    this.selectedModel = API_MODELS[model];
    this.isInitialized = true;
    console.log(`NVIDIA Audio2Face service initialized with ${model} model`);
  }

  /**
   * Process audio data to get facial blendshapes
   * @param audioData - The audio data buffer
   * @returns Promise with blendshape data
   */
  async processAudioData(audioData: ArrayBuffer): Promise<{
    blendshapes: BlendshapeMapping,
    frameRate: number
  }> {
    if (!this.isInitialized || !this.apiKey) {
      throw new Error('NVIDIA Audio2Face service not initialized with API key');
    }

    try {
      // Create form data with audio file
      const formData = new FormData();
      formData.append('audio', new Blob([audioData], { type: 'audio/wav' }));
      formData.append('config', JSON.stringify({
        // Default emotion parameters
        emotion_intensity: 0.5,
        emotion_type: "neutral"
      }));

      // Call NVIDIA Audio2Face API
      const response = await axios.post<NvidiaResponseData>(
        `${API_ENDPOINT}/v2/functions/${this.selectedModel}`,
        formData,
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      // Process response into blendshapes format
      const frameRate = response.data.frame_rate || 30;
      const blendshapeData = this.processBlendshapeResponse(response.data);
      
      return {
        blendshapes: blendshapeData,
        frameRate
      };
    } catch (error) {
      console.error('Error calling NVIDIA Audio2Face API:', error);
      throw error;
    }
  }

  /**
   * Helper to convert NVIDIA's response format to our BlendshapeMapping
   */
  private processBlendshapeResponse(responseData: NvidiaResponseData): BlendshapeMapping {
    // Default mapping with neutral face
    const blendshapes: BlendshapeMapping = {
      'jawOpen': 0,
      'mouthOpen': 0,
      'mouthWide': 0,
      'mouthPucker': 0,
      'eyesClosed': 0,
      'eyeSquintLeft': 0,
      'eyeSquintRight': 0,
      'browDownLeft': 0,
      'browDownRight': 0,
      'browInnerUp': 0,
      'browOuterUpLeft': 0,
      'browOuterUpRight': 0,
    };

    // Map NVIDIA blendshape names to our format
    // This is a simplified example - actual implementation would need to map
    // NVIDIA's specific blendshape names to our application's format
    if (responseData.blendshapes && responseData.blendshapes.length > 0) {
      // Get the current frame's blendshapes
      const currentFrame = responseData.blendshapes[0];
      
      // Map NVIDIA blendshape names to our format
      Object.entries(currentFrame).forEach(([nvName, value]) => {
        // Example mapping (would need customization based on NVIDIA's actual format)
        if (nvName === 'jawOpen' || nvName === 'NVIDIA_blendshape_jawOpen') {
          blendshapes.jawOpen = value as number;
        }
        // Add more mappings as needed
      });
    }

    return blendshapes;
  }

  /**
   * Check if the service is initialized
   */
  isReady(): boolean {
    return this.isInitialized;
  }
}

// Create singleton instance
const nvidiAudio2FaceService = new NVIDIAAudio2FaceService();
export default nvidiAudio2FaceService; 