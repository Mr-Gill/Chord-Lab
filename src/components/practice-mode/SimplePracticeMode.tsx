import { useState, useEffect, useCallback } from 'react';
import type { FC } from 'react';
import { useLocation } from 'react-router-dom';
import type { FretPosition } from '../../types';
import { useAudioContext } from '../../contexts/AudioProvider';
import usePracticeStatistics from '../../hooks/usePracticeStatistics';
import ChordDisplay from './ChordDisplay';
import { chordList as chords, type Chord } from '../../data/chords';
import Statistics from './Statistics';
import ChordWheel from '../chord-wheel/ChordWheel';

// Simple interface focused on the essentials
interface ChordOption {
  name: string;
  positions: FretPosition[];
  notes: string[];
  level?: number;
}

const BEGINNER_CHORDS = ['C', 'G', 'D', 'Am', 'Em', 'F'];
const INTERMEDIATE_CHORDS = ['A', 'E', 'Dm', 'Bb', 'F#', 'Bm'];

function toChordOption(chord: Chord): ChordOption {
  return {
    name: chord.name,
    positions: chord.guitar?.positions[0] || [],
    notes: chord.piano?.notes || [],
    level: chord.level
  };
}

interface SimplePracticeModeProps {
  showAdvanced?: boolean;
  onShowAdvanced?: () => void;
}

