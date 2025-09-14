import React, { useState } from 'react';
import SessionControls from '../collaboration/SessionControls';
import LiveStudentMonitor from '../collaboration/LiveStudentMonitor';
import AssignmentCreator from '../collaboration/AssignmentCreator';
import StudentLeaderboard from '../gamification/StudentLeaderboard';
import ProjectionMode from './ProjectionMode';
import LessonPlanBuilder from '../teaching/LessonPlanBuilder';
import MidiIntegration from '../audio/MidiIntegration';
import { useCollaboration } from '../../contexts/CollaborationContext';

const EnhancedClassroomDashboard: React.FC = () => {
  const { isTeacher, sessionId } = useCollaboration();
  const [projectionMode, setProjectionMode] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'assignments' | 'monitor' | 'leaderboard' | 'lessons' | 'midi'>('overview');

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'assignments', label: 'Assignments', icon: '📋' },
    { id: 'lessons', label: 'Lesson Plans', icon: '📚' },
    { id: 'midi', label: 'MIDI & Audio', icon: '🎹' },
    { id: 'monitor', label: 'Live Monitor', icon: '👁️' },
    { id: 'leaderboard', label: 'Leaderboard', icon: '🏆' },
  ];

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Enhanced Classroom Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Collaborative learning with real-time features
          </p>
        </div>
        
        {sessionId && (
          <div className="flex space-x-2">
            <button
              onClick={() => setProjectionMode(true)}
              className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors flex items-center space-x-2"
            >
              <span>📽️</span>
              <span>Projection Mode</span>
            </button>
          </div>
        )}
      </div>

      {/* Session Controls - Always visible */}
      <SessionControls />

      {/* Main content - Only show when session is active */}
      {sessionId && (
        <>
          {/* Tab Navigation */}
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="-mb-px flex space-x-8">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                  }`}
                >
                  <span className="mr-2">{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="space-y-6">
            {activeTab === 'overview' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <LiveStudentMonitor />
                <StudentLeaderboard />
              </div>
            )}

            {activeTab === 'assignments' && (
              <div className="max-w-4xl">
                <AssignmentCreator />
              </div>
            )}

            {activeTab === 'lessons' && (
              <div className="max-w-6xl">
                <LessonPlanBuilder />
              </div>
            )}

            {activeTab === 'midi' && (
              <div className="max-w-4xl">
                <MidiIntegration />
              </div>
            )}

            {activeTab === 'monitor' && (
              <div className="max-w-6xl">
                <LiveStudentMonitor />
              </div>
            )}

            {activeTab === 'leaderboard' && (
              <div className="max-w-4xl">
                <StudentLeaderboard />
              </div>
            )}
          </div>

          {/* Quick Stats Bar */}
          {isTeacher && (
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                      {sessionId?.slice(-6).toUpperCase()}
                    </div>
                    <div className="text-sm text-blue-500 dark:text-blue-300">Session ID</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                      {/* This would be calculated from students array in real implementation */}
                      3
                    </div>
                    <div className="text-sm text-green-500 dark:text-green-300">Active Students</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                      {/* This would be calculated from assignments array */}
                      2
                    </div>
                    <div className="text-sm text-purple-500 dark:text-purple-300">Active Assignments</div>
                  </div>
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Session started at {new Date().toLocaleTimeString()}
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* Projection Mode */}
      <ProjectionMode 
        isActive={projectionMode}
        onClose={() => setProjectionMode(false)}
      />

      {/* Feature Highlights for Non-Session Users */}
      {!sessionId && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
            <div className="text-3xl mb-3">🤝</div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
              Real-time Collaboration
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Connect with students instantly. Monitor their progress and provide guidance in real-time.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
            <div className="text-3xl mb-3">📋</div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
              Smart Assignments
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Create custom assignments with specific chords and due dates. Track completion automatically.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
            <div className="text-3xl mb-3">📽️</div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
              Projection Mode
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Full-screen chord displays optimized for classrooms of any size. Perfect for group lessons.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
            <div className="text-3xl mb-3">🏆</div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
              Gamification
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Motivate students with achievements, leaderboards, and progress tracking.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
            <div className="text-3xl mb-3">👁️</div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
              Live Monitoring
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              See what students are practicing in real-time. Provide immediate feedback and guidance.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
            <div className="text-3xl mb-3">📊</div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
              Progress Analytics
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Detailed insights into student progress, practice time, and areas for improvement.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default EnhancedClassroomDashboard;