import { useState, useEffect, type FC, useCallback } from 'react';
import songs, { type Song } from '../../data/songs';
import useMetronome from '../../hooks/useMetronome';
import { useAudioContext } from '../../contexts/AudioProvider';
import PracticeMetronomeControls from './PracticeMetronomeControls';
import { InstrumentPanel } from './InstrumentPanel';
import { chordList as chords, type Chord } from '../../data/chords';

const getChord = (name: string): Chord | null =>
    chords.find(c => c.name === name) ?? null;

const supportedSongs = songs.filter(song =>
    song.progression.every(ch => getChord(ch) !== null),
);

interface SongPracticeProps {
    onClose: () => void;
}

const SongPractice: FC<SongPracticeProps> = ({ onClose }) => {
    const [selectedSong, setSelectedSong] = useState<Song | null>(null);
    const [currentChordIndex, setCurrentChordIndex] = useState(0);
    const [selectedInstrument, setSelectedInstrument] =
        useState<'guitar' | 'piano'>('guitar');
    const [message, setMessage] = useState<string | null>(null);
    const [{ isPlaying, bpm }, { start, stop, setBpm }] = useMetronome(60, 4);
    const { playChord, fretToNote } = useAudioContext();

    const chordName: string | null =
        selectedSong?.progression[currentChordIndex] ?? null;
    const currentChord: Chord | null =
        chordName ? getChord(chordName) ?? null : null;

    useEffect(() => {
        if (selectedSong) {
            setBpm(selectedSong.bpm);
        }
    }, [selectedSong, setBpm]);

    const toggleMetronome = () => {
        if (isPlaying) {
            stop();
        } else {
            start();
        }
    };

    const nextChord = useCallback(() => {
        if (!selectedSong) return;
        setCurrentChordIndex(idx =>
            (idx + 1) % selectedSong.progression.length,
        );
    }, [selectedSong]);

    useEffect(() => {
        if (chordName && !currentChord) {
            setMessage(`Unsupported chord: ${chordName}. Skipping.`);
            nextChord();
        } else {
            setMessage(null);
        }
    }, [chordName, currentChord, nextChord]);

    const handleStrum = () => {
        if (currentChord) {
            const notes =
                selectedInstrument === 'piano'
                    ? currentChord.pianoNotes
                    : currentChord.guitarPositions.map(p => fretToNote(p.string, p.fret));
            playChord(notes, 1, selectedInstrument);
        }
    };

    return (
        <div className="bg-white dark:bg-gray-800/50 rounded-xl shadow-lg p-6">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                    Song Practice
                </h2>
                <button
                    onClick={onClose}
                    className="px-3 py-1 rounded bg-gray-200 dark:bg-gray-700 dark:text-gray-300"
                >
                    Back
                </button>
            </div>

            {!selectedSong ? (
                <div>
                    <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">
                        Choose a Song
                    </h3>
                    <ul className="space-y-2">
                        {supportedSongs.map(song => (
                            <li key={song.title}>
                                <button
                                    onClick={() => {
                                        setSelectedSong(song);
                                        setCurrentChordIndex(0);
                                    }}
                                    className="w-full text-left px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded hover:bg-blue-100 dark:hover:bg-gray-600"
                                >
                                    {song.title} – {song.artist}
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            ) : (
                <div>
                    <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-1">
                        {selectedSong.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                        {selectedSong.artist} • Key: {selectedSong.key} • Original Tempo:{' '}
                        {selectedSong.bpm} BPM
                    </p>

                    {message && (
                        <div className="mb-4 p-2 bg-yellow-100 text-yellow-800 rounded">
                            {message}
                        </div>
                    )}

                    <div className="mb-4 flex flex-wrap gap-2">
                        {selectedSong.progression.map((chordName, idx) => (
                            <button
                                key={`${chordName}-${idx}`}
                                onClick={() => setCurrentChordIndex(idx)}
                                className={`px-3 py-1 rounded-lg ${
                                    idx === currentChordIndex
                                        ? 'bg-blue-500 text-white'
                                        : 'bg-gray-200 dark:bg-gray-700 dark:text-gray-300'
                                }`}
                            >
                                {chordName}
                            </button>
                        ))}
                    </div>

                    <PracticeMetronomeControls
                        isPlaying={isPlaying}
                        bpm={bpm}
                        setBpm={setBpm}
                        toggleMetronome={toggleMetronome}
                        handleStrum={handleStrum}
                        nextChord={nextChord}
                    />

                    <InstrumentPanel
                        selectedInstrument={selectedInstrument}
                        onInstrumentChange={setSelectedInstrument}
                    />
                </div>
            )}
        </div>
    );
};

export default SongPractice;