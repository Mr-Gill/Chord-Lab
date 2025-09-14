import { useState, useEffect, useCallback, useRef } from 'react';
import type { FC } from 'react';
import { useLocation } from 'react-router-dom';
import type { FretPosition } from '../../types';
import { getChordTheme } from '../../utils/diagramTheme';
import useMetronome from '../../hooks/useMetronome';
import { useAchievements } from '../../contexts/AchievementContext';
import useAudio from '../../hooks/useAudio';
import usePracticeStatistics from '../../hooks/usePracticeStatistics';
import ChallengeMode from './ChallengeMode';
import Statistics from './Statistics';
import PracticeMetronomeControls from './PracticeMetronomeControls';
import { InstrumentPanel } from './InstrumentPanel';
import ChordDisplay from './ChordDisplay';
import { chordList as chords, type Chord } from '../../data/chords';
import SongPractice from './SongPractice';
import AssessmentPractice from './AssessmentPractice';
import { useHighestUnlockedLevel } from '../learning-path/LearningPathway';
import ChordWheel from '../chord-wheel/ChordWheel';
import { ChordBuilderProvider } from '../../contexts/ChordBuilderContext';

const MAJORS_ORDER = ['C', 'G', 'D', 'A', 'E', 'B', 'F#', 'Db', 'Ab', 'Eb', 'Bb', 'F'] as const;
type MajorKey = (typeof MAJORS_ORDER)[number];

const RELATIVE_MINORS: Record<MajorKey, string> = {
    C: 'Am',
    G: 'Em',
    D: 'Bm',
    A: 'F#m',
    E: 'C#m',
    B: 'G#m',
    'F#': 'D#m',
    Db: 'Bbm',
    Ab: 'Fm',
    Eb: 'Cm',
    Bb: 'Gm',
    F: 'Dm',
};

function getDiatonicForKey(keyCenter: MajorKey) {
    const idx = MAJORS_ORDER.indexOf(keyCenter);
    if (idx === -1) return { majors: [], minors: [] };
    const I = MAJORS_ORDER[idx];
    const V = MAJORS_ORDER[(idx + 1) % 12];
    const IV = MAJORS_ORDER[(idx + 11) % 12];
    const majors = [I, IV, V];
    const minors = [RELATIVE_MINORS[I], RELATIVE_MINORS[V], RELATIVE_MINORS[IV]];
    return { majors, minors };
}

interface ChordOption {
  name: string;
  positions: FretPosition[];
  notes: string[];
  level: number;
  color: string;
}

const toChordOption = (chord: Chord): ChordOption => ({
  name: chord.name,
  positions: chord.guitarPositions ?? [],
  notes: chord.pianoNotes ?? [],
  level: chord.level ?? 1,
  color: chord.color ?? '#000000'
});