const SimplePracticeMode: FC<SimplePracticeModeProps> = ({ 
  showAdvanced = false, 
  onShowAdvanced 
}) => {
  const location = useLocation();
  const { playChord, fretToNote } = useAudioContext();
  const { incrementChordsPlayed, practiceTime } = usePracticeStatistics();
  
  const [currentChord, setCurrentChord] = useState<ChordOption | null>(null);
  const [selectedInstrument, setSelectedInstrument] = useState<'guitar' | 'piano'>('guitar');
  const [chordLevel, setChordLevel] = useState<'beginner' | 'intermediate'>('beginner');
  const [isPlaying, setIsPlaying] = useState(false);
  const [useChordWheel, setUseChordWheel] = useState(false);

  const availableChords = (chordLevel === 'beginner' ? BEGINNER_CHORDS : INTERMEDIATE_CHORDS)
    .map(name => chords.find(c => c.name === name))
    .filter((chord): chord is Chord => chord !== undefined)
    .map(toChordOption);

  // Initialize with first chord
  useEffect(() => {
    if (!currentChord && availableChords.length > 0) {
      setCurrentChord(availableChords[0]);
    }
  }, [availableChords, currentChord]);

  // Handle URL parameters
  useEffect(() => {
    const sp = new URLSearchParams(location.search);
    const chordParam = sp.get('chord');
    
    if (chordParam) {
      const target = chords.find(c => c.name.toLowerCase() === chordParam.toLowerCase());
      if (target) {
        setCurrentChord(toChordOption(target));
      }
    }
  }, [location.search]);

  const handleStrum = useCallback(() => {
    if (currentChord) {
      const notes = selectedInstrument === 'piano'
        ? currentChord.notes
        : currentChord.positions.map((p: FretPosition) => fretToNote(p.string, p.fret));
      playChord(notes, 1, selectedInstrument);
      setIsPlaying(true);
      setTimeout(() => setIsPlaying(false), 500);
      incrementChordsPlayed();
    }
  }, [currentChord, selectedInstrument, fretToNote, playChord, incrementChordsPlayed]);

  const nextChord = useCallback(() => {
    if (availableChords.length === 0) return;
    const randomIndex = Math.floor(Math.random() * availableChords.length);
    const next = availableChords[randomIndex];
    if (next) setCurrentChord(next);
  }, [availableChords]);

  const selectChord = (chordName: string) => {
    const chord = availableChords.find(c => c.name === chordName);
    if (chord) setCurrentChord(chord);
  };

  const handleChordWheelSelect = (chordName: string) => {
    selectChord(chordName);
  };

  if (!currentChord) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading chords...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-3xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-emerald-600 bg-clip-text text-transparent">
          🎸 Let's Practice!
        </h2>
        {onShowAdvanced && (
          <button
            onClick={onShowAdvanced}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-500 to-blue-600 text-white font-semibold hover:shadow-lg transition-all duration-300"
          >
            🔧 More Options
          </button>
        )}
      </div>

      {/* Skill Level Toggle */}
      <div className="flex justify-center mb-8">
        <div className="flex bg-gray-100 dark:bg-gray-700 rounded-2xl p-2">
          <button
            onClick={() => setChordLevel('beginner')}
            className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
              chordLevel === 'beginner'
                ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg'
                : 'text-gray-600 dark:text-gray-400 hover:text-green-600'
            }`}
          >
            🌱 Beginner
          </button>
          <button
            onClick={() => setChordLevel('intermediate')}
            className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
              chordLevel === 'intermediate'
                ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                : 'text-gray-600 dark:text-gray-400 hover:text-blue-600'
            }`}
          >
            🚀 Intermediate
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Main Chord Display */}
        <div className="space-y-6">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-2">
              {currentChord.name}
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Practice this chord until it feels natural
            </p>
          </div>

          <ChordDisplay
            chord={currentChord}
            selectedInstrument={selectedInstrument}
          />

          {/* Instrument Toggle */}
          <div className="flex justify-center">
            <div className="flex bg-gray-100 dark:bg-gray-700 rounded-2xl p-2">
              <button
                onClick={() => setSelectedInstrument('guitar')}
                className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center gap-2 ${
                  selectedInstrument === 'guitar'
                    ? 'bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-lg'
                    : 'text-gray-600 dark:text-gray-400 hover:text-orange-600'
                }`}
              >
                🎸 Guitar
              </button>
              <button
                onClick={() => setSelectedInstrument('piano')}
                className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center gap-2 ${
                  selectedInstrument === 'piano'
                    ? 'bg-gradient-to-r from-purple-500 to-blue-600 text-white shadow-lg'
                    : 'text-gray-600 dark:text-gray-400 hover:text-purple-600'
                }`}
              >
                🎹 Piano
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center gap-4">
            <button
              onClick={handleStrum}
              className={`px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 transform hover:scale-105 ${
                isPlaying
                  ? 'bg-gradient-to-r from-green-400 to-emerald-500 text-white shadow-xl'
                  : 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg hover:shadow-xl'
              }`}
            >
              {isPlaying ? '🎵 Playing!' : '🎵 Play Chord'}
            </button>
            <button
              onClick={nextChord}
              className="px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-green-600 text-white font-bold text-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              🎲 Random Chord
            </button>
          </div>
        </div>

        {/* Chord Selection & Stats */}
        <div className="space-y-6">
          {/* Quick Chord Selection */}
          <div>
            <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
              🎯 {chordLevel === 'beginner' ? 'Essential' : 'Intermediate'} Chords
            </h4>
            <div className="grid grid-cols-3 gap-3">
              {availableChords.map((chord) => (
                <button
                  key={chord.name}
                  onClick={() => selectChord(chord.name)}
                  className={`p-3 rounded-xl font-semibold transition-all duration-300 ${
                    currentChord?.name === chord.name
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg transform scale-105'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  {chord.name}
                </button>
              ))}
            </div>
          </div>

          {/* Practice Statistics */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl p-6">
            <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4 text-center">
              📊 Your Progress
            </h4>
            <Statistics 
              practiceTime={practiceTime}
              showSimple={true}
            />
          </div>

          {/* Encouragement */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl p-6 text-center">
            <h4 className="text-lg font-semibold text-green-800 dark:text-green-200 mb-2">
              💡 Keep Going!
            </h4>
            <p className="text-sm text-green-700 dark:text-green-300">
              Practice makes perfect. Try to switch between chords smoothly.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimplePracticeMode;