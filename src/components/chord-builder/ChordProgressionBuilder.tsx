import { useState, useEffect, useCallback } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import useAudio from '../../hooks/useAudio';
import { chords as chordData } from '../../data/chords';
import { useChordBuilder } from '../../contexts/ChordBuilderContext';
import { EnhancedChordWheel, ProgressionDropZone } from '../chord-wheel/EnhancedChordWheel';
import { getRomanNumeral } from '../../utils/key-degrees';

interface ProgressionChord {
  id: string;
  chord: string;
  roman: string | null;
}

const ChordProgressionBuilder = () => {
  const { selectedKey, setSelectedKey } = useChordBuilder();
  const [progression, setProgression] = useState<ProgressionChord[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);

  const { initAudio, playChord } = useAudio();

  useEffect(() => {
    initAudio();
  }, [initAudio]);

  const handlePlay = useCallback(async () => {
    initAudio();
    setIsPlaying(true);
    for (const item of progression) {
      const notes = chordData[item.chord]?.pianoNotes ?? [];
      if (notes.length > 0) {
        playChord(notes, 0.8);
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }
    setIsPlaying(false);
  }, [progression, initAudio, playChord]);

  const addChord = useCallback((chordName: string) => {
    const roman = getRomanNumeral(chordName, selectedKey);
    const newChord: ProgressionChord = {
      id: Date.now().toString(),
      chord: chordName,
      roman
    };
    setProgression(prev => [...prev, newChord]);
  }, [selectedKey]);

  const removeChord = useCallback((id: string) => {
    setProgression(prev => prev.filter(chord => chord.id !== id));
  }, []);

  const clearProgression = useCallback(() => {
    setProgression([]);
  }, []);

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header with Readex Pro font */}
        <div className="text-center">
          <h1 className="text-3xl font-readex font-bold text-gray-800 mb-2">
            Chord Progression Builder
          </h1>
          <p className="text-gray-600 font-inclusive-sans">
            Pick a key, drag chords from the wheel, and build your progression
          </p>
        </div>

        {/* Enhanced Chord Wheel with key-first workflow */}
        <EnhancedChordWheel
          selectedKey={selectedKey}
          onChordSelect={addChord}
          onKeyChange={setSelectedKey}
        />

        {/* Selected Progression Drop Zone */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-readex font-semibold text-gray-800 mb-4 text-center">
            Selected Progression
          </h2>
          <ProgressionDropZone
            progression={progression}
            onAddChord={addChord}
            onRemoveChord={removeChord}
            selectedKey={selectedKey}
          />
        </div>

        {/* Controls */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex flex-wrap gap-4 justify-between">
            <button
              onClick={clearProgression}
              className="px-6 py-3 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors font-medium"
            >
              Clear All
            </button>
            <button
              onClick={() => void handlePlay()}
              disabled={isPlaying || progression.length === 0}
              className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              {isPlaying ? 'Playing...' : 'Play Progression'}
            </button>
          </div>
          
          {progression.length > 0 && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-medium text-gray-700 mb-2">Roman Numeral Analysis</h3>
              <p className="text-sm text-gray-600">
                <strong>Key:</strong> {selectedKey} Major
              </p>
              <p className="text-sm text-gray-600">
                <strong>Progression:</strong> {progression.map(item => item.roman || '?').join(' - ')}
              </p>
            </div>
          )}
        </div>
      </div>
    </DndProvider>
  );
};

export default ChordProgressionBuilder;