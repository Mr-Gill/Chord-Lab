// Key degrees mapping with roman numerals for harmonic analysis
// Based on the original Ultimate Chord App design

export interface KeyDegrees {
  I: string;
  ii: string;
  iii: string;
  IV: string;
  V: string;
  vi: string;
  vii?: string;
  bVII?: string;
}

export const KEY_DEGREES: Record<string, KeyDegrees> = {
  "C": { I: "C", ii: "Dm", iii: "Em", IV: "F", V: "G", vi: "Am", vii: "Bdim" },
  "G": { I: "G", ii: "Am", iii: "Bm", IV: "C", V: "D", vi: "Em", vii: "F#dim" },
  "D": { I: "D", ii: "Em", iii: "F#m", IV: "G", V: "A", vi: "Bm", vii: "C#dim" },
  "A": { I: "A", ii: "Bm", iii: "C#m", IV: "D", V: "E", vi: "F#m", vii: "G#dim" },
  "E": { I: "E", ii: "F#m", iii: "G#m", IV: "A", V: "B", vi: "C#m", vii: "D#dim" },
  "B": { I: "B", ii: "C#m", iii: "D#m", IV: "E", V: "F#", vi: "G#m", vii: "A#dim" },
  "F#": { I: "F#", ii: "G#m", iii: "A#m", IV: "B", V: "C#", vi: "D#m", vii: "E#dim" },
  "Db": { I: "Db", ii: "Ebm", iii: "Fm", IV: "Gb", V: "Ab", vi: "Bbm", vii: "Cdim" },
  "Ab": { I: "Ab", ii: "Bbm", iii: "Cm", IV: "Db", V: "Eb", vi: "Fm", vii: "Gdim" },
  "Eb": { I: "Eb", ii: "Fm", iii: "Gm", IV: "Ab", V: "Bb", vi: "Cm", vii: "Ddim" },
  "Bb": { I: "Bb", ii: "Cm", iii: "Dm", IV: "Eb", V: "F", vi: "Gm", vii: "Adim" },
  "F": { I: "F", ii: "Gm", iii: "Am", IV: "Bb", V: "C", vi: "Dm", vii: "Edim" }
};

// Function to get roman numeral for a chord in a given key
export function getRomanNumeral(chord: string, key: string): string | null {
  const keyDegrees = KEY_DEGREES[key];
  if (!keyDegrees) return null;
  
  // Create inverse mapping from chord name to roman numeral
  const chordToRoman: Record<string, string> = {};
  Object.entries(keyDegrees).forEach(([roman, chordName]) => {
    chordToRoman[chordName] = roman;
  });
  
  return chordToRoman[chord] || null;
}

// Function to get diatonic chords with roman numerals for a key
export function getDiatonicChordsWithRomans(key: string): Array<{ chord: string, roman: string }> {
  const keyDegrees = KEY_DEGREES[key];
  if (!keyDegrees) return [];
  
  return Object.entries(keyDegrees)
    .filter(([roman]) => roman !== 'vii') // Skip diminished for now
    .map(([roman, chord]) => ({ chord, roman }));
}

// Check if a chord is diatonic in the given key
export function isDiatonicChord(chord: string, key: string): boolean {
  const keyDegrees = KEY_DEGREES[key];
  if (!keyDegrees) return false;
  
  return Object.values(keyDegrees).includes(chord);
}

// Get chord function (tonic, predominant, dominant)
export const CHORD_FUNCTIONS: Record<string, string> = {
  "I": "tonic", "i": "tonic",
  "ii": "predominant", "ii°": "predominant", "II": "predominant",
  "iii": "tonic", "III": "tonic", "bIII": "predominant",
  "IV": "predominant", "iv": "predominant",
  "V": "dominant", "v": "dominant", "V7": "dominant",
  "vi": "tonic", "VI": "predominant", "bVI": "predominant",
  "vii°": "dominant", "VII": "substitute", "bVII": "substitute"
};

export function getChordFunction(roman: string): string {
  return CHORD_FUNCTIONS[roman] || 'unknown';
}