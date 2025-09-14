import React from 'react';
import { useMidi } from '../../hooks/useMidi';
import DeviceList from './DeviceList';
import RecordingControls from './RecordingControls';
import PlaybackTester from './PlaybackTester';

const MidiIntegration: React.FC = () => {
  const {
    isSupported,
    isConnected,
    devices,
    lastNote,
    recording,
    recordedNotes,
    startRecording,
    stopRecording,
    clearRecording,
    playNote,
    noteNumberToName,
    exportRecording,
    initializeMidi,
  } = useMidi();

  if (!isSupported) {
    return (
      <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
        <div className="flex items-center">
          <div className="text-yellow-600 dark:text-yellow-400 mr-3">⚠️</div>
          <div>
            <h4 className="font-medium text-yellow-800 dark:text-yellow-200">MIDI Not Supported</h4>
            <p className="text-sm text-yellow-700 dark:text-yellow-300">
              Your browser doesn't support WebMIDI. Try using Chrome, Edge, or Opera for MIDI functionality.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const connectedDevices = devices.filter(device => device.state === 'connected');
  const inputDevices = connectedDevices.filter(device => device.type === 'input');

  const handleExportRecording = () => {
    const exportData = exportRecording();
    if (exportData) {
      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `midi-recording-${new Date().toISOString().slice(0, 19)}.json`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 flex items-center">🎹 MIDI Integration</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">Connect and use MIDI devices for enhanced music learning</p>
        </div>
        <div className={`px-3 py-1 rounded-full text-sm ${
          isConnected
            ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
            : 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
        }`}>
          {isConnected ? '🟢 Connected' : '🔴 Disconnected'}
        </div>
      </div>

      {!isConnected && (
        <div className="mb-4">
          <button
            onClick={() => void initializeMidi()}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Connect MIDI Devices
          </button>
        </div>
      )}

      {isConnected && (
        <>
          <DeviceList
            connectedDevices={connectedDevices}
            inputDevices={inputDevices}
            lastNote={lastNote}
            noteNumberToName={noteNumberToName}
          />

          {inputDevices.length > 0 && (
            <RecordingControls
              recording={recording}
              recordedNotes={recordedNotes}
              startRecording={startRecording}
              stopRecording={stopRecording}
              clearRecording={clearRecording}
              handleExportRecording={handleExportRecording}
              noteNumberToName={noteNumberToName}
            />
          )}

          <PlaybackTester playNote={playNote} noteNumberToName={noteNumberToName} />

          <div className="border-t border-gray-200 dark:border-gray-600 pt-6">
            <h4 className="text-md font-medium text-gray-800 dark:text-gray-200 mb-3">MIDI Features</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <span>✅</span>
                  <span className="font-medium text-green-800 dark:text-green-200">Real-time Input</span>
                </div>
                <p className="text-sm text-green-700 dark:text-green-300">
                  See notes as you play them on your MIDI keyboard
                </p>
              </div>

              <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <span>✅</span>
                  <span className="font-medium text-green-800 dark:text-green-200">Practice Recording</span>
                </div>
                <p className="text-sm text-green-700 dark:text-green-300">
                  Record your practice sessions for review and analysis
                </p>
              </div>

              <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <span>🚧</span>
                  <span className="font-medium text-yellow-800 dark:text-yellow-200">Chord Recognition</span>
                </div>
                <p className="text-sm text-yellow-700 dark:text-yellow-300">
                  Automatic chord detection coming soon
                </p>
              </div>

              <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <span>🚧</span>
                  <span className="font-medium text-yellow-800 dark:text-yellow-200">Timing Analysis</span>
                </div>
                <p className="text-sm text-yellow-700 dark:text-yellow-300">
                  Rhythm and timing feedback coming soon
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default MidiIntegration;
