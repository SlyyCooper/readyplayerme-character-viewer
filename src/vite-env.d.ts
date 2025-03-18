/**
 * src/vite-env.d.ts
 * TypeScript declarations for Vite
 * Enables proper TypeScript support for Vite-specific features
 */

/// <reference types="vite/client" />

declare module '*.glb' {
  const src: string;
  export default src;
}

declare module '*.gltf' {
  const src: string;
  export default src;
}

declare module '*.mp3' {
  const src: string;
  export default src;
}

declare module '*.wav' {
  const src: string;
  export default src;
}

declare module '*.ogg' {
  const src: string;
  export default src;
}

// Add explicit declaration for hark module
declare module 'hark' {
  interface Options {
    threshold?: number;
    speaking?: boolean;
    interval?: number;
    play?: boolean;
  }

  interface SpeechEvents {
    on(event: 'speaking' | 'stopped_speaking', callback: () => void): void;
    speaking: boolean;
    stop(): void;
  }

  function hark(stream: MediaStream, options?: Options): SpeechEvents;
  export default hark;
}
