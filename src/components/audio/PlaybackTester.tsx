import React from 'react';

interface PlaybackTesterProps {
  playNote: (note: number) => void;
  noteNumberToName: (note: number) => string;
}

const PlaybackTester: React.FC<PlaybackTesterProps> = ({ playNote, noteNumberToName }) => {
  const notes = [60, 62, 64, 65, 67, 69, 71, 72];
  return (
    <div className="mb-6">
      <h4 className="text-md font-medium text-gray-800 dark:text-gray-200 mb-3">
        Test Playback
      </h4>
      <div className="grid grid-cols-4 md:grid-cols-8 gap-2">
        {notes.map(note => (
          <button
            key={note}
            onClick={() => playNote(note)}
            className="px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors text-sm"
          >
            {noteNumberToName(note)}
          </button>
        ))}
      </div>
      <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
        Click notes to test MIDI output (requires connected MIDI device with speakers/headphones)
      </p>
    </div>
  );
};

export default PlaybackTester;
