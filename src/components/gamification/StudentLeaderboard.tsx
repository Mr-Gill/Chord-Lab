import React from 'react';
import { useCollaboration } from '../../contexts/CollaborationContext';
import { useAchievements } from '../../contexts/AchievementContext';

interface LeaderboardEntry {
  studentId: string;
  name: string;
  score: number;
  chordsPlayed: number;
  practiceTime: number;
  accuracy: number;
  achievements: string[];
}

const StudentLeaderboard: React.FC = () => {
  const { students, sessionId } = useCollaboration();
  const { unlockedAchievements } = useAchievements();

  if (!sessionId || students.length === 0) {
    return null;
  }

  // Calculate scores for leaderboard
  const leaderboardEntries: LeaderboardEntry[] = students.map(student => {
    // Score calculation: combination of chords played, practice time, and accuracy
    const timeScore = Math.floor(student.practiceTime / 60000); // 1 point per minute
    const chordScore = student.chordsPlayed * 2; // 2 points per chord
    const accuracyBonus = Math.floor(student.accuracy / 10); // 1 point per 10% accuracy
    const totalScore = timeScore + chordScore + accuracyBonus;

    return {
      studentId: student.id,
      name: student.name,
      score: totalScore,
      chordsPlayed: student.chordsPlayed,
      practiceTime: student.practiceTime,
      accuracy: student.accuracy,
      achievements: Array.from(unlockedAchievements), // In real app, would be per-student
    };
  }).sort((a, b) => b.score - a.score);

  const formatTime = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}m ${seconds}s`;
  };

  const getRankIcon = (index: number) => {
    switch (index) {
      case 0: return '🥇';
      case 1: return '🥈';
      case 2: return '🥉';
      default: return `#${index + 1}`;
    }
  };

  const getRankColor = (index: number) => {
    switch (index) {
      case 0: return 'text-yellow-600 dark:text-yellow-400';
      case 1: return 'text-gray-500 dark:text-gray-400';
      case 2: return 'text-orange-600 dark:text-orange-400';
      default: return 'text-gray-700 dark:text-gray-300';
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
          🏆 Student Leaderboard
        </h3>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Real-time rankings
        </div>
      </div>

      <div className="space-y-3">
        {leaderboardEntries.map((entry, index) => (
          <div
            key={entry.studentId}
            className={`p-4 rounded-lg border transition-all ${
              index === 0 
                ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800' 
                : index === 1
                ? 'bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600'
                : index === 2
                ? 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800'
                : 'bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`text-2xl font-bold ${getRankColor(index)}`}>
                  {getRankIcon(index)}
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-gray-100">
                    {entry.name}
                  </h4>
                  <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                    <span>{entry.chordsPlayed} chords</span>
                    <span>{formatTime(entry.practiceTime)}</span>
                    <span>{entry.accuracy}% accuracy</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xl font-bold text-blue-600 dark:text-blue-400">
                  {entry.score}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  points
                </div>
              </div>
            </div>

            {/* Achievement badges */}
            {entry.achievements.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-1">
                {entry.achievements.slice(0, 5).map(achievementId => (
                  <span
                    key={achievementId}
                    className="inline-block px-2 py-1 text-xs bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 rounded-full"
                  >
                    🏅 {achievementId.replace('_', ' ')}
                  </span>
                ))}
                {entry.achievements.length > 5 && (
                  <span className="inline-block px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-full">
                    +{entry.achievements.length - 5} more
                  </span>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Scoring explanation */}
      <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <h4 className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-2">
          How scoring works:
        </h4>
        <div className="text-xs text-blue-700 dark:text-blue-300 space-y-1">
          <div>• 1 point per minute of practice time</div>
          <div>• 2 points per chord played</div>
          <div>• Accuracy bonus: 1 point per 10% accuracy</div>
        </div>
      </div>
    </div>
  );
};

export default StudentLeaderboard;