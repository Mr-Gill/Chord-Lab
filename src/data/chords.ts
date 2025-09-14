export interface FretPosition {
  string: number;
  fret: number;
  finger: number;
  isRoot?: boolean;
  muted?: boolean; // Explicitly mark muted strings
}

export interface ChordDefinition {
  pianoNotes: string[];
  guitarPositions: FretPosition[];
  level?: number;
  color: string;
  noteLabels?: string[];
}

export const chords: Record<string, ChordDefinition> = {
  C: {
    pianoNotes: ['C4', 'E4', 'G4'],
    guitarPositions: [
      { string: 6, fret: 0, finger: 0, muted: true }, // Muted (X)
      { string: 5, fret: 3, finger: 3 }, // A string, 3rd fret
      { string: 4, fret: 2, finger: 2 }, // D string, 2nd fret  
      { string: 3, fret: 0, finger: 0 }, // Open G (O)
      { string: 2, fret: 1, finger: 1 }, // B string, 1st fret
      { string: 1, fret: 0, finger: 0 }, // Open high E (O)
    ],
    level: 1,
    color: "#cc39bc"
  },
  G: {
    pianoNotes: ['G3', 'B3', 'D4'],
    guitarPositions: [
      { string: 1, fret: 3, finger: 3 },
      { string: 5, fret: 2, finger: 2 },
      { string: 6, fret: 3, finger: 4 },
    ],
    level: 1,
    color: "#714faa"
  },
  D: {
    pianoNotes: ['D4', 'F#4', 'A4'],
    guitarPositions: [
      { string: 1, fret: 2, finger: 2 },
      { string: 2, fret: 3, finger: 3 },
      { string: 3, fret: 2, finger: 1 },
    ],
    level: 1,
    color: "#3b8bf9"
  },
  A: {
    pianoNotes: ['A3', 'C#4', 'E4'],
    guitarPositions: [
      { string: 6, fret: 0, finger: 0, muted: true }, // X - muted low E
      { string: 5, fret: 0, finger: 0 }, // O - open A
      { string: 4, fret: 2, finger: 1 }, // E at 2nd fret
      { string: 3, fret: 2, finger: 2 }, // A at 2nd fret
      { string: 2, fret: 2, finger: 3 }, // C# at 2nd fret
      { string: 1, fret: 0, finger: 0 }, // O - open high E
    ],
    level: 1,
    color: "#02c7f9"
  },
  E: {
    pianoNotes: ['E3', 'G#3', 'B3'],
    guitarPositions: [
      { string: 6, fret: 0, finger: 0 }, // Open low E
      { string: 5, fret: 2, finger: 2 }, // B at 2nd fret
      { string: 4, fret: 2, finger: 3 }, // E at 2nd fret
      { string: 3, fret: 1, finger: 1 }, // G# at 1st fret
      { string: 2, fret: 0, finger: 0 }, // Open B
      { string: 1, fret: 0, finger: 0 }, // Open high E
    ],
    level: 1,
    color: "#00e3e2"
  },
  F: {
    pianoNotes: ['F3', 'A3', 'C4'],
    guitarPositions: [
      { string: 1, fret: 1, finger: 1 },
      { string: 2, fret: 1, finger: 1 },
      { string: 3, fret: 2, finger: 2 },
      { string: 4, fret: 3, finger: 3 },
    ],
    level: 1,
    color: "#ff2a44"
  },
  Bb: {
    pianoNotes: ['Bb3', 'D4', 'F4'],
    guitarPositions: [
      { string: 5, fret: 1, finger: 1 },
      { string: 4, fret: 3, finger: 3 },
      { string: 3, fret: 3, finger: 4 },
      { string: 2, fret: 3, finger: 4 },
      { string: 1, fret: 1, finger: 1 },
    ],
    level: 1,
    color: "#ff4b2c"
  },
  Eb: {
    pianoNotes: ['Eb4', 'G4', 'Bb4'],
    guitarPositions: [
      { string: 5, fret: 6, finger: 1 },
      { string: 4, fret: 8, finger: 3 },
      { string: 3, fret: 8, finger: 4 },
      { string: 2, fret: 8, finger: 4 },
      { string: 1, fret: 6, finger: 1 },
    ],
    level: 1,
    color: "#ff6813"
  },
  Ab: {
    pianoNotes: ['Ab3', 'C4', 'Eb4'],
    guitarPositions: [
      { string: 6, fret: 4, finger: 1 },
      { string: 5, fret: 6, finger: 3 },
      { string: 4, fret: 6, finger: 4 },
      { string: 3, fret: 5, finger: 2 },
      { string: 2, fret: 4, finger: 1 },
      { string: 1, fret: 4, finger: 1 },
    ],
    level: 1,
    color: "#fdd500"
  },
  Db: {
    pianoNotes: ['Db4', 'F4', 'Ab4'],
    guitarPositions: [
      { string: 5, fret: 4, finger: 1 },
      { string: 4, fret: 6, finger: 3 },
      { string: 3, fret: 6, finger: 4 },
      { string: 2, fret: 6, finger: 4 },
      { string: 1, fret: 4, finger: 1 },
    ],
    level: 1,
    color: "#79c505"
  },
  'F#': {
    pianoNotes: ['F#3', 'A#3', 'C#4'],
    guitarPositions: [
      { string: 6, fret: 2, finger: 1 },
      { string: 5, fret: 4, finger: 3 },
      { string: 4, fret: 4, finger: 4 },
      { string: 3, fret: 3, finger: 2 },
      { string: 2, fret: 2, finger: 1 },
      { string: 1, fret: 2, finger: 1 },
    ],
    level: 1,
    color: "#33ffcc"
  },
  B: {
    pianoNotes: ['B3', 'D#4', 'F#4'],
    guitarPositions: [
      { string: 5, fret: 2, finger: 1 },
      { string: 4, fret: 4, finger: 3 },
      { string: 3, fret: 4, finger: 4 },
      { string: 2, fret: 4, finger: 4 },
      { string: 1, fret: 2, finger: 1 },
    ],
    level: 1,
    color: "#00d48e"
  },
  Am: {
    pianoNotes: ['A3', 'C4', 'E4'],
    guitarPositions: [
      { string: 2, fret: 1, finger: 1 },
      { string: 3, fret: 2, finger: 2 },
      { string: 4, fret: 2, finger: 3 },
    ],
    level: 1,
    color: "#ab369e"
  },
  Em: {
    pianoNotes: ['E3', 'G3', 'B3'],
    guitarPositions: [
      { string: 4, fret: 2, finger: 2 },
      { string: 5, fret: 2, finger: 3 },
    ],
    level: 1,
    color: "#624890"
  },
  Dm: {
    pianoNotes: ['D4', 'F4', 'A4'],
    guitarPositions: [
      { string: 1, fret: 1, finger: 1 },
      { string: 2, fret: 3, finger: 3 },
      { string: 3, fret: 2, finger: 2 },
    ],
    level: 1,
    color: "#d4293f"
  },
  Bm: {
    pianoNotes: ['B3', 'D4', 'F#4'],
    guitarPositions: [
      { string: 5, fret: 2, finger: 1 },
      { string: 4, fret: 4, finger: 3 },
      { string: 3, fret: 4, finger: 4 },
      { string: 2, fret: 3, finger: 2 },
      { string: 1, fret: 2, finger: 1 },
    ],
    level: 1,
    color: "#3777cf"
  },
  'F#m': {
    pianoNotes: ['F#3', 'A3', 'C#4'],
    guitarPositions: [
      { string: 6, fret: 2, finger: 1 },
      { string: 5, fret: 4, finger: 3 },
      { string: 4, fret: 4, finger: 4 },
      { string: 3, fret: 2, finger: 2 },
      { string: 2, fret: 2, finger: 1 },
      { string: 1, fret: 2, finger: 1 },
    ],
    level: 1,
    color: "#33cccc"
  },
  'C#m': {
    pianoNotes: ['C#4', 'E4', 'G#4'],
    guitarPositions: [
      { string: 5, fret: 4, finger: 1 },
      { string: 4, fret: 6, finger: 3 },
      { string: 3, fret: 6, finger: 4 },
      { string: 2, fret: 5, finger: 2 },
      { string: 1, fret: 4, finger: 1 },
    ],
    level: 1,
    color: "#66ff99"
  },
  'G#m': {
    pianoNotes: ['G#3', 'B3', 'D#4'],
    guitarPositions: [
      { string: 6, fret: 4, finger: 1 },
      { string: 5, fret: 6, finger: 3 },
      { string: 4, fret: 6, finger: 4 },
      { string: 3, fret: 4, finger: 2 },
      { string: 2, fret: 4, finger: 1 },
      { string: 1, fret: 4, finger: 1 },
    ],
    level: 1,
    color: "#ffcc99"
  },
  'D#m': {
    pianoNotes: ['D#4', 'F#4', 'A#4'],
    guitarPositions: [
      { string: 5, fret: 6, finger: 1 },
      { string: 4, fret: 8, finger: 3 },
      { string: 3, fret: 8, finger: 4 },
      { string: 2, fret: 7, finger: 2 },
      { string: 1, fret: 6, finger: 1 },
    ],
    level: 1,
    color: "#33ff66"
  },
  Bbm: {
    pianoNotes: ['Bb3', 'Db4', 'F4'],
    guitarPositions: [
      { string: 5, fret: 1, finger: 1 },
      { string: 4, fret: 3, finger: 3 },
      { string: 3, fret: 3, finger: 4 },
      { string: 2, fret: 2, finger: 2 },
      { string: 1, fret: 1, finger: 1 },
    ],
    level: 1,
    color: "#69a50b"
  },
  Fm: {
    pianoNotes: ['F3', 'Ab3', 'C4'],
    guitarPositions: [
      { string: 6, fret: 1, finger: 1 },
      { string: 5, fret: 3, finger: 3 },
      { string: 4, fret: 3, finger: 4 },
      { string: 3, fret: 1, finger: 1 },
      { string: 2, fret: 1, finger: 1 },
      { string: 1, fret: 1, finger: 1 },
    ],
    level: 1,
    color: "#d2b207"
  },
  Cm: {
    pianoNotes: ['C4', 'Eb4', 'G4'],
    guitarPositions: [
      { string: 5, fret: 3, finger: 1 },
      { string: 4, fret: 5, finger: 3 },
      { string: 3, fret: 5, finger: 4 },
      { string: 2, fret: 4, finger: 2 },
      { string: 1, fret: 3, finger: 1 },
    ],
    level: 1,
    color: "#d45a16"
  },
  Gm: {
    pianoNotes: ['G3', 'Bb3', 'D4'],
    guitarPositions: [
      { string: 6, fret: 3, finger: 1 },
      { string: 5, fret: 5, finger: 3 },
      { string: 4, fret: 5, finger: 4 },
      { string: 3, fret: 3, finger: 1 },
      { string: 2, fret: 3, finger: 1 },
      { string: 1, fret: 3, finger: 1 },
    ],
    level: 1,
    color: "#d4442a"
  },

  // Major 7th Chords
  Cmaj7: {
    pianoNotes: ['C4', 'E4', 'G4', 'B4'],
    guitarPositions: [
      { string: 6, fret: 0, finger: 0, muted: true }, // Muted
      { string: 5, fret: 3, finger: 3 }, // C
      { string: 4, fret: 2, finger: 2 }, // E  
      { string: 3, fret: 0, finger: 0 }, // G (open)
      { string: 2, fret: 0, finger: 0 }, // B (open)
      { string: 1, fret: 0, finger: 0 }, // E (open)
    ],
    level: 2,
    color: "#ff9999"
  },

  Gmaj7: {
    pianoNotes: ['G3', 'B3', 'D4', 'F#4'],
    guitarPositions: [
      { string: 6, fret: 3, finger: 3 }, // G
      { string: 5, fret: 2, finger: 2 }, // B
      { string: 4, fret: 0, finger: 0 }, // D (open)
      { string: 3, fret: 0, finger: 0 }, // G (open)
      { string: 2, fret: 0, finger: 0 }, // B (open)
      { string: 1, fret: 2, finger: 1 }, // F#
    ],
    level: 2,
    color: "#99ff99"
  },

  Dmaj7: {
    pianoNotes: ['D4', 'F#4', 'A4', 'C#5'],
    guitarPositions: [
      { string: 6, fret: 0, finger: 0, muted: true }, // Muted
      { string: 5, fret: 0, finger: 0, muted: true }, // Muted
      { string: 4, fret: 0, finger: 0 }, // D (open)
      { string: 3, fret: 2, finger: 2 }, // A
      { string: 2, fret: 2, finger: 3 }, // C#
      { string: 1, fret: 2, finger: 1 }, // F#
    ],
    level: 2,
    color: "#9999ff"
  },

  // Minor 7th Chords
  Am7: {
    pianoNotes: ['A3', 'C4', 'E4', 'G4'],
    guitarPositions: [
      { string: 6, fret: 0, finger: 0, muted: true }, // Muted
      { string: 5, fret: 0, finger: 0 }, // A (open)
      { string: 4, fret: 2, finger: 2 }, // E
      { string: 3, fret: 0, finger: 0 }, // G (open)
      { string: 2, fret: 1, finger: 1 }, // C
      { string: 1, fret: 0, finger: 0 }, // E (open)
    ],
    level: 2,
    color: "#ffcc99"
  },

  Em7: {
    pianoNotes: ['E4', 'G4', 'B4', 'D5'],
    guitarPositions: [
      { string: 6, fret: 0, finger: 0 }, // E (open)
      { string: 5, fret: 2, finger: 2 }, // B
      { string: 4, fret: 0, finger: 0 }, // D (open)
      { string: 3, fret: 0, finger: 0 }, // G (open)
      { string: 2, fret: 0, finger: 0 }, // B (open)
      { string: 1, fret: 0, finger: 0 }, // E (open)
    ],
    level: 2,
    color: "#cc99ff"
  },

  Dm7: {
    pianoNotes: ['D4', 'F4', 'A4', 'C5'],
    guitarPositions: [
      { string: 6, fret: 0, finger: 0, muted: true }, // Muted
      { string: 5, fret: 0, finger: 0, muted: true }, // Muted
      { string: 4, fret: 0, finger: 0 }, // D (open)
      { string: 3, fret: 2, finger: 2 }, // A
      { string: 2, fret: 1, finger: 1 }, // F
      { string: 1, fret: 1, finger: 1 }, // C
    ],
    level: 2,
    color: "#99ccff"
  },

  // Dominant 7th Chords  
  G7: {
    pianoNotes: ['G3', 'B3', 'D4', 'F4'],
    guitarPositions: [
      { string: 6, fret: 3, finger: 3 }, // G
      { string: 5, fret: 2, finger: 2 }, // B
      { string: 4, fret: 0, finger: 0 }, // D (open)
      { string: 3, fret: 0, finger: 0 }, // G (open)
      { string: 2, fret: 0, finger: 0 }, // B (open)
      { string: 1, fret: 1, finger: 1 }, // F
    ],
    level: 2,
    color: "#ffcc66"
  },

  C7: {
    pianoNotes: ['C4', 'E4', 'G4', 'Bb4'],
    guitarPositions: [
      { string: 6, fret: 0, finger: 0, muted: true }, // Muted
      { string: 5, fret: 3, finger: 3 }, // C
      { string: 4, fret: 2, finger: 2 }, // E
      { string: 3, fret: 3, finger: 4 }, // Bb
      { string: 2, fret: 1, finger: 1 }, // F
      { string: 1, fret: 0, finger: 0 }, // E (open)
    ],
    level: 2,
    color: "#ff9966"
  },

  D7: {
    pianoNotes: ['D4', 'F#4', 'A4', 'C5'],
    guitarPositions: [
      { string: 6, fret: 0, finger: 0, muted: true }, // Muted
      { string: 5, fret: 0, finger: 0, muted: true }, // Muted
      { string: 4, fret: 0, finger: 0 }, // D (open)
      { string: 3, fret: 2, finger: 2 }, // A
      { string: 2, fret: 1, finger: 1 }, // C
      { string: 1, fret: 2, finger: 3 }, // F#
    ],
    level: 2,
    color: "#66ccff"
  },
};

export interface Chord extends ChordDefinition {
  name: string;
}

export const chordList: Chord[] = Object.entries(chords).map(
  ([name, data]) => ({
    name,
    ...data,
  })
);

export type ChordName = keyof typeof chords;