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
const PracticeMode = lazy(() => import('./components/practice-mode/PracticeMode'))
const Metronome = lazy(() => import('./components/practice-mode/Metronome'))
const LearningPathway = lazy(() => import('./components/learning-path/LearningPathway'))
const ChordWheel = lazy(() => import('./components/ChordWheel'))
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
  const { theme, setTheme } = useTheme()
  // --- MERGED HOOK (from feature/code-improvements) ---
  const { profile } = useUserProfile()

  const linkBase = 'px-3 py-2 rounded-lg whitespace-nowrap block'
  const linkActive = 'bg-blue-600 text-white'
  const linkIdle = 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'

  const coreNavLinks = (
    <>
      <NavLink to="/" end className={({ isActive }) => `${linkBase} ${isActive ? linkActive : linkIdle}`}>
        Home
      </NavLink>
      <NavLink to="/practice" className={({ isActive }) => `${linkBase} ${isActive ? linkActive : linkIdle}`}>
        Practice
      </NavLink>
      <NavLink to="/learn" className={({ isActive }) => `${linkBase} ${isActive ? linkActive : linkIdle}`}>
        Learn
      </NavLink>
    </>
  )

  const moreNavLinks = (
    <>
      <NavLink to="/create" className={({ isActive }) => `${linkBase} ${isActive ? linkActive : linkIdle}`}>
        Chord Builder
      </NavLink>
      <NavLink
        to="/practice/scrolling"
        className={({ isActive }) => `${linkBase} ${isActive ? linkActive : linkIdle}`}
      >
        Scrolling
      </NavLink>
      <NavLink to="/wheel" className={({ isActive }) => `${linkBase} ${isActive ? linkActive : linkIdle}`}>
        Chord Wheel
      </NavLink>
      <NavLink to="/metronome" className={({ isActive }) => `${linkBase} ${isActive ? linkActive : linkIdle}`}>
        Metronome
      </NavLink>
      <NavLink to="/classroom/enhanced" className={({ isActive }) => `${linkBase} ${isActive ? linkActive : linkIdle}`}>
        Enhanced Classroom
      </NavLink>
      <NavLink to="/classroom" className={({ isActive }) => `${linkBase} ${isActive ? linkActive : linkIdle}`}>
        Classroom
      </NavLink>
      <NavLink to="/profile" className={({ isActive }) => `${linkBase} ${isActive ? linkActive : linkIdle}`}>
        Profile
      </NavLink>
      <NavLink to="/theory" className={({ isActive }) => `${linkBase} ${isActive ? linkActive : linkIdle}`}>
        Theory
      </NavLink>
    </>
  )

  const navLinks = (
    <>
      {coreNavLinks}
      <div className="relative">
        <button
          onClick={() => setIsMoreOpen(!isMoreOpen)}
          className={`${linkBase} ${linkIdle} flex items-center`}
        >
          More
          <svg
            className="w-4 h-4 ml-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 9l6 6 6-6" />
          </svg>
        </button>
        {isMoreOpen && (
          <div className="absolute right-0 mt-2 flex flex-col bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-2 z-20">
            {moreNavLinks}
          </div>
        )}
      </div>
    </>
  )

  return (
    <AchievementProvider>
      <CollaborationProvider>
        <ErrorBoundary>
        <div
          className={`min-h-screen bg-white dark:bg-gray-900 ${
            classroomMode ? 'text-[110%] contrast-125' : ''
          }`}
        >
          {/* --- MERGED JSX (from feature/code-improvements) --- */}
          {!profile.onboardingComplete && <OnboardingFlow />}
          {/* --- MERGED JSX (from main branch) --- */}
          <AchievementToast />
          <header className="bg-white dark:bg-gray-900/80 dark:border-b dark:border-gray-700 shadow-sm relative backdrop-blur-lg">
            <div className="w-full mx-auto px-4 md:px-8 py-3 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="font-extrabold text-xl text-gray-900 dark:text-gray-100">
                  Chord Lab
                </span>
                <nav className="hidden md:flex gap-2">{navLinks}</nav>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={toggleClassroomMode}
                  className={`px-3 py-2 rounded-lg border ${
                    classroomMode
                      ? 'bg-yellow-100 border-yellow-300 text-yellow-900'
                      : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700'
                  }`}
                  title="Classroom Mode: larger text and higher contrast"
                >
                  {classroomMode ? 'Classroom: On' : 'Classroom: Off'}
                </button>
                <button
                  onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
                  className="px-2 py-1 rounded-lg border bg-white border-gray-300 text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
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
                  className="md:hidden px-2 py-1 rounded-lg border bg-white border-gray-300 text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
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
              <nav className="md:hidden bg-white dark:bg-gray-800 shadow-md absolute top-full left-0 right-0 z-10">
                <div className="flex flex-col gap-1 p-2">
                  {coreNavLinks}
                  <details>
                    <summary className={`${linkBase} ${linkIdle} cursor-pointer`}>More</summary>
                    <div className="flex flex-col gap-1 mt-1 pl-4">{moreNavLinks}</div>
                  </details>
                </div>
              </nav>
            )}
          </header>

          <main className="w-full mx-auto px-4 md:px-8 py-6">
            <Suspense fallback={<LoadingSpinner />}>
              <ChordBuilderProvider>
                <Routes>
                  <Route path="/" element={<Dashboard />} />
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
