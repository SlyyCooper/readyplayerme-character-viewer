# Ready Player Me Character Viewer

A modern web application for viewing and animating Ready Player Me 3D character models with NVIDIA Audio2Face technology.

## Features

- 3D character model viewing with interactive camera controls
- Audio-driven facial animation using microphone input
- Responsive UI with modern design
- Clean modular codebase structure

## Technologies Used

- React 18
- TypeScript
- Vite
- Three.js with React Three Fiber
- NVIDIA Audio2Face technology (simplified implementation)
- Web Audio API

## Getting Started

### Prerequisites

- Node.js 16+ and npm

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

## Project Structure

- `src/components/Character/` - Character model rendering components
- `src/components/AudioFace/` - Audio to face animation logic
- `src/hooks/` - Custom React hooks for audio analysis
- `src/types/` - TypeScript type definitions
- `src/assets/models/` - 3D model assets

## License

MIT
