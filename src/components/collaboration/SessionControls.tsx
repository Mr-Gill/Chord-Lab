import React, { useState } from 'react';
import { useCollaboration } from '../../contexts/CollaborationContext';

interface SessionControlsProps {
  onSessionStart?: (sessionId: string) => void;
  onSessionJoin?: (sessionId: string) => void;
}

const SessionControls: React.FC<SessionControlsProps> = ({ onSessionStart, onSessionJoin }) => {
  const { isTeacher, sessionId, startSession, joinSession, endSession } = useCollaboration();
  const [joinSessionId, setJoinSessionId] = useState('');
  const [studentName, setStudentName] = useState('');
  const [mode, setMode] = useState<'join' | 'create'>('create');

  const handleStartSession = () => {
    const newSessionId = startSession();
    onSessionStart?.(newSessionId);
  };

  const handleJoinSession = () => {
    if (joinSessionId && studentName) {
      joinSession(joinSessionId, studentName);
      onSessionJoin?.(joinSessionId);
    }
  };

  const handleEndSession = () => {
    endSession();
  };

  if (sessionId) {
    return (
      <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-green-800 dark:text-green-200">
              Active Session
            </h3>
            <p className="text-sm text-green-600 dark:text-green-300">
              Session ID: <span className="font-mono bg-green-100 dark:bg-green-800 px-2 py-1 rounded">{sessionId}</span>
            </p>
            <p className="text-xs text-green-500 dark:text-green-400 mt-1">
              {isTeacher ? 'You are the teacher' : 'You are a student'}
            </p>
          </div>
          <button
            onClick={handleEndSession}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            End Session
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
        Live Collaboration
      </h3>
      
      <div className="mb-4">
        <div className="flex space-x-4 mb-4">
          <button
            onClick={() => setMode('create')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              mode === 'create'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            Create Session (Teacher)
          </button>
          <button
            onClick={() => setMode('join')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              mode === 'join'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            Join Session (Student)
          </button>
        </div>
      </div>

      {mode === 'create' ? (
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Start a new session to allow students to join and collaborate in real-time.
          </p>
          <button
            onClick={handleStartSession}
            className="w-full px-4 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium"
          >
            🎓 Start Teacher Session
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div>
            <label htmlFor="student-name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Your Name
            </label>
            <input
              id="student-name"
              type="text"
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              placeholder="Enter your name"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label htmlFor="session-id" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Session ID
            </label>
            <input
              id="session-id"
              type="text"
              value={joinSessionId}
              onChange={(e) => setJoinSessionId(e.target.value)}
              placeholder="Enter session ID from your teacher"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <button
            onClick={handleJoinSession}
            disabled={!joinSessionId || !studentName}
            className="w-full px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
          >
            👥 Join Session
          </button>
        </div>
      )}
    </div>
  );
};

export default SessionControls;