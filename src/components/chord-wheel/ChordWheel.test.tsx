import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import ChordWheel from './ChordWheel';
const playChord = vi.fn();

vi.mock('../../contexts/AudioProvider', () => ({
  useAudioContext: () => ({ playChord }),
}));

const mockChords = ['C', 'G', 'D', 'A'];
const mockOnSelect = vi.fn();

const TestWrapper: React.FC<{children: React.ReactNode}> = ({ children }) => (
  <DndProvider backend={HTML5Backend}>
    {children}
  </DndProvider>
);

describe('ChordWheel', () => {
  it('renders all chord items', () => {
    render(
      <TestWrapper>
        <ChordWheel chords={mockChords} />
      </TestWrapper>
    );
    
    mockChords.forEach(chord => {
      expect(screen.getByText(chord)).toBeInTheDocument();
    });
  });

  it('calls onChordSelect when a chord is clicked', () => {
    render(
      <TestWrapper>
        <ChordWheel chords={mockChords} onChordSelect={mockOnSelect} />
      </TestWrapper>
    );
    
    fireEvent.click(screen.getByText('G'));
    expect(mockOnSelect).toHaveBeenCalledWith('G');
  });
});
