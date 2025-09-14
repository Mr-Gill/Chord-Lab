import { describe, it, expect } from 'vitest';
import { getRomanNumeral, getDiatonicChordsWithRomans, isDiatonicChord } from './key-degrees';

describe('getRomanNumeral', () => {
  it('returns correct roman numeral for a chord in a major key', () => {
    expect(getRomanNumeral('F', 'C')).toBe('IV');
  });

  it('returns null for a chord in a minor key', () => {
    expect(getRomanNumeral('Am', 'Am')).toBeNull();
  });

  it('returns null for an unknown key', () => {
    expect(getRomanNumeral('C', 'H')).toBeNull();
  });

  it('returns null for a non-diatonic chord', () => {
    expect(getRomanNumeral('F#m', 'C')).toBeNull();
  });
});

describe('getDiatonicChordsWithRomans', () => {
  it('returns all diatonic chords with roman numerals for a major key', () => {
    expect(getDiatonicChordsWithRomans('C')).toEqual([
      { chord: 'C', roman: 'I' },
      { chord: 'Dm', roman: 'ii' },
      { chord: 'Em', roman: 'iii' },
      { chord: 'F', roman: 'IV' },
      { chord: 'G', roman: 'V' },
      { chord: 'Am', roman: 'vi' },
    ]);
  });

  it('returns an empty array for a minor key', () => {
    expect(getDiatonicChordsWithRomans('Am')).toEqual([]);
  });

  it('returns an empty array for an unknown key', () => {
    expect(getDiatonicChordsWithRomans('H')).toEqual([]);
  });
});

describe('isDiatonicChord', () => {
  it('returns true for a diatonic chord in a major key', () => {
    expect(isDiatonicChord('Am', 'C')).toBe(true);
  });

  it('returns false for a non-diatonic chord', () => {
    expect(isDiatonicChord('F#m', 'C')).toBe(false);
  });

  it('returns false for a minor key', () => {
    expect(isDiatonicChord('Am', 'Am')).toBe(false);
  });

  it('returns false for an unknown key', () => {
    expect(isDiatonicChord('C', 'H')).toBe(false);
  });
});
