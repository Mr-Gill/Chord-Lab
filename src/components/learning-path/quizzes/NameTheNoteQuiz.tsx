import React, { useState, useMemo, useEffect } from 'react';
import { useAudioContext } from '../../../contexts/AudioProvider';

interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: string;
  note: string;
}

const NameTheNoteQuiz: React.FC = () => {
  const { initAudio, playNote } = useAudioContext();

  useEffect(() => {
    initAudio();
  }, [initAudio]);

  const quizData: QuizQuestion[] = useMemo(
    () => [
      {
        id: 1,
        question: 'What is the name of the 6th string on the guitar (the thickest one)?',
        options: ['E', 'A', 'D', 'G'],
        correctAnswer: 'E',
        note: 'E3',
      },
      {
        id: 2,
        question: 'What is the name of the note to the left of C on the piano?',
        options: ['B', 'A', 'D', 'F'],
        correctAnswer: 'B',
        note: 'B3',
      },
      {
        id: 3,
        question: 'What is finger number 1 on the piano?',
        options: ['Thumb', 'Index', 'Middle', 'Ring'],
        correctAnswer: 'Thumb',
        note: 'C4',
      },
    ],
    []
  );

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  const currentQuestion = quizData[currentQuestionIndex];

  const handleAnswer = (answer: string) => {
    setSelectedAnswer(answer);
    setIsCorrect(answer === currentQuestion.correctAnswer);
  };

  const nextQuestion = () => {
    setSelectedAnswer(null);
    setIsCorrect(null);
    setCurrentQuestionIndex((prevIndex) => (prevIndex + 1) % quizData.length);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4">
        {currentQuestion.question}
      </h3>
      <button
        onClick={() => playNote(currentQuestion.note)}
        className="mb-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
      >
        Play Note
      </button>
      <div className="grid grid-cols-2 gap-4">
        {currentQuestion.options.map((option) => (
          <button
            key={option}
            onClick={() => handleAnswer(option)}
            disabled={selectedAnswer !== null}
            className={`p-4 rounded-lg text-left transition-colors ${
              selectedAnswer === null
                ? 'bg-gray-100 hover:bg-blue-100 dark:bg-gray-700 dark:hover:bg-blue-900'
                : selectedAnswer === option && isCorrect
                ? 'bg-green-500 text-white'
                : selectedAnswer === option && !isCorrect
                ? 'bg-red-500 text-white'
                : 'bg-gray-100 dark:bg-gray-700 opacity-50'
            }`}
          >
            {option}
          </button>
        ))}
      </div>
      {selectedAnswer && (
        <div className="mt-4 text-center">
          <p className={`text-lg font-bold ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
            {isCorrect ? 'Correct!' : 'Try Again!'}
          </p>
          <button
            onClick={nextQuestion}
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Next Question
          </button>
        </div>
      )}
    </div>
  );
};

export default NameTheNoteQuiz;
