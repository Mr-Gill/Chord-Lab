import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { vi } from 'vitest';
import ChordProgressionBuilder from './ChordProgressionBuilder';
import { ChordBuilderProvider } from '../../contexts/ChordBuilderContext';

const initAudio = vi.fn();
const playChord = vi.fn();

vi.mock('../../contexts/AudioProvider', () => ({
  useAudioContext: () => ({ initAudio, playChord }),
}));

// We'll add tests here

describe('ChordProgressionBuilder', () => {
  it('should render the component', () => {
    render(
      <ChordBuilderProvider>
        <ChordProgressionBuilder />
      </ChordBuilderProvider>
    );
    expect(screen.getByText('Chord Progression Builder')).toBeInTheDocument();
  });
});
