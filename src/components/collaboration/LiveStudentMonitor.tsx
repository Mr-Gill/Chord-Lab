import React, { useState } from 'react';
import { useCollaboration } from '../../contexts/CollaborationContext';

const LiveStudentMonitor: React.FC = () => {
  const { students, sessionId, updateStudentActivity } = useCollaboration();
  const [expandedStudent, setExpandedStudent] = useState<string | null>(null);

  if (!sessionId) {
    return null;
  }

  const formatTime = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}m ${seconds}s`;
  };

  const getStatusColor = (isOnline: boolean) => {
    return isOnline ? 'bg-green-500' : 'bg-gray-400';
  };

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
          Live Student Activity
        </h3>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {students.filter(s => s.isOnline).length} / {students.length} online
        </span>
      </div>

      {students.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500 dark:text-gray-400">
            No students have joined the session yet.
          </p>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
            Share the session ID with your students to get started.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {students.map((student) => (
            <div
              key={student.id}
              className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 transition-all hover:shadow-sm"
            >
              <div 
                className="flex items-center justify-between cursor-pointer"
                onClick={() => setExpandedStudent(
                  expandedStudent === student.id ? null : student.id
                )}
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${getStatusColor(student.isOnline)}`} />
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-gray-100">
                      {student.name}
                    </h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {student.isOnline ? 'Online' : 'Offline'} • 
                      {student.currentChord ? ` Playing ${student.currentChord}` : ' Not practicing'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {student.chordsPlayed} chords
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {formatTime(student.practiceTime)}
                    </p>
                  </div>
                  <svg
                    className={`w-5 h-5 text-gray-400 transform transition-transform ${
                      expandedStudent === student.id ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
              
              {expandedStudent === student.id && (
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Practice Time</p>
                      <p className="text-lg text-gray-900 dark:text-gray-100">{formatTime(student.practiceTime)}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Chords Played</p>
                      <p className="text-lg text-gray-900 dark:text-gray-100">{student.chordsPlayed}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Accuracy</p>
                      <p className="text-lg text-gray-900 dark:text-gray-100">{student.accuracy}%</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Current Chord</p>
                      <p className="text-lg text-gray-900 dark:text-gray-100">
                        {student.currentChord ?? 'None'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="mt-4 flex space-x-2">
                    <button
                      onClick={() => updateStudentActivity(student.id, { 
                        currentChord: 'C Major' 
                      })}
                      className="px-3 py-1 text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
                    >
                      Suggest C Major
                    </button>
                    <button
                      onClick={() => updateStudentActivity(student.id, { 
                        currentChord: 'G Major' 
                      })}
                      className="px-3 py-1 text-xs bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-lg hover:bg-green-200 dark:hover:bg-green-800 transition-colors"
                    >
                      Suggest G Major
                    </button>
                    <button
                      onClick={() => updateStudentActivity(student.id, { 
                        currentChord: undefined 
                      })}
                      className="px-3 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                    >
                      Clear
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LiveStudentMonitor;