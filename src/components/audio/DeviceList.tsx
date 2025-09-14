import React from 'react';

interface MidiDevice {
  id: string;
  name: string;
  manufacturer: string;
  state: 'connected' | 'disconnected';
  type: 'input' | 'output';
}

interface MidiNote {
  note: number;
  velocity: number;
  channel: number;
  timestamp: number;
}

interface DeviceListProps {
  connectedDevices: MidiDevice[];
  inputDevices: MidiDevice[];
  lastNote: MidiNote | null;
  noteNumberToName: (note: number) => string;
}

const DeviceList: React.FC<DeviceListProps> = ({ connectedDevices, inputDevices, lastNote, noteNumberToName }) => {
  return (
    <>
      <div className="mb-6">
        <h4 className="text-md font-medium text-gray-800 dark:text-gray-200 mb-3">
          Connected Devices ({connectedDevices.length})
        </h4>
        {connectedDevices.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            No MIDI devices connected. Connect a MIDI keyboard or controller to get started.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {connectedDevices.map(device => (
              <div
                key={device.id}
                className="p-3 border border-gray-200 dark:border-gray-600 rounded-lg"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-gray-900 dark:text-gray-100">
                      {device.name}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {device.manufacturer} • {device.type}
                    </div>
                  </div>
                  <div className="text-2xl">
                    {device.type === 'input' ? '⬇️' : '⬆️'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {inputDevices.length > 0 && (
        <div className="mb-6">
          <h4 className="text-md font-medium text-gray-800 dark:text-gray-200 mb-3">
            Live MIDI Input
          </h4>
          <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            {lastNote ? (
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-lg font-mono text-gray-900 dark:text-gray-100">
                    {noteNumberToName(lastNote.note)}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Velocity: {lastNote.velocity} • Channel: {lastNote.channel + 1}
                  </div>
                </div>
                <div className="text-2xl">🎵</div>
              </div>
            ) : (
              <div className="text-center text-gray-500 dark:text-gray-400">
                Play a note on your MIDI device to see it here
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default DeviceList;
