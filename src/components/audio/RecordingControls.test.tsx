import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import RecordingControls from './RecordingControls';

const mockNoteName = (note: number) => `N${note}`;

describe('RecordingControls', () => {
  it('starts and stops recording', () => {
    const start = vi.fn();
    const stop = vi.fn();
    const clear = vi.fn();
    const exportFn = vi.fn();

    const { rerender } = render(
      <RecordingControls
        recording={false}
        recordedNotes={[]}
        startRecording={start}
        stopRecording={stop}
        clearRecording={clear}
        handleExportRecording={exportFn}
        noteNumberToName={mockNoteName}
      />
    );

    fireEvent.click(screen.getByText('Start Recording'));
    expect(start).toHaveBeenCalled();

    rerender(
      <RecordingControls
        recording={true}
        recordedNotes={[]}
        startRecording={start}
        stopRecording={stop}
        clearRecording={clear}
        handleExportRecording={exportFn}
        noteNumberToName={mockNoteName}
      />
    );

    fireEvent.click(screen.getByText('Stop Recording'));
    expect(stop).toHaveBeenCalled();
  });
});
