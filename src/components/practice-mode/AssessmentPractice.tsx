import { useState, useEffect, useCallback, type FC } from 'react';
import useMetronome from '../../hooks/useMetronome';
import useAudio from '../../hooks/useAudio';
import ChordDisplay from './ChordDisplay';
import { chordList as chords, type Chord } from '../../data/chords';
import { InstrumentPanel } from './InstrumentPanel';
import AssessmentTips from './AssessmentTips';

// Assessment-specific data
const YEAR_7_PROGRESSION = ['C', 'G', 'Am', 'F'];
const YEAR_8_SONGS = [
  { title: 'Where Is The Love', artist: 'Black Eyed Peas', progression: ['C', 'G', 'Am', 'F'], bpm: 116 },
  { title: 'Brown Eyed Girl', artist: 'Van Morrison', progression: ['G', 'C', 'G', 'D'], bpm: 148 },
  { title: 'With or Without You', artist: 'U2', progression: ['D', 'A', 'Bm', 'G'], bpm: 110 },
  { title: 'Beat It', artist: 'Michael Jackson', progression: ['Em', 'D', 'C', 'D'], bpm: 139 }
];

const BACKING_TRACK_STYLES = [
  { name: 'Ballad', bpm: 60, description: 'Slow, gentle, and expressive' },
  { name: 'Slow Swing', bpm: 80, description: 'A relaxed jazz feel with a shuffle rhythm' },
  { name: 'Rock', bpm: 115, description: 'A steady and powerful rock beat' },
  { name: 'Funk', bpm: 140, description: 'Fast and energetic with a strong groove' },
  { name: 'Country', bpm: 180, description: 'Upbeat and bright with a classic country feel' }
];

const getChord = (name: string): Chord | null =>
  chords.find(c => c.name === name) ?? null;

interface AssessmentPracticeProps {
  onClose: () => void;
}

