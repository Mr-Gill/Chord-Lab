import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import PlaybackTester from './PlaybackTester';

const mockNoteName = (note: number) => `N${note}`;

describe('PlaybackTester', () => {
  it('plays note when button clicked', () => {
    const playNote = vi.fn();
    render(<PlaybackTester playNote={playNote} noteNumberToName={mockNoteName} />);

    fireEvent.click(screen.getByText('N60'));
    expect(playNote).toHaveBeenCalledWith(60);
  });
});
