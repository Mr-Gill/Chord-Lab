import { createContext, useContext, type ReactNode } from 'react';
import useAudio from '../hooks/useAudio';

type AudioContextType = ReturnType<typeof useAudio>;

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export function AudioProvider({ children }: { children: ReactNode }) {
  const audio = useAudio();
  return (
    <AudioContext.Provider value={audio}>
      {children}
    </AudioContext.Provider>
  );
}

export function useAudioContext() {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error('useAudioContext must be used within an AudioProvider');
  }
  return context;
}