const AssessmentPractice: FC<AssessmentPracticeProps> = ({ onClose }) => {
  const [assessmentType, setAssessmentType] = useState<'year7' | 'year8' | null>(null);
  const [selectedSong, setSelectedSong] = useState<typeof YEAR_8_SONGS[0] | null>(null);
  const [currentChordIndex, setCurrentChordIndex] = useState(0);
  const [selectedInstrument, setSelectedInstrument] = useState<'guitar' | 'piano'>('guitar');
  const [selectedStyle, setSelectedStyle] = useState(BACKING_TRACK_STYLES[0]);
  const [practiceSession, setPracticeSession] = useState<'intro' | 'performance' | 'complete'>('intro');
  const [performanceBars, setPerformanceBars] = useState(0);
  const [{ isPlaying, bpm }, { start, stop, setBpm }] = useMetronome(60, 4);
  const { playChord, fretToNote } = useAudio();

  const progression = assessmentType === 'year7' ? YEAR_7_PROGRESSION : (selectedSong?.progression || []);
  const currentChordName = progression[currentChordIndex];
  const currentChord = currentChordName ? getChord(currentChordName) : null;

  // Update BPM when style or song changes
  useEffect(() => {
    if (assessmentType === 'year7') {
      setBpm(selectedStyle.bpm);
    } else if (selectedSong) {
      setBpm(selectedSong.bpm);
    }
  }, [selectedStyle, selectedSong, assessmentType, setBpm]);

  const toggleMetronome = useCallback(() => {
    if (isPlaying) {
      stop();
      setPracticeSession('intro');
      setPerformanceBars(0);
    } else {
      start();
      if (assessmentType === 'year7') {
        // Start with 8-bar intro for Year 7
        setPracticeSession('intro');
        setTimeout(() => {
          setPracticeSession('performance');
          setPerformanceBars(8); // 8-bar performance section
        }, (60 / bpm) * 1000 * 8); // 8 beats intro
      }
    }
  }, [isPlaying, start, stop, assessmentType, bpm]);

  const nextChord = useCallback(() => {
    setCurrentChordIndex(idx => (idx + 1) % progression.length);
  }, [progression.length]);

  const handleStrum = useCallback(() => {
    if (currentChord) {
      const notes = selectedInstrument === 'piano'
        ? currentChord.pianoNotes
        : currentChord.guitarPositions.map(p => fretToNote(p.string, p.fret));
      playChord(notes, 1, selectedInstrument);
    }
  }, [currentChord, selectedInstrument, playChord, fretToNote]);

  // Auto-advance chords during Year 7 performance
  useEffect(() => {
    if (assessmentType === 'year7' && practiceSession === 'performance' && isPlaying) {
      const interval = (60 / bpm) * 1000 * 4; // Change chord every 4 beats
      const timer = setInterval(nextChord, interval);
      return () => clearInterval(timer);
    }
  }, [assessmentType, practiceSession, isPlaying, bpm, nextChord]);

  if (!assessmentType) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
            🎯 Assessment Practice
          </h2>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300"
          >
            Back
          </button>
        </div>

        <div className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Year 7 Card */}
            <div 
              onClick={() => setAssessmentType('year7')}
              className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/30 border-2 border-blue-200 dark:border-blue-700 rounded-xl p-6 cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105"
            >
              <div className="text-center mb-4">
                <h3 className="text-xl font-bold text-blue-800 dark:text-blue-300 mb-2">
                  📋 Year 7 Assessment
                </h3>
                <p className="text-blue-600 dark:text-blue-400 font-medium">
                  Chord Progression Performance
                </p>
              </div>
              
              <div className="space-y-3 text-sm">
                <div className="bg-white dark:bg-gray-800 rounded-lg p-3">
                  <p className="font-semibold text-gray-800 dark:text-gray-200 mb-2">The Four Chords: C - G - Am - F</p>
                  <p className="text-gray-600 dark:text-gray-400">Practice the I-V-vi-IV progression with backing tracks</p>
                </div>
                
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-blue-100 dark:bg-blue-900/30 rounded p-2">
                    <span className="font-semibold">🎵 Ballad:</span> 60 BPM
                  </div>
                  <div className="bg-blue-100 dark:bg-blue-900/30 rounded p-2">
                    <span className="font-semibold">🎸 Rock:</span> 115 BPM
                  </div>
                  <div className="bg-blue-100 dark:bg-blue-900/30 rounded p-2">
                    <span className="font-semibold">🎷 Swing:</span> 80 BPM
                  </div>
                  <div className="bg-blue-100 dark:bg-blue-900/30 rounded p-2">
                    <span className="font-semibold">🤠 Country:</span> 180 BPM
                  </div>
                </div>
                
                <p className="text-blue-700 dark:text-blue-300 font-medium text-center">
                  ⏱️ 8-bar performance (15-30 seconds)
                </p>
              </div>
            </div>

            {/* Year 8 Card */}
            <div 
              onClick={() => setAssessmentType('year8')}
              className="bg-gradient-to-br from-purple-50 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/30 border-2 border-purple-200 dark:border-purple-700 rounded-xl p-6 cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105"
            >
              <div className="text-center mb-4">
                <h3 className="text-xl font-bold text-purple-800 dark:text-purple-300 mb-2">
                  🎼 Year 8 Assessment
                </h3>
                <p className="text-purple-600 dark:text-purple-400 font-medium">
                  Song Performance with Chords
                </p>
              </div>
              
              <div className="space-y-3 text-sm">
                <div className="bg-white dark:bg-gray-800 rounded-lg p-3">
                  <p className="font-semibold text-gray-800 dark:text-gray-200 mb-2">Choose from popular songs</p>
                  <p className="text-gray-600 dark:text-gray-400">Practice with multiple tempo variations</p>
                </div>
                
                <div className="space-y-1 text-xs">
                  <div className="bg-purple-100 dark:bg-purple-900/30 rounded p-2">
                    <span className="font-semibold">🐢 Slow:</span> 60-80 BPM
                  </div>
                  <div className="bg-purple-100 dark:bg-purple-900/30 rounded p-2">
                    <span className="font-semibold">🚶 Medium:</span> 90-110 BPM
                  </div>
                  <div className="bg-purple-100 dark:bg-purple-900/30 rounded p-2">
                    <span className="font-semibold">🏃 Fast:</span> 120+ BPM
                  </div>
                </div>
                
                <p className="text-purple-700 dark:text-purple-300 font-medium text-center">
                  ⏱️ 30+ second performance
                </p>
              </div>
            </div>
          </div>

          <div className="text-center text-gray-600 dark:text-gray-400">
            <p className="text-sm">
              Choose your assessment type to access specialized practice tools and backing tracks
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (assessmentType === 'year8' && !selectedSong) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-purple-800 dark:text-purple-300">
            🎼 Year 8 Song Selection
          </h2>
          <button
            onClick={() => setAssessmentType(null)}
            className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300"
          >
            Back
          </button>
        </div>

        <div className="space-y-4">
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Choose a song to practice. Each uses a 4-chord progression perfect for your assessment.
          </p>
          
          {YEAR_8_SONGS.map(song => (
            <div
              key={song.title}
              onClick={() => {
                setSelectedSong(song);
                setCurrentChordIndex(0);
              }}
              className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border border-purple-200 dark:border-purple-700 rounded-lg p-4 cursor-pointer hover:shadow-md transition-all duration-300 hover:scale-102"
            >
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-bold text-gray-800 dark:text-gray-200">{song.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400">{song.artist}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-purple-600 dark:text-purple-400 font-medium">{song.bpm} BPM</p>
                  <div className="flex gap-1 mt-1">
                    {song.progression.map((chord, idx) => (
                      <span key={idx} className="text-xs bg-purple-100 dark:bg-purple-900/30 px-2 py-1 rounded">
                        {chord}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
            {assessmentType === 'year7' ? '📋 Year 7 Practice' : '🎼 Year 8 Practice'}
          </h2>
          {assessmentType === 'year7' ? (
            <p className="text-gray-600 dark:text-gray-400">
              C-G-Am-F Progression • {selectedStyle.name} Style • {selectedStyle.bpm} BPM
            </p>
          ) : (
            <p className="text-gray-600 dark:text-gray-400">
              {selectedSong?.title} by {selectedSong?.artist} • {selectedSong?.bpm} BPM
            </p>
          )}
        </div>
        <button
          onClick={() => {
            if (assessmentType === 'year8' && selectedSong) {
              setSelectedSong(null);
            } else {
              setAssessmentType(null);
            }
          }}
          className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300"
        >
          Back
        </button>
      </div>

      {/* Assessment Tips */}
      <AssessmentTips assessmentType={assessmentType} />

      {/* Backing Track Style Selection for Year 7 */}
      {assessmentType === 'year7' && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">
            Choose Your Backing Track Style
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
            {BACKING_TRACK_STYLES.map(style => (
              <button
                key={style.name}
                onClick={() => setSelectedStyle(style)}
                className={`p-3 rounded-lg text-left transition-all duration-300 ${
                  selectedStyle.name === style.name
                    ? 'bg-blue-500 text-white shadow-lg scale-105'
                    : 'bg-gray-100 dark:bg-gray-700 hover:bg-blue-100 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200'
                }`}
              >
                <div className="font-bold text-sm">{style.name}</div>
                <div className="text-xs opacity-80">{style.bpm} BPM</div>
                <div className="text-xs mt-1 opacity-70">{style.description}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Performance Status */}
      {assessmentType === 'year7' && isPlaying && (
        <div className="mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-bold text-blue-800 dark:text-blue-300">
                {practiceSession === 'intro' ? '🎵 8-Bar Introduction' : '🎯 Your Performance!'}
              </h4>
              <p className="text-blue-600 dark:text-blue-400 text-sm">
                {practiceSession === 'intro' 
                  ? 'Listen to the band introduction to get the feel...' 
                  : `Play the C-G-Am-F progression twice (${performanceBars} bars)`}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              {practiceSession === 'performance' && (
                <div className="text-right">
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {Math.max(0, performanceBars)}
                  </div>
                  <div className="text-xs text-blue-500 dark:text-blue-500">bars left</div>
                </div>
              )}
              {/* Visual Metronome */}
              <div className="flex space-x-1">
                {[0, 1, 2, 3].map(beat => (
                  <div
                    key={beat}
                    className={`w-3 h-3 rounded-full transition-all duration-150 ${
                      beat === (Date.now() % (4 * (60 / bpm) * 1000)) / ((60 / bpm) * 1000) | 0
                        ? 'bg-blue-500 scale-125 shadow-lg'
                        : 'bg-gray-300 dark:bg-gray-600'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Current Chord Display */}
      {currentChord && (
        <div className="mb-6">
          <ChordDisplay 
            chord={{
              name: currentChord.name,
              positions: currentChord.guitarPositions || [],
              notes: currentChord.pianoNotes || [],
              level: currentChord.level || 1,
              color: currentChord.color || '#000000'
            }}
            color={currentChord.color}
            instrument={selectedInstrument}
          />
        </div>
      )}

      {/* Progression Display */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">
          {assessmentType === 'year7' ? 'C-G-Am-F Progression (I-V-vi-IV)' : 'Chord Progression'}
        </h3>
        <div className="flex gap-2 flex-wrap">
          {progression.map((chord, idx) => (
            <button
              key={`${chord}-${idx}`}
              onClick={() => setCurrentChordIndex(idx)}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                idx === currentChordIndex
                  ? 'bg-blue-500 text-white shadow-lg scale-110'
                  : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200'
              }`}
            >
              {chord}
              {assessmentType === 'year7' && (
                <div className="text-xs opacity-75 mt-1">
                  {idx === 0 ? 'I' : idx === 1 ? 'V' : idx === 2 ? 'vi' : 'IV'}
                </div>
              )}
            </button>
          ))}
        </div>
        {assessmentType === 'year7' && (
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
            This is the famous "I-V-vi-IV" progression used in thousands of popular songs!
          </p>
        )}
      </div>

      {/* Controls */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          {/* Metronome Controls */}
          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
            <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-3">Practice Controls</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Tempo: {bpm} BPM</span>
                <input
                  type="range"
                  min="40"
                  max="200"
                  value={bpm}
                  onChange={(e) => setBpm(Number(e.target.value))}
                  className="flex-1 mx-3"
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={toggleMetronome}
                  className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                    isPlaying
                      ? 'bg-red-500 hover:bg-red-600 text-white'
                      : 'bg-blue-500 hover:bg-blue-600 text-white'
                  }`}
                >
                  {isPlaying ? 'Stop Practice' : 'Start Practice'}
                </button>
                <button
                  onClick={handleStrum}
                  className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium"
                >
                  Play Chord
                </button>
                <button
                  onClick={nextChord}
                  className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg font-medium"
                >
                  Next Chord
                </button>
              </div>
            </div>
          </div>

          {/* Assessment Tips */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-700 rounded-lg p-4">
            <h4 className="font-bold text-green-800 dark:text-green-300 mb-2">
              🎯 Assessment Success Tips
            </h4>
            <ul className="text-sm text-green-700 dark:text-green-400 space-y-1">
              {assessmentType === 'year7' ? (
                <>
                  <li>• Practice chord changes slowly until smooth</li>
                  <li>• Use the metronome to stay in time</li>
                  <li>• Make sure each chord rings clearly</li>
                  <li>• Try different backing track styles</li>
                </>
              ) : (
                <>
                  <li>• Practice at different tempos (slow → fast)</li>
                  <li>• Add your own creative touches</li>
                  <li>• Focus on smooth chord transitions</li>
                  <li>• Perform with confidence and expression</li>
                </>
              )}
            </ul>
          </div>
        </div>

        <div>
          <InstrumentPanel
            selectedInstrument={selectedInstrument}
            onInstrumentChange={setSelectedInstrument}
          />
        </div>
      </div>
    </div>
  );
};

export default AssessmentPractice;