import React, { useState, useEffect } from 'react'
import useMetronome from '../../../hooks/useMetronome'
import { useAudioContext } from '../../../contexts/AudioProvider'

interface RhythmPattern {
  id: number
  sequence: ('quarter' | 'eighth' | 'rest')[]
  image: string
}

const PATTERNS: RhythmPattern[] = [
  { id: 1, sequence: ['quarter', 'quarter'], image: '/images/rhythms/pattern1.png' },
  { id: 2, sequence: ['quarter', 'eighth', 'eighth'], image: '/images/rhythms/pattern2.png' },
  { id: 3, sequence: ['eighth', 'eighth', 'quarter'], image: '/images/rhythms/pattern3.png' },
  { id: 4, sequence: ['quarter', 'rest', 'quarter'], image: '/images/rhythms/pattern4.png' },
]

const RhythmDictationGame: React.FC = () => {
  const { playNote, initAudio } = useAudioContext()
  const [{ bpm }, { start: startMetronome, stop: stopMetronome }] = useMetronome(80, 4)

  const [currentPattern, setCurrentPattern] = useState<RhythmPattern | null>(null)
  const [options, setOptions] = useState<RhythmPattern[]>([])
  const [score, setScore] = useState({ correct: 0, total: 0 })
  const [showAnswer, setShowAnswer] = useState(false)

  const nextQuestion = () => {
    const shuffled = [...PATTERNS].sort(() => Math.random() - 0.5)
    setCurrentPattern(shuffled[0])
    setOptions(shuffled.slice(0, 3).sort(() => Math.random() - 0.5))
    setShowAnswer(false)
  }

  useEffect(() => {
    nextQuestion()
  }, [])

  const playPattern = () => {
    if (!currentPattern) return
    initAudio()
    startMetronome()
    const quarter = (60 / bpm) * 1000
    let time = 0
    currentPattern.sequence.forEach(step => {
      const duration = step === 'quarter' ? quarter : step === 'eighth' ? quarter / 2 : quarter
      if (step !== 'rest') {
        setTimeout(() => playNote('C4', step === 'quarter' ? 0.5 : 0.25), time)
      }
      time += duration
    })
    setTimeout(() => {
      stopMetronome()
    }, time)
  }

  const handleChoice = (choice: RhythmPattern) => {
    setScore(s => ({
      correct: s.correct + (choice.id === currentPattern?.id ? 1 : 0),
      total: s.total + 1,
    }))
    nextQuestion()
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold">Rhythm Dictation</h3>
        <span className="text-sm">Score: {score.correct}/{score.total}</span>
      </div>
      <div className="flex gap-4 mb-4">
        <button
          onClick={playPattern}
          className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded"
        >
          Play Pattern
        </button>
        <button
          onClick={() => setShowAnswer(s => !s)}
          className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded"
        >
          {showAnswer ? 'Hide Answer' : 'Show Answer'}
        </button>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {options.map(option => (
          <button
            key={option.id}
            onClick={() => handleChoice(option)}
            className={`border-2 rounded overflow-hidden ${
              showAnswer && currentPattern?.id === option.id
                ? 'border-green-500'
                : 'border-transparent'
            }`}
          >
            <img src={option.image} alt="rhythm option" className="w-full h-auto" />
          </button>
        ))}
      </div>
    </div>
  )
}

export default RhythmDictationGame

