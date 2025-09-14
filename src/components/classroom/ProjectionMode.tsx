import React, { useState, useEffect } from 'react';
import GuitarChordDiagram from '../practice-mode/GuitarChordDiagram';
import PianoDiagram from '../diagrams/PianoDiagram';
import { chords as chordData } from '../../data/chords';

interface ProjectionModeProps {
  isActive: boolean;
  onClose: () => void;
}

interface ChordOption {
  name: string;
  positions: any[];
  notes: string[];
}

type RoomSize = 'small' | 'medium' | 'large' | 'auditorium';
type Instrument = 'guitar' | 'piano';

const ProjectionMode: React.FC<ProjectionModeProps> = ({ isActive, onClose }) => {
  const [currentChord, setCurrentChord] = useState<ChordOption>({
    name: 'C Major',
    positions: chordData['C Major']?.guitarPositions || [],
    notes: chordData['C Major']?.pianoNotes || ['C', 'E', 'G'],
  });
  const [instrument, setInstrument] = useState<Instrument>('guitar');
  const [roomSize, setRoomSize] = useState<RoomSize>('medium');
  const [showControls, setShowControls] = useState(true);
  const [autoAdvance, setAutoAdvance] = useState(false);
  const [autoAdvanceInterval, setAutoAdvanceInterval] = useState(5);

  const chordOptions: ChordOption[] = Object.entries(chordData).map(([name, chord]) => ({
    name,
    positions: chord.guitarPositions || [],
    notes: chord.pianoNotes || [],
  }));

  const roomSizeSettings = {
    small: { scale: 1.5, fontSize: '1.2rem', padding: '2rem' },
    medium: { scale: 2, fontSize: '1.5rem', padding: '3rem' },
    large: { scale: 2.5, fontSize: '2rem', padding: '4rem' },
    auditorium: { scale: 3, fontSize: '2.5rem', padding: '5rem' },
  };

  const currentSettings = roomSizeSettings[roomSize];

  // Auto-advance functionality
  useEffect(() => {
    if (!autoAdvance || !isActive) return;

    const interval = setInterval(() => {
      setCurrentChord(prev => {
        const currentIndex = chordOptions.findIndex(c => c.name === prev.name);
        const nextIndex = (currentIndex + 1) % chordOptions.length;
        return chordOptions[nextIndex];
      });
    }, autoAdvanceInterval * 1000);

    return () => clearInterval(interval);
  }, [autoAdvance, autoAdvanceInterval, chordOptions, isActive]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!isActive) return;

      switch (e.key) {
        case 'Escape':
          onClose();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          setCurrentChord(prev => {
            const currentIndex = chordOptions.findIndex(c => c.name === prev.name);
            const prevIndex = currentIndex === 0 ? chordOptions.length - 1 : currentIndex - 1;
            return chordOptions[prevIndex];
          });
          break;
        case 'ArrowRight':
          e.preventDefault();
          setCurrentChord(prev => {
            const currentIndex = chordOptions.findIndex(c => c.name === prev.name);
            const nextIndex = (currentIndex + 1) % chordOptions.length;
            return chordOptions[nextIndex];
          });
          break;
        case ' ':
          e.preventDefault();
          setAutoAdvance(prev => !prev);
          break;
        case 'h':
        case 'H':
          setShowControls(prev => !prev);
          break;
        case 'g':
        case 'G':
          setInstrument('guitar');
          break;
        case 'p':
        case 'P':
          setInstrument('piano');
          break;
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [isActive, chordOptions, onClose]);

  if (!isActive) return null;

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col">
      {/* Main content area */}
      <div 
        className="flex-1 flex items-center justify-center"
        style={{ padding: currentSettings.padding }}
      >
        <div 
          className="text-center"
          style={{ 
            transform: `scale(${currentSettings.scale})`,
            transformOrigin: 'center',
          }}
        >
          {/* Chord name */}
          <h1 
            className="text-white font-bold mb-8"
            style={{ fontSize: currentSettings.fontSize }}
          >
            {currentChord.name}
          </h1>

          {/* Chord diagram */}
          <div className="bg-white rounded-lg p-8 shadow-2xl">
            {instrument === 'guitar' ? (
              <GuitarChordDiagram 
                chord={currentChord} 
                rootNoteColor="#3b82f6"
              />
            ) : (
              <PianoDiagram 
                chord={currentChord}
                rootNoteColor="#3b82f6"
              />
            )}
          </div>

          {/* Progress indicator for auto-advance */}
          {autoAdvance && (
            <div className="mt-8">
              <div className="w-64 h-2 bg-gray-700 rounded-full mx-auto overflow-hidden">
                <div 
                  className="h-full bg-blue-500 transition-all ease-linear"
                  style={{
                    width: '100%',
                    animation: `shrink ${autoAdvanceInterval}s linear infinite`,
                  }}
                />
              </div>
              <p className="text-white text-sm mt-2">
                Auto-advancing in {autoAdvanceInterval}s
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Controls overlay */}
      {showControls && (
        <div className="absolute top-0 left-0 right-0 bg-black bg-opacity-50 text-white p-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <select
                value={currentChord.name}
                onChange={(e) => {
                  const selected = chordOptions.find(c => c.name === e.target.value);
                  if (selected) setCurrentChord(selected);
                }}
                className="px-3 py-2 bg-gray-800 text-white rounded border border-gray-600"
              >
                {chordOptions.map(chord => (
                  <option key={chord.name} value={chord.name}>{chord.name}</option>
                ))}
              </select>

              <select
                value={instrument}
                onChange={(e) => setInstrument(e.target.value as Instrument)}
                className="px-3 py-2 bg-gray-800 text-white rounded border border-gray-600"
              >
                <option value="guitar">Guitar</option>
                <option value="piano">Piano</option>
              </select>

              <select
                value={roomSize}
                onChange={(e) => setRoomSize(e.target.value as RoomSize)}
                className="px-3 py-2 bg-gray-800 text-white rounded border border-gray-600"
              >
                <option value="small">Small Room</option>
                <option value="medium">Medium Room</option>
                <option value="large">Large Room</option>
                <option value="auditorium">Auditorium</option>
              </select>
            </div>

            <div className="flex items-center space-x-4">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={autoAdvance}
                  onChange={(e) => setAutoAdvance(e.target.checked)}
                  className="rounded"
                />
                <span>Auto-advance</span>
              </label>

              {autoAdvance && (
                <select
                  value={autoAdvanceInterval}
                  onChange={(e) => setAutoAdvanceInterval(Number(e.target.value))}
                  className="px-2 py-1 bg-gray-800 text-white rounded border border-gray-600"
                >
                  <option value={3}>3s</option>
                  <option value={5}>5s</option>
                  <option value={10}>10s</option>
                  <option value={15}>15s</option>
                </select>
              )}

              <button
                onClick={onClose}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
              >
                Exit (ESC)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Keyboard shortcuts help */}
      <div className="absolute bottom-4 left-4 text-white text-xs bg-black bg-opacity-50 p-3 rounded">
        <div className="space-y-1">
          <div><strong>Keyboard Shortcuts:</strong></div>
          <div>← → : Previous/Next chord</div>
          <div>Space: Toggle auto-advance</div>
          <div>G/P: Switch to Guitar/Piano</div>
          <div>H: Toggle controls</div>
          <div>ESC: Exit projection mode</div>
        </div>
      </div>

      <style jsx>{`
        @keyframes shrink {
          from { width: 100%; }
          to { width: 0%; }
        }
      `}</style>
    </div>
  );
};

export default ProjectionMode;