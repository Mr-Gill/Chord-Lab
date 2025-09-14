import { useState, Suspense, lazy } from 'react'
import { NavLink, Route, Routes, Navigate } from 'react-router-dom'
import { useClassroomMode } from './contexts/ClassroomModeContext'
import { useTheme } from './contexts/ThemeContext'
import { useUserProfile } from './contexts/UserProfileContext'
import OnboardingFlow from './components/onboarding/OnboardingFlow'
import { AchievementProvider } from './contexts/AchievementContext'
import { AchievementToast } from './components/achievements/AchievementToast'
import { ScoreboardProvider } from './components/classroom/Scoreboard'
import { ChordBuilderProvider } from './contexts/ChordBuilderContext';
import { CollaborationProvider } from './contexts/CollaborationContext';
import ErrorBoundary from './components/common/ErrorBoundary';
import './styles/responsive-diagrams.css'
import { StudentView } from './components/student/StudentView';

// Lazy-loaded components for code splitting
const Dashboard = lazy(() => import('./components/Dashboard'))
const ChordProgressionBuilder = lazy(() => import('./components/chord-builder/ChordProgressionBuilder'))
const PracticeMode = lazy(() => import('./components/practice-mode/PracticeModeWrapper'))
const Metronome = lazy(() => import('./components/practice-mode/Metronome'))
const LearningPathway = lazy(() => import('./components/learning-path/LearningPathway'))
const ChordWheel = lazy(() => import('./components/ChordWheel'))
const ChordSelectionInterface = lazy(() => import('./components/chord-selection/ChordSelectionInterface'))
const ScrollingPractice = lazy(() => import('./components/practice-mode/ScrollingPractice'))
const ClassroomMode = lazy(() => import('./components/classroom/ClassroomMode'))
const TeacherDashboard = lazy(() => import('./components/classroom/TeacherDashboard'))
const TeacherGamesDashboard = lazy(() => import('./components/classroom/TeacherGamesDashboard'))
const EnhancedClassroomDashboard = lazy(() => import('./components/classroom/EnhancedClassroomDashboard'))
const ExampleGame = lazy(() => import('./components/classroom/games/ExampleGame'))
const HelpResources = lazy(() => import('./components/HelpResources'))
const ProfilePage = lazy(() => import('./components/profile/ProfilePage').then(module => ({ default: module.ProfilePage })))
const ChordProgressionAnalysis = lazy(() => import('./components/theory-analysis/ChordProgressionAnalysis'))

// Loading component for Suspense
const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-[400px]">
    <div className="flex flex-col items-center space-y-4">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      <p className="text-gray-600 dark:text-gray-400">Loading...</p>
    </div>
  </div>
)

