import React, { useCallback, useState } from 'react'
import { chordQualities } from '../../../data/chordQualities'
import { useAudioContext } from '../../../contexts/AudioProvider'

interface Score {
  teamA: number
  teamB: number
}

const getRandomChord = () =>
  chordQualities[Math.floor(Math.random() * chordQualities.length)]

const ChordQualityQuiz: React.FC = () => {
  const { playChord } = useAudioContext()
  const [currentChord, setCurrentChord] = useState(getRandomChord)
  const [feedback, setFeedback] = useState<string | null>(null)
  const [answered, setAnswered] = useState(false)
  const [activeTeam, setActiveTeam] = useState<'A' | 'B'>('A')
  const [scores, setScores] = useState<Score>({ teamA: 0, teamB: 0 })

  const playCurrentChord = useCallback(() => {
    playChord(currentChord.notes)
  }, [playChord, currentChord])

  const handleAnswer = (quality: 'Major' | 'Minor') => {
    if (answered) return
    const isCorrect = quality === currentChord.quality
    setFeedback(isCorrect ? 'Correct!' : 'Incorrect')
    setAnswered(true)
    if (isCorrect) {
      setScores(prev =>
        activeTeam === 'A'
          ? { ...prev, teamA: prev.teamA + 1 }
          : { ...prev, teamB: prev.teamB + 1 }
      )
    }
  }

  const nextRound = () => {
    setCurrentChord(getRandomChord())
    setFeedback(null)
    setAnswered(false)
    setActiveTeam(prev => (prev === 'A' ? 'B' : 'A'))
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
      <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4">
        Chord Quality Quiz
      </h3>

      <div className="flex justify-around mb-4">
        <div
          className={`px-4 py-2 rounded ${
            activeTeam === 'A' ? 'bg-blue-100 dark:bg-blue-900' : ''
          }`}
        >
          <span className="font-bold">Team A:</span> {scores.teamA}
        </div>
        <div
          className={`px-4 py-2 rounded ${
            activeTeam === 'B' ? 'bg-blue-100 dark:bg-blue-900' : ''
          }`}
        >
          <span className="font-bold">Team B:</span> {scores.teamB}
        </div>
      </div>

      <div className="text-center">
        <button
          onClick={playCurrentChord}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Play Chord
        </button>
      </div>

      <div className="flex justify-center gap-4 mt-4">
        <button
          onClick={() => handleAnswer('Major')}
          disabled={answered}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
        >
          Major
        </button>
        <button
          onClick={() => handleAnswer('Minor')}
          disabled={answered}
          className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 disabled:opacity-50"
        >
          Minor
        </button>
      </div>

      {feedback && (
        <div className="mt-4 text-center">
          <p
            className={`text-lg font-bold ${
              feedback === 'Correct!' ? 'text-green-600' : 'text-red-600'
            }`}
          >
            {feedback}
          </p>
          <button
            onClick={nextRound}
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Next Chord
          </button>
        </div>
      )}
    </div>
  )
}

export default ChordQualityQuiz
