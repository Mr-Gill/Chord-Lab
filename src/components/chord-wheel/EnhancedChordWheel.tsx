import React, { useMemo, useRef, useCallback } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { getChordTheme } from '../../utils/diagramTheme';
import { getRomanNumeral, isDiatonicChord } from '../../utils/key-degrees';
import { useAudioContext } from '../../contexts/AudioProvider';

interface EnhancedChordWheelProps {
  selectedKey: string;
  onChordSelect?: (chord: string) => void;
  onKeyChange?: (key: string) => void;
}

interface ChordItemProps {
  chord: string;
  roman: string | null;
  isDiatonic: boolean;
  position: { x: number; y: number };
  onSelect: (chord: string) => void;
}

interface ProgressionDropZoneProps {
  progression: { chord: string; roman: string | null; id: string }[];
  onAddChord: (chord: string) => void;
  onRemoveChord: (id: string) => void;
  selectedKey: string;
}

const MAJORS_ORDER = ['C', 'G', 'D', 'A', 'E', 'B', 'F#', 'Db', 'Ab', 'Eb', 'Bb', 'F'];

function polar(cx: number, cy: number, r: number, a: number) {
  return [cx + r * Math.cos(a), cy + r * Math.sin(a)];
}

const ChordItem: React.FC<ChordItemProps> = ({ chord, roman, isDiatonic, position, onSelect }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'CHORD',
    item: { chord, roman },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  drag(ref);

  const handleClick = () => {
    onSelect(chord);
  };

  const theme = getChordTheme(chord);

  return (
    <div
      ref={ref}
      onClick={handleClick}
      className={`absolute transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full 
        cursor-pointer transition-all duration-200 flex flex-col items-center justify-center
        text-white font-bold text-sm border-2 border-white shadow-lg hover:scale-110
        ${isDragging ? 'opacity-50 scale-95' : ''}
        ${isDiatonic ? 'ring-2 ring-white ring-opacity-60 z-20' : 'opacity-40 z-10'}`}
      style={{
        left: position.x,
        top: position.y,
        backgroundColor: theme.primary,
        color: isDiatonic ? 'white' : '#666',
        pointerEvents: 'auto'
      }}
      title={`${chord}${roman ? ` (${roman})` : ''}`}
    >
      <span className="text-xs leading-none">{chord}</span>
      {roman && isDiatonic && (
        <span className="text-xs leading-none opacity-80">{roman}</span>
      )}
    </div>
  );
};

