import React from 'react';
import './PianoChordDiagram.css';
import { getChordTheme } from '../../utils/diagramTheme';
import { KEYBOARD_LAYOUT } from '../diagrams/PianoDiagram';
import { getMidiNumber, getNoteFromMidi, getNoteName } from '../../utils/music-theory';

interface PianoChordDiagramProps {
  notes: string[];
  chordName?: string;
  color?: string; // Hex color code
}

const PianoChordDiagram: React.FC<PianoChordDiagramProps> = ({
  notes,
  chordName,
  color
}) => {
  const resolvedColor = color ?? getChordTheme(chordName ?? '').primary;
  const activeNotes = notes || [];
  
  const keys = [
    { type: 'white', note: 'C' },
    { type: 'black', note: 'C#' },
    { type: 'white', note: 'D' },
    { type: 'black', note: 'D#' },
    { type: 'white', note: 'E' },
    { type: 'white', note: 'F' },
    { type: 'black', note: 'F#' },
    { type: 'white', note: 'G' },
    { type: 'black', note: 'G#' },
    { type: 'white', note: 'A' },
    { type: 'black', note: 'A#' },
    { type: 'white', note: 'B' },
}) => {
  const normalizeNote = (note: string) => {
    const midi = getMidiNumber(note);
    const standardized = midi !== null ? getNoteFromMidi(midi) : note;
    return getNoteName(standardized);
  };
  const activeNotes = (notes || []).map(normalizeNote);

  const allKeys = [
    ...KEYBOARD_LAYOUT.whiteKeys.map(k => ({ ...k, type: 'white' as const, root: getNoteName(k.note) })),
    ...KEYBOARD_LAYOUT.blackKeys.map(k => ({ ...k, type: 'black' as const, root: getNoteName(k.note) })),
  ];

  // Calculate positions
  const whiteKeyWidth = 100 / KEYBOARD_LAYOUT.totalWhiteKeys;

  // For black keys: left = (position * whiteKeyWidth) - (whiteKeyWidth * 0.32)
  const getBlackKeyLeft = (position: number) => {
    return `calc(${position * whiteKeyWidth}% - ${whiteKeyWidth * 0.32}%)`;
  };

  // For fill overlays: left = (position * whiteKeyWidth)% for white keys
  const getFillLeft = (position: number, isBlack: boolean) => {
    if (isBlack) {
      return getBlackKeyLeft(position);
    }
    return `${position * whiteKeyWidth}%`;
  };

  // Process chord data

  return (
    <div className="piano-diagram-container">
      <div className="keyboard-wrap">
      <div
        className="keyboard"
        role="img"
        aria-label={`${chordName} chord`}
      >
        {/* White keys */}
        {KEYBOARD_LAYOUT.whiteKeys.map(({ note }, index) => (
          <div
            key={note}
            className="white"
            style={{
              left: `calc(100% / 11 * ${index})`,
            }}
            aria-label={note}
          />
        ))}
        
        {/* Black keys with positioning */}
        {KEYBOARD_LAYOUT.blackKeys.map(({ note, position }) => (
          <div
            key={note}
            className="black"
            style={{
              left: getBlackKeyLeft(position)
            }}
          />
        ))}
        
        {/* Grid lines overlay */}
        
        {/* Fill overlays for active notes */}
        {activeNotes.map((note, index) => {
          const key = allKeys.find(k => k.root === note);
          if (!key) return null;

          const isBlack = key.type === 'black';

          return (
            <div
              key={`fill-${index}`}
              className={`fill ${isBlack ? 'fill-black' : 'fill-white'}`}
              style={{
                left: getFillLeft(key.position, isBlack),
                width: isBlack
                  ? `calc(100%/11 * 0.64)`
                  : `calc(100%/11)`,
                background: color
              }}
            />
          );
        })}

        {/* Note indicators */}
        {activeNotes.map((note, index) => {
          const key = allKeys.find(k => k.root === note);
          if (!key) return null;

          const isBlack = key.type === 'black';

          return (
            <div
              key={`note-${index}`}
              className={`note ${isBlack ? 'black' : 'white'}`}
              style={{
                left: `calc(100%/11*${key.position} + 100%/11*0.5)`,
              }}
            >
              {note}
            </div>
          );
        })}
      </div>
    </div>
    </div>
  );
};

export default PianoChordDiagram;
