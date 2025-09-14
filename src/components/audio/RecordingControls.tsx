import React from 'react';

interface MidiNote {
  note: number;
  velocity: number;
  channel: number;
  timestamp: number;
}

interface RecordingControlsProps {
  recording: boolean;
  recordedNotes: MidiNote[];
  startRecording: () => void;
  stopRecording: () => void;
  clearRecording: () => void;
  handleExportRecording: () => void;
  noteNumberToName: (note: number) => string;
}

const RecordingControls: React.FC<RecordingControlsProps> = ({
  recording,
  recordedNotes,
  startRecording,
  stopRecording,
  clearRecording,
  handleExportRecording,
  noteNumberToName,
}) => {
  return (
    <div className="mb-6">
      <h4 className="text-md font-medium text-gray-800 dark:text-gray-200 mb-3">
        Practice Recording
      </h4>
      <div className="flex items-center space-x-3 mb-3">
        {!recording ? (
          <button
            onClick={startRecording}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center space-x-2"
          >
            <span>🔴</span>
            <span>Start Recording</span>
          </button>
        ) : (
          <button
            onClick={stopRecording}
            className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors flex items-center space-x-2"
          >
            <span>⏹️</span>
            <span>Stop Recording</span>
          </button>
        )}

        <button
          onClick={clearRecording}
          disabled={recordedNotes.length === 0}
          className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          Clear
        </button>

        <button
          onClick={handleExportRecording}
          disabled={recordedNotes.length === 0}
          className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          Export
        </button>
      </div>

      {recording && (
        <div className="flex items-center space-x-2 text-red-600 dark:text-red-400">
          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
          <span className="text-sm">Recording... ({recordedNotes.length} notes)</span>
        </div>
      )}

      {recordedNotes.length > 0 && !recording && (
        <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <div className="text-sm text-blue-800 dark:text-blue-200">
            <strong>Recording Complete:</strong> {recordedNotes.length} notes captured
          </div>
          <div className="text-xs text-blue-600 dark:text-blue-300 mt-1">
            Latest notes: {recordedNotes.slice(-5).map(note => noteNumberToName(note.note)).join(', ')}
          </div>
        </div>
      )}
    </div>
  );
};

export default RecordingControls;