const ProgressionDropZone: React.FC<ProgressionDropZoneProps> = ({ 
  progression, 
  onAddChord, 
  onRemoveChord, 
  selectedKey: _selectedKey 
}) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'CHORD',
    drop: (item: { chord: string; roman: string | null }) => {
      onAddChord(item.chord);
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  return (
    <div
      ref={drop}
      className={`min-h-[120px] p-4 border-2 border-dashed rounded-lg transition-colors
        ${isOver ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-gray-50'}`}
    >
      <h3 className="font-semibold text-gray-700 mb-3 text-center">
        🧲 Drag chords here or click the wheel
      </h3>
      <div className="flex flex-wrap gap-2 justify-center">
        {progression.length === 0 ? (
          <p className="text-gray-500 text-sm text-center py-4">
            Your progression will appear here
          </p>
        ) : (
          progression.map((item) => {
            const theme = getChordTheme(item.chord);
            return (
              <div
                key={item.id}
                className="flex items-center gap-1 px-3 py-2 rounded-full text-white font-semibold shadow-md"
                style={{ backgroundColor: theme.primary }}
              >
                <span className="text-sm">
                  {item.roman ?? item.chord}
                </span>
                <button
                  onClick={() => onRemoveChord(item.id)}
                  className="ml-1 text-white hover:text-red-200 font-bold text-lg leading-none"
                  title="Remove chord"
                >
                  ×
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

const EnhancedChordWheel: React.FC<EnhancedChordWheelProps> = ({ 
  selectedKey, 
  onChordSelect, 
  onKeyChange 
}) => {
  const size = 400;
  const radius = 140;
  const step = (Math.PI * 2) / 12;

  const { initAudio } = useAudioContext();

  const handleChordSelect = useCallback((chord: string) => {
    initAudio();
    // Play chord audio (simplified - use chord notes if available)
    onChordSelect?.(chord);
  }, [initAudio, onChordSelect]);

  const chordPositions = useMemo(() => {
    const center = { x: size / 2, y: size / 2 };
    return MAJORS_ORDER.map((rootChord, index) => {
      const angle = -Math.PI / 2 + index * step;
      const [x, y] = polar(center.x, center.y, radius, angle);
      
      // Get the major and relative minor chords
      const majorChord = rootChord;
      const minorChord = rootChord + 'm';
      
      const majorRoman = getRomanNumeral(majorChord, selectedKey);
      const minorRoman = getRomanNumeral(minorChord, selectedKey);
      
      const isMajorDiatonic = isDiatonicChord(majorChord, selectedKey);
      const isMinorDiatonic = isDiatonicChord(minorChord, selectedKey);

      return {
        major: {
          chord: majorChord,
          roman: majorRoman,
          isDiatonic: isMajorDiatonic,
          position: { x, y }
        },
        minor: {
          chord: minorChord,
          roman: minorRoman,
          isDiatonic: isMinorDiatonic,
          position: { x: x * 0.7, y: y * 0.7 } // Inner ring
        }
      };
    });
  }, [selectedKey, radius, step]);

  return (
    <div className="w-full bg-white rounded-xl shadow-lg p-6">
      {/* Key selector prominently placed above the wheel */}
      <div className="mb-6">
        <label className="block text-lg font-readex font-semibold text-gray-800 mb-3 text-center">
          🗝️ Pick a key to start
        </label>
        <select
          value={selectedKey}
          onChange={(e) => onKeyChange?.(e.target.value)}
          className="w-full px-4 py-3 text-lg font-semibold text-center border-2 border-gray-300 rounded-lg 
            focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white shadow-sm"
        >
          {MAJORS_ORDER.map(key => (
            <option key={key} value={key}>{key} Major</option>
          ))}
        </select>
      </div>

      {/* Chord wheel */}
      <div className="relative flex justify-center mb-6">
        <div
          className="relative bg-gradient-to-br from-gray-50 to-gray-100 rounded-full border-4 border-gray-200 shadow-inner"
          style={{ width: size, height: size }}
        >
          {/* Background circle for visual appeal */}
          <div 
            className="absolute inset-4 bg-gradient-to-br from-blue-50 to-purple-50 rounded-full border border-gray-200 pointer-events-none z-0"
          />
          
          {/* Render chord positions */}
          {chordPositions.map(({ major, minor }, index) => (
            <React.Fragment key={index}>
              {/* Major chord (outer ring) */}
              <ChordItem
                chord={major.chord}
                roman={major.roman}
                isDiatonic={major.isDiatonic}
                position={major.position}
                onSelect={handleChordSelect}
              />
              
              {/* Minor chord (inner ring) */}
              <ChordItem
                chord={minor.chord}
                roman={minor.roman}
                isDiatonic={minor.isDiatonic}
                position={minor.position}
                onSelect={handleChordSelect}
              />
            </React.Fragment>
          ))}

          {/* Center label */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-5">
            <div className="bg-white rounded-full w-20 h-20 flex items-center justify-center shadow-lg border-2 border-gray-200">
              <span className="text-lg font-bold text-gray-800">{selectedKey}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="text-center text-sm text-gray-600 mb-4">
        <p className="font-medium mb-2">✨ Visual Guide</p>
        <div className="flex justify-center gap-4 text-xs">
          <span className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-blue-500 opacity-100"></div>
            Diatonic (emphasized)
          </span>
          <span className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-gray-400 opacity-40"></div>
            Non-diatonic (dimmed)
          </span>
        </div>
        <p className="mt-2 text-xs italic">
          In <strong>{selectedKey} major</strong>: I, ii, iii, IV, V, vi are highlighted
        </p>
      </div>
    </div>
  );
};

export { EnhancedChordWheel, ProgressionDropZone };