const PracticeMode: FC = () => {
    const [beginnerMode, setBeginnerMode] = useState(false);
    const highestUnlockedLevel = useHighestUnlockedLevel();
    const [availableChords, setAvailableChords] = useState<Chord[]>([]);
    useEffect(() => {
        setAvailableChords(chords.filter(c => (c.level ?? 1) <= highestUnlockedLevel));
    }, [highestUnlockedLevel]);
    const [selectedInstrument, setSelectedInstrument] =
        useState<'guitar' | 'piano'>('guitar');
    const [currentChord, setCurrentChord] = useState<ChordOption>(toChordOption(chords[0]));
    const [selectedChords, setSelectedChords] = useState<ChordOption[]>([]);
    const [currentChordIndex, setCurrentChordIndex] = useState(0);
    const [showSongPractice, setShowSongPractice] = useState(false);
    const [showAssessmentPractice, setShowAssessmentPractice] = useState(false);
    const { unlockAchievement } = useAchievements();
    const [{ isPlaying, bpm }, { start, stop, setBpm }] = useMetronome(60, 4);
    const practicedChordsRef = useRef<Set<string>>(new Set());
    const {
        totalPracticeTime,
        chordsPlayed,
        currentStreak,
        bestChallengeTime,
        isChallengeActive,
        challengeTime,
        startPracticeSession,
        stopPracticeSession,
        incrementChordsPlayed,
        incrementUniqueChord,
        resetStreak,
        startChallenge,
        stopChallenge,
    } = usePracticeStatistics();
    const [showTips, setShowTips] = useState<boolean>(true);
    const location = useLocation();
    const [keyCenter, setKeyCenter] = useState<MajorKey | null>(null);
    const { playChord, fretToNote, guitarLoaded } = useAudio();
    const [activeTab, setActiveTab] = useState<'practice' | 'chords' | 'wheel'>('practice');

    useEffect(() => {
        if (currentChord && (currentChord.level ?? 1) > highestUnlockedLevel) {
            setCurrentChord(toChordOption(chords[0]));
        }
        if (!currentChord && availableChords.length > 0) {
            setCurrentChord(toChordOption(availableChords[0]));
        }
    }, [highestUnlockedLevel, availableChords, currentChord]);

    useEffect(() => {
        const sp = new URLSearchParams(location.search);
        const keyParam = sp.get('key');
        const chordParam = sp.get('chord');
        const chordsParam = sp.get('chords'); // New: comma-separated chord list
        
        if (keyParam && (MAJORS_ORDER as readonly string[]).includes(keyParam)) {
            setKeyCenter(keyParam as MajorKey);
        }
        
        // Handle multiple chords (from chord selection interface)
        if (chordsParam) {
            const chordNames = chordsParam.split(',').filter(name => name.trim());
            const foundChords = chordNames
                .map(name => availableChords.find(c => c.name.toLowerCase() === name.trim().toLowerCase()))
                .filter((chord): chord is Chord => chord !== undefined)
                .map(toChordOption);
            
            if (foundChords.length > 0) {
                setSelectedChords(foundChords);
                setCurrentChord(foundChords[0]);
                setCurrentChordIndex(0);
            }
        }
        // Handle single chord
        else if (chordParam) {
            const target = availableChords.find(
                c => c.name.toLowerCase() === chordParam.toLowerCase()
            );
            if (target) {
                setCurrentChord(toChordOption(target));
                setSelectedChords([toChordOption(target)]);
                setCurrentChordIndex(0);
            }
        }
        
        if (!chordParam && !chordsParam && availableChords.length > 0 && !currentChord) {
            setCurrentChord(toChordOption(availableChords[0]));
            setSelectedChords([]);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [location.search, availableChords]);

    useEffect(() => {
        if (currentChord) {
            const practicedChords = practicedChordsRef.current;
            if (!practicedChords.has(currentChord.name)) {
                practicedChords.add(currentChord.name);
                incrementUniqueChord();

                if (practicedChords.size === 1) {
                    unlockAchievement('FIRST_CHORD');
                }
                if (practicedChords.size === 5) {
                    unlockAchievement('CHORD_NOVICE');
                }
                if (practicedChords.size === 10) {
                    unlockAchievement('CHORD_APPRENTICE');
                }
            }
        }
    }, [currentChord, unlockAchievement, incrementUniqueChord]);

    const handleStrum = useCallback(() => {
        if (currentChord) {
            const notes =
                selectedInstrument === 'piano'
                    ? currentChord.notes
                    : currentChord.positions.map((p: FretPosition) => fretToNote(p.string, p.fret));
            playChord(notes, 1, selectedInstrument);
        }
    }, [currentChord, selectedInstrument, fretToNote, playChord]);

    const nextChord = useCallback(() => {
        incrementChordsPlayed();
        if (availableChords.length === 0) return;
        const randomIndex = Math.floor(Math.random() * availableChords.length);
        const next = availableChords[randomIndex];
        if (next) setCurrentChord(toChordOption(next));
    }, [incrementChordsPlayed, availableChords]);

    const toggleMetronome = () => {
        if (isPlaying) {
            stop();
            stopPracticeSession();
            resetStreak();
        } else {
            start();
            startPracticeSession();
        }
    };

    const [diatonicChips, setDiatonicChips] = useState<{
        label: string;
        available: boolean;
        locked: boolean;
        color: { primary: string; background: string };
    }[]>([]);

    useEffect(() => {
        if (!keyCenter) {
            setDiatonicChips([]);
            return;
        }
        const { majors, minors } = getDiatonicForKey(keyCenter);
        const list: string[] = [...majors, ...minors];
        setDiatonicChips(
            list.map((label: string) => {
                const chord = chords.find((c: Chord) => c.name === label);
                const available = !!chord && (chord.level ?? 1) <= highestUnlockedLevel;
                return {
                    label,
                    available,
                    locked: !!chord && (chord.level ?? 1) > highestUnlockedLevel,
                    color: getChordTheme(label)
                };
            })
        );
    }, [keyCenter, highestUnlockedLevel]);

    const handleChordSelect = (chordName: string) => {
        const target = availableChords.find(
            c => c.name.toLowerCase() === chordName.toLowerCase()
        );
        if (target) setCurrentChord(toChordOption(target));
    };

    if (showSongPractice) {
        return <SongPractice onClose={() => setShowSongPractice(false)} />;
    }

    if (showAssessmentPractice) {
        return <AssessmentPractice onClose={() => setShowAssessmentPractice(false)} />;
    }

    return (
        <ChordBuilderProvider>
            <div className="w-full bg-white/80 dark:bg-gray-800/70 backdrop-blur-sm rounded-3xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 p-8">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-emerald-600 bg-clip-text text-transparent">
                        🎵 Practice Mode
                    </h2>
                    <button
                        onClick={() => setBeginnerMode(!beginnerMode)}
                        className={`px-6 py-3 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 ${
                            beginnerMode 
                                ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg hover:shadow-xl' 
                                : 'bg-gradient-to-r from-purple-500 to-blue-600 text-white shadow-lg hover:shadow-xl'
                        }`}
                        data-testid="beginner-mode-toggle"
                    >
                        {beginnerMode ? '🚀 More Options' : '🌟 Beginner Mode'}
                    </button>
                </div>
                
                <div className="flex justify-center items-center mb-8 bg-gray-100/50 dark:bg-gray-700/30 rounded-2xl p-2">
                    <button 
                        onClick={() => setActiveTab('practice')}
                        className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                            activeTab === 'practice' 
                                ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg transform scale-105' 
                                : 'text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-white/50 dark:hover:bg-gray-600/50'
                        }`}
                    >
                        🎸 Practice
                    </button>
                    <button 
                        onClick={() => setActiveTab('chords')}
                        className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                            activeTab === 'chords' 
                                ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg transform scale-105' 
                                : 'text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-white/50 dark:hover:bg-gray-600/50'
                        }`}
                    >
                        🎼 Chords
                    </button>
                    <button 
                        onClick={() => setActiveTab('wheel')}
                        className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                            activeTab === 'wheel' 
                                ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg transform scale-105' 
                                : 'text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-white/50 dark:hover:bg-gray-600/50'
                        }`}
                    >
                        🎡 Chord Wheel
                    </button>
                </div>
                {activeTab === 'practice' && (
                    <div>
                        {!beginnerMode && keyCenter && (
                            <div className="mb-6 p-6 rounded-2xl border border-gray-200/70 dark:border-gray-600/50 bg-gradient-to-r from-blue-50/80 to-purple-50/80 dark:from-blue-900/20 dark:to-purple-900/20 backdrop-blur-sm shadow-lg">
                                <div className="flex items-center justify-between flex-wrap gap-3">
                                    <div className="text-gray-800 dark:text-gray-200 font-bold text-lg">
                                        🎹 Key: {keyCenter} major
                                    </div>
                                    <div className="text-sm text-gray-600 dark:text-gray-400 bg-white/50 dark:bg-gray-700/50 px-3 py-1 rounded-full">
                                        💡 Perfect chords for this key
                                    </div>
                                </div>
                                <div data-testid="diatonic-chords" className="mt-4 flex flex-wrap gap-3">
                                    {diatonicChips.map(
                                        ({
                                            label,
                                            available,
                                            locked,
                                            color,
                                        }: {
                                            label: string;
                                            available: boolean;
                                            locked: boolean;
                                            color: { primary: string; background: string };
                                        }) => (
                                            <button
                                                key={label}
                                                onClick={() => {
                                                    if (!available) return;
                                                    const c = chords.find((c: Chord) => c.name === label);
                                                    if (c) setCurrentChord(toChordOption(c));
                                                }}
                                                disabled={!available}
                                                className={`px-4 py-2 rounded-xl text-sm font-bold relative transition-all duration-300 transform hover:scale-110 ${
                                                    available
                                                        ? 'text-white shadow-lg hover:shadow-xl'
                                                        : 'text-gray-800 dark:text-gray-300 cursor-not-allowed opacity-60'
                                                }`}
                                                style={{
                                                    background: available ? color.primary : color.background,
                                                    border: `2px solid ${color.primary}`,
                                                }}
                                                title={
                                                    available
                                                        ? `Practice ${label}`
                                                        : locked
                                                        ? 'Locked: finish previous levels'
                                                        : 'Diagram coming soon'
                                                }
                                            >
                                                {label}
                                                {locked && (
                                                    <span className="ml-1 text-[10px] bg-red-500 text-white px-2 py-0.5 rounded-full">
                                                        🔒
                                                    </span>
                                                )}
                                            </button>
                                        )
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Chord Progression Controls */}
                        {selectedChords.length > 1 && (
                            <div className="mb-6 p-6 rounded-2xl border border-gray-200/70 dark:border-gray-600/50 bg-gradient-to-r from-purple-50/80 to-pink-50/80 dark:from-purple-900/20 dark:to-pink-900/20 backdrop-blur-sm shadow-lg">
                                <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
                                    <div className="text-gray-800 dark:text-gray-200 font-bold text-lg">
                                        🎵 Chord Progression Practice
                                    </div>
                                    <div className="text-sm text-gray-600 dark:text-gray-400 bg-white/50 dark:bg-gray-700/50 px-3 py-1 rounded-full">
                                        {currentChordIndex + 1} of {selectedChords.length}
                                    </div>
                                </div>
                                <div className="flex flex-wrap gap-3 mb-4">
                                    {selectedChords.map((chord, index) => {
                                        const theme = getChordTheme(chord.name);
                                        const isCurrent = index === currentChordIndex;
                                        return (
                                            <button
                                                key={`${chord.name}-${index}`}
                                                onClick={() => {
                                                    setCurrentChord(chord);
                                                    setCurrentChordIndex(index);
                                                }}
                                                className={`px-4 py-2 rounded-xl text-sm font-bold transition-all duration-300 transform hover:scale-110 ${
                                                    isCurrent
                                                        ? 'text-white shadow-xl ring-2 ring-white'
                                                        : 'text-white shadow-lg hover:shadow-xl opacity-70 hover:opacity-100'
                                                }`}
                                                style={{
                                                    background: theme.primary,
                                                    border: `2px solid ${theme.primary}`,
                                                }}
                                            >
                                                {index + 1}. {chord.name}
                                            </button>
                                        );
                                    })}
                                </div>
                                <div className="flex gap-3">
                                    <button
                                        onClick={() => {
                                            const prevIndex = currentChordIndex > 0 ? currentChordIndex - 1 : selectedChords.length - 1;
                                            setCurrentChord(selectedChords[prevIndex]);
                                            setCurrentChordIndex(prevIndex);
                                        }}
                                        className="px-4 py-2 rounded-xl bg-gray-500 hover:bg-gray-600 text-white font-semibold transition-all duration-300"
                                    >
                                        ← Previous
                                    </button>
                                    <button
                                        onClick={() => {
                                            const nextIndex = currentChordIndex < selectedChords.length - 1 ? currentChordIndex + 1 : 0;
                                            setCurrentChord(selectedChords[nextIndex]);
                                            setCurrentChordIndex(nextIndex);
                                        }}
                                        className="px-4 py-2 rounded-xl bg-blue-500 hover:bg-blue-600 text-white font-semibold transition-all duration-300"
                                    >
                                        Next →
                                    </button>
                                    <button
                                        onClick={() => {
                                            // Play progression sequence
                                            selectedChords.forEach((chord, index) => {
                                                setTimeout(() => {
                                                    setCurrentChord(chord);
                                                    setCurrentChordIndex(index);
                                                    if (selectedInstrument === 'guitar' && chord.positions.length > 0) {
                                                        const notes = chord.positions.map(pos => fretToNote(pos.string, pos.fret));
                                                        playChord(notes, 0.8);
                                                    } else if (selectedInstrument === 'piano' && chord.notes.length > 0) {
                                                        playChord(chord.notes, 0.8);
                                                    }
                                                }, index * 1000);
                                            });
                                        }}
                                        className="px-4 py-2 rounded-xl bg-green-500 hover:bg-green-600 text-white font-semibold transition-all duration-300"
                                    >
                                        ▶ Play Progression
                                    </button>
                                </div>
                            </div>
                        )}

                        {!beginnerMode && (
                            <div className="mb-8 p-6 bg-gradient-to-r from-gray-50/80 to-blue-50/80 dark:from-gray-700/30 dark:to-gray-800/30 rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-600/50">
                                <div className="flex flex-wrap gap-6">
                                    <div className="flex flex-col items-center">
                                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                                            💡 Tips
                                        </label>
                                        <button
                                            onClick={() => setShowTips(!showTips)}
                                            className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 ${
                                                showTips 
                                                    ? 'bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-lg hover:shadow-xl' 
                                                    : 'bg-gray-200 dark:bg-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-500'
                                            }`}
                                        >
                                            {showTips ? '✅ On' : '❌ Off'}
                                        </button>
                                    </div>
                                    <div className="flex flex-col items-center">
                                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                                            🎯 Assessment Practice
                                        </label>
                                        <button
                                            onClick={() => setShowAssessmentPractice(true)}
                                            className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-teal-600 text-white font-semibold hover:from-blue-600 hover:to-teal-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                                        >
                                            📋 Year 7 & 8
                                        </button>
                                    </div>
                                    <div className="flex flex-col items-center">
                                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                                            🎵 Song Practice
                                        </label>
                                        <button
                                            onClick={() => setShowSongPractice(true)}
                                            className="px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold hover:from-indigo-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                                        >
                                            🎼 Choose Song
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {currentChord && (
                            <div className="mb-6">
                                <div className="flex justify-between items-center mb-4">
                                    <ChordDisplay 
                                      chord={currentChord}
                                      color={currentChord.color}
                                      instrument={selectedInstrument} 
                                    />
                                    <PracticeMetronomeControls
                                        isPlaying={isPlaying}
                                        bpm={bpm}
                                        setBpm={setBpm}
                                        toggleMetronome={toggleMetronome}
                                        handleStrum={handleStrum}
                                        nextChord={nextChord}
                                        beginnerMode={beginnerMode}
                                        disableStrum={selectedInstrument === 'guitar' && !guitarLoaded}
                                    />
                                </div>

                                {!beginnerMode && (
                                    <ChallengeMode
                                        isChallengeActive={isChallengeActive}
                                        startChallenge={startChallenge}
                                        stopChallenge={stopChallenge}
                                        challengeTime={challengeTime}
                                        bestChallengeTime={bestChallengeTime}
                                    />
                                )}

                                <InstrumentPanel
                                    selectedInstrument={selectedInstrument}
                                    onInstrumentChange={setSelectedInstrument}
                                    beginnerMode={beginnerMode}
                                />

                                {selectedInstrument === 'guitar' && !guitarLoaded && (
                                    <p className="text-gray-500 text-sm mt-2">Loading sounds...</p>
                                )}

                                {showTips && (
                                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-l-4 border-blue-500 p-6 rounded-2xl shadow-lg backdrop-blur-sm border border-blue-200/50 dark:border-blue-700/50">
                                        <h4 className="font-bold text-blue-800 dark:text-blue-300 mb-3 text-lg flex items-center">
                                            💡 Practice Tip
                                        </h4>
                                        <p className="text-blue-700 dark:text-blue-400 text-base leading-relaxed">
                                            Practice this chord slowly at first, focusing on clean fingering. Make sure each note
                                            rings clearly without any buzzing. 🎯
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}

                        {!beginnerMode && (
                            <div className="mt-8 pt-6 border-t border-gray-200/70 dark:border-gray-600/50">
                                <h4 className="font-bold text-gray-800 dark:text-gray-100 mb-4 text-xl flex items-center">
                                    🎸 Other Chords to Practice
                                </h4>
                                <div data-testid="other-chords" className="flex flex-wrap gap-3">
                                    {availableChords
                                        .filter((chord: Chord) => chord.name !== currentChord?.name)
                                        .map((chord: Chord) => {
                                            const locked = (chord.level ?? 1) > highestUnlockedLevel;
                                            return (
                                                <button
                                                    key={chord.name}
                                                    onClick={() => {
                                                        if (!locked) setCurrentChord(toChordOption(chord));
                                                    }}
                                                    disabled={locked}
                                                    className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 ${
                                                        locked
                                                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-gray-700 dark:text-gray-500'
                                                            : 'bg-gradient-to-r from-gray-100 to-gray-200 hover:from-blue-100 hover:to-purple-100 text-gray-800 dark:from-gray-700 dark:to-gray-600 dark:hover:from-gray-600 dark:hover:to-gray-500 dark:text-gray-200 shadow-md hover:shadow-lg'
                                                    }`}
                                                >
                                                    {chord.name}
                                                    {locked && (
                                                        <span className="ml-2 text-xs bg-red-500 text-white px-2 py-0.5 rounded-full">
                                                            🔒
                                                        </span>
                                                    )}
                                                </button>
                                            );
                                        })}
                                </div>
                            </div>
                        )}
                        {!beginnerMode && (
                            <Statistics
                                totalPracticeTime={totalPracticeTime}
                                chordsPlayed={chordsPlayed}
                                currentStreak={currentStreak}
                                bestChallengeTime={bestChallengeTime}
                            />
                        )}
                    </div>
                )}
                {activeTab === 'chords' && (
                    <div className="space-y-6">
                        <h4 className="font-bold text-gray-800 dark:text-gray-100 mb-6 text-2xl flex items-center">
                            🎼 Available Chords
                        </h4>
                        <div data-testid="other-chords" className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                            {availableChords
                                .filter((chord: Chord) => chord.name !== currentChord?.name)
                                .map((chord: Chord) => {
                                    const locked = (chord.level ?? 1) > highestUnlockedLevel;
                                    return (
                                        <button
                                            key={chord.name}
                                            onClick={() => {
                                                if (!locked) setCurrentChord(toChordOption(chord));
                                            }}
                                            disabled={locked}
                                            className={`group px-4 py-6 rounded-2xl font-bold transition-all duration-300 transform hover:scale-105 text-center ${
                                                locked
                                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-gray-700 dark:text-gray-500'
                                                    : 'bg-gradient-to-br from-white to-gray-50 hover:from-blue-50 hover:to-purple-50 text-gray-800 dark:from-gray-700 dark:to-gray-600 dark:hover:from-gray-600 dark:hover:to-gray-500 dark:text-gray-200 shadow-lg hover:shadow-xl border border-gray-200/50 dark:border-gray-600/50'
                                            }`}
                                        >
                                            <div className="text-2xl mb-2 group-hover:scale-110 transition-transform duration-300">
                                                {chord.name}
                                            </div>
                                            {locked && (
                                                <div className="text-xs bg-red-500 text-white px-2 py-1 rounded-full">
                                                    🔒 Locked
                                                </div>
                                            )}
                                        </button>
                                    );
                                })}
                        </div>
                    </div>
                )}
                {activeTab === 'wheel' && (
                    <div className="wheel-container">
                        <ChordWheel 
                            chords={currentChord ? [currentChord.name] : ['C', 'G', 'Am', 'F']} 
                            onChordSelect={handleChordSelect}
                        />
                    </div>
                )}
            </div>
        </ChordBuilderProvider>
    );
};

export default PracticeMode;