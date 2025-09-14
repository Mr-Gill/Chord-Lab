import { useState, useEffect, useCallback } from 'react';

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

export const useMidi = () => {
  const [midiAccess, setMidiAccess] = useState<WebMidi.MIDIAccess | null>(null);
  const [devices, setDevices] = useState<MidiDevice[]>([]);
  const [isSupported, setIsSupported] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [lastNote, setLastNote] = useState<MidiNote | null>(null);
  const [recording, setRecording] = useState(false);
  const [recordedNotes, setRecordedNotes] = useState<MidiNote[]>([]);

  // Check MIDI support
  useEffect(() => {
    if (navigator.requestMIDIAccess) {
      setIsSupported(true);
      initializeMidi();
    } else {
      console.warn('WebMIDI is not supported in this browser');
    }
  }, []);

  const initializeMidi = async () => {
    try {
      const access = await navigator.requestMIDIAccess();
      setMidiAccess(access);
      setIsConnected(true);
      updateDeviceList(access);

      // Listen for device connection changes
      access.onstatechange = () => {
        updateDeviceList(access);
      };

      // Setup input listeners
      setupInputListeners(access);
    } catch (error) {
      console.error('Failed to initialize MIDI:', error);
      setIsConnected(false);
    }
  };

  const updateDeviceList = (access: WebMidi.MIDIAccess) => {
    const newDevices: MidiDevice[] = [];

    // Add input devices
    access.inputs.forEach((input) => {
      newDevices.push({
        id: input.id!,
        name: input.name || 'Unknown Input',
        manufacturer: input.manufacturer || 'Unknown',
        state: input.state as 'connected' | 'disconnected',
        type: 'input',
      });
    });

    // Add output devices
    access.outputs.forEach((output) => {
      newDevices.push({
        id: output.id!,
        name: output.name || 'Unknown Output',
        manufacturer: output.manufacturer || 'Unknown',
        state: output.state as 'connected' | 'disconnected',
        type: 'output',
      });
    });

    setDevices(newDevices);
  };

  const setupInputListeners = (access: WebMidi.MIDIAccess) => {
    access.inputs.forEach((input) => {
      input.onmidimessage = handleMidiMessage;
    });
  };

  const handleMidiMessage = useCallback((event: WebMidi.MIDIMessageEvent) => {
    const [status, note, velocity] = event.data;
    const channel = status & 0x0f;
    const messageType = status & 0xf0;

    // Handle note on/off messages
    if (messageType === 0x90 || messageType === 0x80) { // Note on or note off
      const isNoteOn = messageType === 0x90 && velocity > 0;
      
      if (isNoteOn) {
        const midiNote: MidiNote = {
          note,
          velocity,
          channel,
          timestamp: event.timeStamp || Date.now(),
        };
        
        setLastNote(midiNote);
        
        if (recording) {
          setRecordedNotes(prev => [...prev, midiNote]);
        }
      }
    }
  }, [recording]);

  const startRecording = () => {
    setRecording(true);
    setRecordedNotes([]);
  };

  const stopRecording = () => {
    setRecording(false);
  };

  const clearRecording = () => {
    setRecordedNotes([]);
  };

  const sendMidiMessage = useCallback((deviceId: string, message: number[]) => {
    if (!midiAccess) return;

    const output = midiAccess.outputs.get(deviceId);
    if (output) {
      output.send(message);
    }
  }, [midiAccess]);

  const playNote = useCallback((note: number, velocity: number = 127, duration: number = 500) => {
    if (!midiAccess) return;

    // Send to all connected output devices
    midiAccess.outputs.forEach((output) => {
      // Note on
      output.send([0x90, note, velocity]);
      
      // Note off after duration
      setTimeout(() => {
        output.send([0x80, note, 0]);
      }, duration);
    });
  }, [midiAccess]);

  const noteNumberToName = (noteNumber: number): string => {
    const noteNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
    const octave = Math.floor(noteNumber / 12) - 1;
    const noteName = noteNames[noteNumber % 12];
    return `${noteName}${octave}`;
  };

  const exportRecording = () => {
    if (recordedNotes.length === 0) return null;

    // Simple export format - could be extended to support MIDI file format
    return {
      notes: recordedNotes.map(note => ({
        ...note,
        noteName: noteNumberToName(note.note),
      })),
      duration: recordedNotes.length > 0 
        ? recordedNotes[recordedNotes.length - 1].timestamp - recordedNotes[0].timestamp 
        : 0,
      exportedAt: new Date().toISOString(),
    };
  };

  return {
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
    sendMidiMessage,
    noteNumberToName,
    exportRecording,
    initializeMidi,
  };
};