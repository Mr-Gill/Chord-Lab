import type { FC } from 'react';

interface StatisticsProps {
  totalPracticeTime?: number;
  chordsPlayed?: number;
  currentStreak?: number;
  bestChallengeTime?: number | null;
  practiceTime?: number;
  showSimple?: boolean;
}

const Statistics: FC<StatisticsProps> = ({
  totalPracticeTime,
  chordsPlayed,
  currentStreak,
  bestChallengeTime,
  practiceTime,
  showSimple = false,
}) => {
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60000);
    const seconds = Math.floor((time % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const formatBestTime = (time: number | null) => {
    if (time === null) return '--:--';
    const minutes = Math.floor(time / 60000);
    const seconds = Math.floor((time % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  if (showSimple) {
    return (
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white/70 dark:bg-gray-800/70 p-4 rounded-xl text-center">
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {formatTime(practiceTime || 0)}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Practice Time</div>
        </div>
        <div className="bg-white/70 dark:bg-gray-800/70 p-4 rounded-xl text-center">
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">
            {chordsPlayed || 0}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Chords Played</div>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
      <h4 className="font-bold text-gray-800 dark:text-gray-100 mb-2">
        📊 Practice Statistics
      </h4>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-green-50 dark:bg-green-900/30 p-4 rounded-lg text-center">
          <div className="text-2xl font-bold text-green-800 dark:text-green-300">
            {formatTime(totalPracticeTime || 0)}
          </div>
          <div className="text-sm text-green-700 dark:text-green-400">Total Practice</div>
        </div>
        <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg text-center">
          <div className="text-2xl font-bold text-blue-800 dark:text-blue-300">
            {chordsPlayed || 0}
          </div>
          <div className="text-sm text-blue-700 dark:text-blue-400">Chords Played</div>
        </div>
        <div className="bg-yellow-50 dark:bg-yellow-900/30 p-4 rounded-lg text-center">
          <div className="text-2xl font-bold text-yellow-800 dark:text-yellow-300">
            {currentStreak || 0}
          </div>
          <div className="text-sm text-yellow-700 dark:text-yellow-400">Current Streak</div>
        </div>
        <div className="bg-red-50 dark:bg-red-900/30 p-4 rounded-lg text-center">
          <div className="text-2xl font-bold text-red-800 dark:text-red-300">
            {formatBestTime(bestChallengeTime)}
          </div>
          <div className="text-sm text-red-700 dark:text-red-400">Best Challenge</div>
        </div>
      </div>
    </div>
  );
};

export default Statistics;
