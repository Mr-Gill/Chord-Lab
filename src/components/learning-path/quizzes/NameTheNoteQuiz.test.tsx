import { render, screen, fireEvent } from '@testing-library/react';
import NameTheNoteQuiz from './NameTheNoteQuiz';
import { vi, test, expect } from 'vitest';

const initAudioMock = vi.fn();
const playNoteMock = vi.fn();

vi.mock('../../../contexts/AudioProvider', () => ({
  useAudioContext: () => ({
    initAudio: initAudioMock,
    playNote: playNoteMock,
  }),
}));

test('plays note when Play Note button is clicked', () => {
  render(<NameTheNoteQuiz />);
  expect(initAudioMock).toHaveBeenCalled();
  const playButton = screen.getByRole('button', { name: /Play Note/i });
  fireEvent.click(playButton);
  expect(playNoteMock).toHaveBeenCalledWith('E3');
});