import { createContext, useContext, useState, useEffect } from 'react'
import type { ReactNode, Dispatch, SetStateAction } from 'react'

interface Chord {
  id: string;
  name: string;
  key: string;
}

interface ChordBuilderContextType {
  chords: Chord[];
  setChords: Dispatch<SetStateAction<Chord[]>>;
  selectedKey: string;
  setSelectedKey: Dispatch<SetStateAction<string>>;
}

const ChordBuilderContext = createContext<ChordBuilderContextType | undefined>(undefined);

export function ChordBuilderProvider({ children }: { children: ReactNode }) {
  const [chords, setChords] = useState<Chord[]>(() => {
    const saved = localStorage.getItem('chordProgression');
    return saved ? JSON.parse(saved) : [];
  });

  const [selectedKey, setSelectedKey] = useState(() => {
    return localStorage.getItem('selectedKey') || 'C';
  });

  useEffect(() => {
    localStorage.setItem('chordProgression', JSON.stringify(chords));
    localStorage.setItem('selectedKey', selectedKey);
  }, [chords, selectedKey]);

  return (
    <ChordBuilderContext.Provider value={{ chords, setChords, selectedKey, setSelectedKey }}>
      {children}
    </ChordBuilderContext.Provider>
  );
}

export function useChordBuilder() {
  const context = useContext(ChordBuilderContext);
  if (!context) {
    throw new Error('useChordBuilder must be used within a ChordBuilderProvider');
  }
  return context;
}
