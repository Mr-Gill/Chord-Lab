import React, { useMemo, useState } from 'react';
import { useAudioContext } from '../../../contexts/AudioProvider';
import { shuffle } from '../../../utils/shuffle';

interface Song {
  id: number;
  note: string;
  genre: string;
}

interface Score {
  correct: number;
  attempted: number;
}

const GENRES = ['Rock', 'Jazz', 'Classical'];

const GenreQuiz: React.FC = () => {
  const { playNote } = useAudioContext();

  const initialSongs: Song[] = useMemo(
    () => [
      { id: 1, note: 'C4', genre: 'Rock' },
      { id: 2, note: 'D4', genre: 'Jazz' },
      { id: 3, note: 'E4', genre: 'Classical' },
    ],
    []
  );

  const [songs, setSongs] = useState(initialSongs);
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState<Score>({ correct: 0, attempted: 0 });
  const [revealed, setRevealed] = useState(false);

  const handleGuess = (genre: string) => {
    if (revealed) return;
    setRevealed(true);
    setScore((prev: Score) => ({
      correct: prev.correct + (songs[current].genre === genre ? 1 : 0),
      attempted: prev.attempted + 1,
    }));
  };

  const shuffleSongs = () => {
    setSongs(shuffle(songs));
    setCurrent(0);
    setRevealed(false);
  };

  const resetScore = () => {
    setScore({ correct: 0, attempted: 0 });
    setRevealed(false);
  };

  return (
    <div>
      <p data-testid="score">
        Score: {score.correct}/{score.attempted}
      </p>
      <button onClick={() => playNote(songs[current].note)}>Play Clip</button>
      <div>
        {GENRES.map((g) => (
          <button key={g} onClick={() => handleGuess(g)} disabled={revealed}>
            {g}
          </button>
        ))}
      </div>
      <button onClick={() => setRevealed(true)}>Reveal Answer</button>
      {revealed && <p data-testid="answer">{songs[current].genre}</p>}
      <button onClick={shuffleSongs}>Shuffle</button>
      <button onClick={resetScore}>Reset Score</button>
    </div>
  );
};

export default GenreQuiz;