function App() {
  const { classroomMode, toggleClassroomMode } = useClassroomMode()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isMoreOpen, setIsMoreOpen] = useState(false)
  const [showAdvanced, setShowAdvanced] = useState(false)
  const { theme, setTheme } = useTheme()
  // --- MERGED HOOK (from feature/code-improvements) ---
  const { profile } = useUserProfile()

  const linkBase = 'px-4 py-2.5 rounded-xl whitespace-nowrap block font-medium transition-all duration-300'
  const linkActive = 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg transform scale-105'
  const linkIdle = 'text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 hover:text-purple-600 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-purple-400'

  const coreNavLinks = (
    <>
      <NavLink to="/" end className={({ isActive }) => `${linkBase} ${isActive ? linkActive : linkIdle}`}>
        🎸 Practice
      </NavLink>
      <NavLink to="/learn" className={({ isActive }) => `${linkBase} ${isActive ? linkActive : linkIdle}`}>
        📚 Learn
      </NavLink>
      <NavLink to="/profile" className={({ isActive }) => `${linkBase} ${isActive ? linkActive : linkIdle}`}>
        👤 Profile
      </NavLink>
    </>
  )

  const advancedNavLinks = showAdvanced ? (
    <>
      <NavLink to="/dashboard" className={({ isActive }) => `${linkBase} ${isActive ? linkActive : linkIdle}`}>
        🏠 Dashboard
      </NavLink>
      <NavLink to="/choose-chords" className={({ isActive }) => `${linkBase} ${isActive ? linkActive : linkIdle}`}>
        🎡 Choose Chords
      </NavLink>
      <NavLink to="/create" className={({ isActive }) => `${linkBase} ${isActive ? linkActive : linkIdle}`}>
        🔧 Chord Builder
      </NavLink>
      <NavLink to="/wheel" className={({ isActive }) => `${linkBase} ${isActive ? linkActive : linkIdle}`}>
        ⚙️ Chord Wheel
      </NavLink>
      <NavLink to="/metronome" className={({ isActive }) => `${linkBase} ${isActive ? linkActive : linkIdle}`}>
        🎵 Metronome
      </NavLink>
      <NavLink to="/theory" className={({ isActive }) => `${linkBase} ${isActive ? linkActive : linkIdle}`}>
        📖 Theory
      </NavLink>
    </>
  ) : null

  const navLinks = (
    <>
      {coreNavLinks}
      {advancedNavLinks}
      {showAdvanced && (
        <button
          onClick={() => setShowAdvanced(false)}
          className={`${linkBase} ${linkIdle} text-orange-600 hover:text-orange-700 border border-orange-300 hover:border-orange-400`}
        >
          ✨ Simple Mode
        </button>
      )}
    </>
  )

  return (
    <AchievementProvider>
      <CollaborationProvider>
        <ErrorBoundary>
        <div
          className={`min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 ${
            classroomMode ? 'text-[110%] contrast-125' : ''
          }`}
        >
          {/* --- MERGED JSX (from feature/code-improvements) --- */}
          {!profile.onboardingComplete && <OnboardingFlow />}
          {/* --- MERGED JSX (from main branch) --- */}
          <AchievementToast />
          <header className="bg-white/95 dark:bg-gray-900/95 dark:border-b dark:border-gray-700/50 shadow-lg relative backdrop-blur-lg">
            <div className="w-full mx-auto px-4 md:px-8 py-4 flex items-center justify-between">
              <div className="flex items-center gap-6">
                <span className="font-extrabold text-2xl bg-gradient-to-r from-purple-600 via-blue-600 to-emerald-600 bg-clip-text text-transparent">
                  Chord Lab
                </span>
                <nav className="hidden md:flex gap-1">{navLinks}</nav>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={toggleClassroomMode}
                  className={`px-4 py-2.5 rounded-xl border font-medium transition-all duration-300 ${
                    classroomMode
                      ? 'bg-gradient-to-r from-yellow-400 to-orange-500 border-yellow-300 text-white shadow-lg'
                      : 'bg-white/80 border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 dark:bg-gray-800/80 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700'
                  }`}
                  title="Classroom Mode: larger text and higher contrast"
                >
                  {classroomMode ? '🎓 Classroom: On' : 'Classroom: Off'}
                </button>
                {!showAdvanced && (
                  <button
                    onClick={() => setShowAdvanced(true)}
                    className="px-4 py-2.5 rounded-xl border font-medium transition-all duration-300 bg-white/80 border-gray-300 text-gray-700 hover:bg-gradient-to-r hover:from-purple-50 hover:to-blue-50 hover:text-purple-600 dark:bg-gray-800/80 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                    title="Show advanced features for experienced users"
                  >
                    🔧 Advanced
                  </button>
                )}
                <button
                  onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
                  className="p-3 rounded-xl border bg-white/80 border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 dark:bg-gray-800/80 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700 transition-all duration-300"
                  aria-label="Toggle theme"
                >
                  {theme === 'light' ? (
                    // sun icon
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                      />
                    </svg>
                  ) : (
                    // moon icon
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                      />
                    </svg>
                  )}
                </button>
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="md:hidden p-3 rounded-xl border bg-white/80 border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 dark:bg-gray-800/80 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700 transition-all duration-300"
                  aria-label="Toggle menu"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d={isMenuOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'}
                    />
                  </svg>
                </button>
              </div>
            </div>
            {isMenuOpen && (
              <nav className="md:hidden bg-white/95 dark:bg-gray-800/95 shadow-xl absolute top-full left-0 right-0 z-10 backdrop-blur-lg border-t border-gray-200/50 dark:border-gray-700/50">
                <div className="flex flex-col gap-2 p-4">
                  {coreNavLinks}
                  {!showAdvanced && (
                    <button
                      onClick={() => setShowAdvanced(true)}
                      className={`${linkBase} ${linkIdle} text-purple-600 hover:text-purple-700 border border-purple-300 hover:border-purple-400`}
                    >
                      🔧 Show Advanced Features
                    </button>
                  )}
                  {showAdvanced && (
                    <>
                      {advancedNavLinks}
                      <button
                        onClick={() => setShowAdvanced(false)}
                        className={`${linkBase} ${linkIdle} text-orange-600 hover:text-orange-700 border border-orange-300 hover:border-orange-400`}
                      >
                        ✨ Simple Mode
                      </button>
                    </>
                  )}
                </div>
              </nav>
            )}
          </header>

          <main className="w-full mx-auto px-4 md:px-8 py-6">
            <Suspense fallback={<LoadingSpinner />}>
              <ChordBuilderProvider>
                <Routes>
                  <Route path="/" element={<PracticeMode />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/choose-chords" element={<ChordSelectionInterface />} />
                  <Route path="/create" element={<ChordProgressionBuilder />} />
                  <Route path="/practice" element={<PracticeMode />} />
                  <Route path="/practice/scrolling" element={<ScrollingPractice />} />
                  <Route path="/learn" element={<LearningPathway />} />
                  <Route path="/wheel" element={<ChordWheel />} />
                  <Route path="/help" element={<HelpResources />} />
                  <Route path="/metronome" element={<Metronome />} />
                  <Route path="/classroom" element={<ClassroomMode />} />
                  <Route path="/classroom/enhanced" element={<EnhancedClassroomDashboard />} />
                  <Route path="/classroom/dashboard" element={<TeacherDashboard />} />
                  <Route
                    path="/classroom/games/*"
                    element={
                      <ScoreboardProvider>
                        <TeacherGamesDashboard />
                      </ScoreboardProvider>
                    }
                  >
                    <Route path="example" element={<ExampleGame />} />
                  </Route>
                  <Route path="/profile" element={<ProfilePage />} />
                  <Route path="/theory" element={<ChordProgressionAnalysis />} />
                  <Route path="/student" element={<StudentView />} />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </ChordBuilderProvider>
            </Suspense>
          </main>
        </div>
      </ErrorBoundary>
      </CollaborationProvider>
    </AchievementProvider>
  )
}

export default App
