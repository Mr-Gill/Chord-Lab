import { render, screen, fireEvent } from '@testing-library/react';
import GenreQuiz from '../GenreQuiz';
import { vi } from 'vitest';

const playNoteMock = vi.fn();

vi.mock('../../../../contexts/AudioProvider', () => ({
  useAudioContext: () => ({
    playNote: playNoteMock,
  }),
}));

describe('GenreQuiz', () => {
  beforeEach(() => {
    playNoteMock.mockClear();
  });

  it('allows guessing and updates score', () => {
    render(<GenreQuiz />);
    const rockButton = screen.getByRole('button', { name: /Rock/i });
    fireEvent.click(rockButton);
    expect(screen.getByTestId('score')).toHaveTextContent('1/1');
  });

  it('shuffles songs', () => {
    vi.spyOn(Math, 'random').mockReturnValueOnce(0).mockReturnValueOnce(0);
    render(<GenreQuiz />);
    const playButton = screen.getByRole('button', { name: /Play Clip/i });
    fireEvent.click(playButton);
    expect(playNoteMock).toHaveBeenLastCalledWith('C4');

    const shuffleButton = screen.getByRole('button', { name: /Shuffle/i });
    fireEvent.click(shuffleButton);
    playNoteMock.mockClear();
    fireEvent.click(playButton);
    expect(playNoteMock).toHaveBeenLastCalledWith('D4');
  });

  it('reveals the answer when requested', () => {
    render(<GenreQuiz />);
    const revealButton = screen.getByRole('button', { name: /Reveal Answer/i });
    fireEvent.click(revealButton);
    expect(screen.getByTestId('answer')).toHaveTextContent('Rock');
  });

  it('resets score', () => {
    render(<GenreQuiz />);
    const rockButton = screen.getByRole('button', { name: /Rock/i });
    fireEvent.click(rockButton);
    expect(screen.getByTestId('score')).toHaveTextContent('1/1');
    const resetButton = screen.getByRole('button', { name: /Reset Score/i });
    fireEvent.click(resetButton);
    expect(screen.getByTestId('score')).toHaveTextContent('0/0');
  });
});
