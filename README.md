# Ready Player Me Character Viewer

A modern web application for viewing and animating Ready Player Me 3D character models with NVIDIA Audio2Face technology.

## Features

- 3D character model viewing with interactive camera controls
- Audio-driven facial animation using microphone input
- NVIDIA Audio2Face API integration for professional-quality facial animation
- Responsive UI with modern design
- Clean modular codebase structure

## Technologies Used

- React 18
- TypeScript
- Vite
- Three.js with React Three Fiber
- NVIDIA Audio2Face technology (both simplified local implementation and API integration)
- Web Audio API

## Getting Started

### Prerequisites

- Node.js 16+ and npm
- NVIDIA Audio2Face API key (optional, for enhanced facial animations)

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

4. Open your browser to the URL displayed in the terminal (usually http://localhost:5173)

## Usage

1. The character will be loaded automatically
2. Use your mouse/trackpad to:
   - Rotate view: Click and drag
   - Zoom: Scroll wheel
   - Pan: Right-click and drag

3. Click "Enable Audio" to activate facial animation with your microphone
4. Speak to see the character's face animate in response to your voice
5. Click "Reset Character" to return to the default view

### Using NVIDIA Audio2Face API

For enhanced facial animations:

1. Click the "Use NVIDIA Audio2Face" button
2. Click "API Settings" to open the settings panel
3. Enter your NVIDIA API key
4. Select a character model (Mark, Claire, or James)
5. Click "Save Settings"
6. Enable audio to see the enhanced facial animations

## Project Structure

- `src/components/Character/` - Character model rendering components
- `src/components/AudioFace/` - Audio to face animation logic
- `src/hooks/` - Custom React hooks for audio analysis
- `src/services/` - Services for API integration
- `src/types/` - TypeScript type definitions
- `src/assets/models/` - 3D model assets

## NVIDIA Audio2Face API

This application supports integration with NVIDIA's Audio2Face API, which provides high-quality facial animations from audio input. To use this feature:

1. You need to obtain an API key from NVIDIA
2. The API offers three character models:
   - Mark (male)
   - Claire (female)
   - James (male)
3. When enabled, audio from your microphone is sent to NVIDIA's servers for processing
4. The resulting facial animations are applied to your 3D character model

More information about NVIDIA's Audio2Face API can be found at: https://catalog.ngc.nvidia.com/orgs/nvidia/models/audio2face-3d-authoring

## License

MIT
