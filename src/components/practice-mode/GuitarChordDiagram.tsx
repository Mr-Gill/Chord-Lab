import React, { useMemo } from 'react';
import './GuitarChordDiagram.css';
import type { ChordOption } from '../../types';

interface GuitarChordDiagramProps {
  chord: ChordOption;
  rootNoteColor?: string;
}

interface BarreChord {
  fret: number;
  minString: number;
  maxString: number;
}

const GuitarChordDiagram: React.FC<GuitarChordDiagramProps> = ({ 
  chord, 
  rootNoteColor = '#ff6b6b',
}) => {
  // Find the highest fret to determine diagram offset
  const highestFret = Math.max(...chord.positions.map(p => p.fret), 1);
  const startFret = highestFret > 4 ? highestFret - 3 : 1;

  // Check if there's a barre chord
  const barreChords = useMemo<BarreChord[]>(() => {
    const frets: Record<number, number[]> = {};
    
    chord.positions.forEach(pos => {
      if (pos.fret > 0) {
        if (!frets[pos.fret]) frets[pos.fret] = [];
        frets[pos.fret].push(pos.string);
      }
    });

    return Object.entries(frets)
      .filter(([, strings]) => {
        // Require at least 3 strings AND they must be consecutive for a barre
        if (strings.length < 3) return false;
        
        strings.sort((a, b) => a - b);
        // Check if strings are consecutive (allowing for gaps of 1)
        for (let i = 1; i < strings.length; i++) {
          if (strings[i] - strings[i-1] > 2) return false;
        }
        
        // Also check if the strings span at least 2 string positions
        return (Math.max(...strings) - Math.min(...strings)) >= 2;
      })
      .map(([fret, strings]) => ({
        fret: parseInt(fret),
        minString: Math.min(...strings),
        maxString: Math.max(...strings)
      }));
  }, [chord.positions]);

  // String widths from thinnest (high E, string 1) to thickest (low E, string 6)
  const stringWidths = ['3px', '4px', '6px', '8px', '12px', '18px']; // Index 0 = string 1, Index 5 = string 6
  
  // Get X/O status for each string (1-6, where 6 is low E)
  const getStringStatus = (stringNum: number) => {
    const position = chord.positions.find(p => p.string === stringNum);
    if (!position) return null; // Not specified, don't show anything
    if (position.fret === 0) {
      return position.muted ? 'X' : 'O'; // Use explicit muted flag
    }
    return null; // Fretted note, no X/O indicator
  };
  
  return (
    <div className="fretboard-wrap">
      <div className="chord-name" style={{ color: rootNoteColor }}>
        {chord.name}
      </div>
      <div className="fretboard">
        {/* Nut */}
        <div className="nut"></div>
        <div className="endline"></div>
        
        {/* Fret lines */}
        {[1, 2, 3, 4, 5].map((fret) => (
          <div 
            key={`fret-line-${fret}`}
            className="fret-line"
            style={{
              top: `calc((100%/6)*${fret})`
            }}
          />
        ))}
        
        {/* Inlays at 3rd and 5th frets */}
        <div className="inlay" style={{ top: 'calc((100%/6)*2.5)' }}></div>
        <div className="inlay" style={{ top: 'calc((100%/6)*4.5)' }}></div>
        
        {/* Strings - from left to right: 6, 5, 4, 3, 2, 1 */}
        {[6, 5, 4, 3, 2, 1].map((string, index) => {
          const position = chord.positions.find(p => p.string === string);
          const stringWidth = stringWidths[string - 1]; // Use direct string index
          const stringColor = position?.muted ? '#bfbfbf' : '#111'; // Gray for muted, black for active
          
          return (
            <div 
              key={`string-${string}`}
              className="string"
              style={{
                left: `calc((100%/6)*${index} + (100%/6)/2)`, // Position 0-5 from left to right
                '--sw': `calc(${stringWidth} * var(--scale))`,
                '--sc': stringColor
              } as React.CSSProperties}
            />
          );
        })}
        
        {/* X/O Indicators */}
        {[6, 5, 4, 3, 2, 1].map((string, index) => {
          const status = getStringStatus(string);
          if (!status) return null;
          
          return (
            <div 
              key={`xo-${string}`}
              className="xo"
              style={{
                left: `calc((100%/6)*${index} + (100%/6)/2)`, // Match string positioning
                color: rootNoteColor
              }}
            >
              {status}
            </div>
          );
        })}
        
        {/* Barre chords */}
        {barreChords.map((barre, idx) => {
          // Convert string numbers to position indices
          const minIndex = 6 - barre.maxString; // Left-most position
          const maxIndex = 6 - barre.minString; // Right-most position
          
          return (
            <div 
              key={`barre-${idx}`}
              className="barre"
              style={{
                left: `calc((100%/6)*${minIndex} + (100%/6)*0.12)`,
                width: `calc((100%/6)*${maxIndex - minIndex + 1} + (100%/6)*0.76)`,
                top: `calc((100%/6)*${barre.fret - 0.5})`,
                '--cc': rootNoteColor
              } as React.CSSProperties}
            >
              1
            </div>
          );
        })}
        
        {/* Finger positions */}
        {chord.positions.filter(p => p.fret > 0).map((pos, idx) => {
          // Skip if this position is part of a barre chord
          const isBarrePosition = barreChords.some(b => 
            pos.fret === b.fret && pos.string >= b.minString && pos.string <= b.maxString
          );
          if (isBarrePosition) return null;
          
          // Convert string number to position index (string 6=index 0, string 1=index 5)
          const positionIndex = 6 - pos.string;
          
          return (
            <div 
              key={`dot-${idx}`}
              className="dot"
              style={{
                left: `calc((100%/6)*${positionIndex} + (100%/6)/2)`,
                top: `calc((100%/6)*${pos.fret - 0.5})`,
                '--cc': rootNoteColor
              } as React.CSSProperties}
            >
              {pos.finger}
            </div>
          );
        })}
        
        {/* Positions */}
        {chord.positions.map((pos) => {
          if (pos.muted) return <div key={`${pos.string}-muted`} className="string-marker" style={{ left: `calc((100%/6)*${6 - pos.string} + (100%/6)/2)` }} />;
          return (
            <div 
              key={`${pos.string}-${pos.fret}`}
              className="fret-marker"
              style={{
                left: `calc((100%/6)*${6 - pos.string} + (100%/6)/2)`,
                top: `calc((100%/6)*${pos.fret - 0.5})`,
                '--cc': rootNoteColor
              } as React.CSSProperties}
            />
          );
        })}
      </div>
      
      {/* Note strip - from left to right: E A D G B E (strings 6 5 4 3 2 1) */}
      <div className="note-strip">
        {['E', 'A', 'D', 'G', 'B', 'E'].map((note, index) => {
          const stringNumber = 6 - index; // Convert index to string number (0->6, 1->5, etc.)
          const position = chord.positions.find(p => p.string === stringNumber);
          
          // Show note name if the string is played (either open or fretted, but not muted)
          const shouldShowNote = position && !position.muted;
          let noteName = '';
          
          if (shouldShowNote) {
            if (position.fret === 0) {
              noteName = note; // Open string note
            } else {
              // Calculate fretted note (simplified - you might want a more comprehensive note calculation)
              const noteMap: Record<string, string[]> = {
                'E': ['E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B', 'C', 'C#', 'D', 'D#'],
                'A': ['A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#'],
                'D': ['D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B', 'C', 'C#'],
                'G': ['G', 'G#', 'A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#'],
                'B': ['B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#'],
              };
              const baseNote = stringNumber === 1 ? 'E' : note;
              noteName = noteMap[baseNote]?.[position.fret] || note;
            }
          }
          
          return (
            <span 
              key={`note-${stringNumber}`} 
              style={{ color: shouldShowNote ? rootNoteColor : 'transparent' }}
            >
              {noteName}
            </span>
          );
        })}
      </div>
      
      {startFret > 1 && (
        <div className="fret-number">
          {startFret}fr
        </div>
      )}
    </div>
  );
};

export default GuitarChordDiagram;
