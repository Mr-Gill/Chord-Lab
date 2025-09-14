import { Link } from 'react-router-dom';
import { useState } from 'react';

const Dashboard = () => {
  // Sample data for quick practice
  const quickChords = [
    { name: 'C', guitar: [{ string: 2, fret: 1 }, { string: 4, fret: 2 }, { string: 5, fret: 3 }], piano: ['C4', 'E4', 'G4'] },
    { name: 'G', guitar: [{ string: 1, fret: 3 }, { string: 5, fret: 2 }, { string: 6, fret: 3 }], piano: ['G3', 'B3', 'D4'] },
    { name: 'Am', guitar: [{ string: 2, fret: 1 }, { string: 3, fret: 2 }, { string: 4, fret: 2 }], piano: ['A3', 'C4', 'E4'] },
    { name: 'F', guitar: [{ string: 1, fret: 1 }, { string: 2, fret: 1 }, { string: 3, fret: 2 }, { string: 4, fret: 3 }], piano: ['F3', 'A3', 'C4'] }
  ];
  
  const getInitial = (key: string) =>
    typeof window !== 'undefined' && localStorage.getItem(key) === 'true';

  const [toolsOpen, setToolsOpen] = useState(() => getInitial('dashboard-tools-open'));
  const [quickOpen, setQuickOpen] = useState(() => getInitial('dashboard-quick-open'));
  const [wheelOpen, setWheelOpen] = useState(() => getInitial('dashboard-wheel-open'));
  const [statsOpen, setStatsOpen] = useState(() => getInitial('dashboard-stats-open'));

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-blue-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Welcome */}
        <div className="bg-white/80 dark:bg-gray-800/70 backdrop-blur-sm rounded-3xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 p-8 mb-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-extrabold bg-gradient-to-r from-purple-600 via-blue-600 to-emerald-600 bg-clip-text text-transparent mb-2">
              Welcome to Chord Lab
            </h1>
            <p className="text-gray-600 dark:text-gray-300 text-lg">
              Your musical journey starts here ✨
            </p>
          </div>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <Link
              to="/practice"
              className="group relative overflow-hidden flex flex-col items-center justify-center p-8 rounded-2xl bg-gradient-to-br from-purple-500 via-purple-600 to-purple-700 text-white hover:from-purple-600 hover:via-purple-700 hover:to-purple-800 transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
              <span className="text-5xl mb-3 transform group-hover:scale-110 transition-transform duration-300">🎸</span>
              <span className="text-xl font-bold relative z-10">Practice</span>
              <span className="text-sm opacity-90 mt-1 relative z-10">Master your chords</span>
            </Link>
            <Link
              to="/learn"
              className="group relative overflow-hidden flex flex-col items-center justify-center p-8 rounded-2xl bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-600 text-white hover:from-emerald-600 hover:via-emerald-700 hover:to-teal-700 transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
              <span className="text-5xl mb-3 transform group-hover:scale-110 transition-transform duration-300">📘</span>
              <span className="text-xl font-bold relative z-10">Learn</span>
              <span className="text-sm opacity-90 mt-1 relative z-10">Structured lessons</span>
            </Link>
          </div>

          <details
            open={toolsOpen}
            onToggle={(e) => {
              const isOpen = e.currentTarget.open;
              setToolsOpen(isOpen);
              if (typeof window !== 'undefined') {
                localStorage.setItem('dashboard-tools-open', String(isOpen));
              }
            }}
            className="mt-8"
          >
            <summary className="cursor-pointer text-gray-800 dark:text-gray-100 text-lg font-semibold hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
              🔧 More Tools
            </summary>
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Link
                to="/create"
                className="group px-6 py-4 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl text-center"
              >
                <div className="text-2xl mb-1">🎼</div>
                <div className="font-semibold">Chord Builder</div>
              </Link>
              <Link
                to="/practice/scrolling"
                className="group px-6 py-4 rounded-xl bg-gradient-to-r from-teal-500 to-teal-600 text-white hover:from-teal-600 hover:to-teal-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl text-center"
              >
                <div className="text-2xl mb-1">📜</div>
                <div className="font-semibold">Scrolling</div>
              </Link>
              <Link
                to="/metronome"
                className="group px-6 py-4 rounded-xl bg-gradient-to-r from-gray-700 to-gray-800 text-white hover:from-gray-800 hover:to-gray-900 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl text-center"
              >
                <div className="text-2xl mb-1">🥁</div>
                <div className="font-semibold">Metronome</div>
              </Link>
            </div>
          </details>
        </div>

        {/* Quick Practice */}
        <details
          open={quickOpen}
          onToggle={(e) => {
            const isOpen = e.currentTarget.open;
            setQuickOpen(isOpen);
            if (typeof window !== 'undefined') {
              localStorage.setItem('dashboard-quick-open', String(isOpen));
            }
          }}
          className="bg-white/80 dark:bg-gray-800/70 backdrop-blur-sm rounded-3xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 p-8 mb-8"
        >
          <summary className="cursor-pointer text-2xl font-bold text-gray-800 dark:text-gray-100 hover:text-purple-600 dark:hover:text-purple-400 transition-colors open:mb-6">
            ⚡ Quick Practice
          </summary>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
            {quickChords.map((chord, index) => (
              <Link
                key={index}
                to={`/practice?chord=${encodeURIComponent(chord.name)}`}
                className="group p-6 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700/50 dark:to-gray-800/50 border border-gray-200/70 dark:border-gray-600/50 rounded-2xl hover:from-purple-50 hover:to-blue-50 dark:hover:from-purple-900/20 dark:hover:to-blue-900/20 hover:border-purple-300 dark:hover:border-purple-600 transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
              >
                <div className="font-bold text-gray-800 dark:text-gray-200 text-xl mb-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                  {chord.name}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Click to practice
                </div>
              </Link>
            ))}
          </div>
        </details>

        {/* Chord Wheel Preview */}
        <details
          open={wheelOpen}
          onToggle={(e) => {
            const isOpen = e.currentTarget.open;
            setWheelOpen(isOpen);
            if (typeof window !== 'undefined') {
              localStorage.setItem('dashboard-wheel-open', String(isOpen));
            }
          }}
          className="bg-white/80 dark:bg-gray-800/70 backdrop-blur-sm rounded-3xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 p-8 mb-8"
        >
          <summary className="cursor-pointer text-2xl font-bold text-gray-800 dark:text-gray-100 hover:text-purple-600 dark:hover:text-purple-400 transition-colors open:mb-6">
            🎡 Chord Wheel
          </summary>
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6 mt-6">
            <div className="flex-1">
              <p className="text-gray-600 dark:text-gray-300 text-lg">
                Discover chord relationships and explore musical keys with our interactive chord wheel.
              </p>
              <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">
                Perfect for finding chord progressions and understanding music theory.
              </p>
            </div>
            <Link
              to="/wheel"
              className="px-8 py-4 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:from-indigo-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl font-semibold"
            >
              🚀 Open Wheel
            </Link>
          </div>
          <div className="mt-8 flex justify-center">
            {/* Enhanced static mini wheel */}
            <div className="relative">
              <svg viewBox="0 0 200 200" className="w-56 h-56 drop-shadow-lg">
                <defs>
                  <linearGradient id="wheelGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style={{stopColor: '#8B5CF6', stopOpacity: 0.8}} />
                    <stop offset="50%" style={{stopColor: '#3B82F6', stopOpacity: 0.8}} />
                    <stop offset="100%" style={{stopColor: '#10B981', stopOpacity: 0.8}} />
                  </linearGradient>
                </defs>
                <g transform="translate(100,100)">
                  <circle r="85" fill="url(#wheelGradient)" stroke="#fff" strokeWidth="3" />
                  {Array.from({ length: 12 }).map((_, i) => {
                    const angle = -Math.PI / 2 + (Math.PI * 2 / 12) * i;
                    const x = Math.cos(angle) * 85,
                      y = Math.sin(angle) * 85;
                    return (
                      <line
                        key={i}
                        x1={0}
                        y1={0}
                        x2={x}
                        y2={y}
                        stroke="#fff"
                        strokeWidth={2}
                        opacity={0.7}
                      />
                    );
                  })}
                  <circle r="60" fill="#fff" className="dark:fill-gray-800" stroke="#e5e7eb" strokeWidth="2" />
                  <text
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fontSize="14"
                    fill="#374151"
                    className="dark:fill-gray-300"
                    fontWeight={700}
                  >
                    Chord Wheel
                  </text>
                </g>
              </svg>
            </div>
          </div>
        </details>

        {/* Stats */}
        <details
          open={statsOpen}
          onToggle={(e) => {
            const isOpen = e.currentTarget.open;
            setStatsOpen(isOpen);
            if (typeof window !== 'undefined') {
              localStorage.setItem('dashboard-stats-open', String(isOpen));
            }
          }}
          className="mb-8"
        >
          <summary className="cursor-pointer text-2xl font-bold text-gray-800 dark:text-gray-100 hover:text-purple-600 dark:hover:text-purple-400 transition-colors open:mb-6">
            📊 Your Progress
          </summary>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            <div className="bg-white/80 dark:bg-gray-800/70 backdrop-blur-sm rounded-3xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 p-6 transform hover:scale-105 transition-all duration-300">
              <div className="flex items-center">
                <div className="p-4 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl mr-4 shadow-lg">
                  <span className="text-3xl">🎸</span>
                </div>
                <div>
                  <p className="text-gray-600 dark:text-gray-400 font-medium">Chords Learned</p>
                  <p className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">24</p>
                </div>
              </div>
            </div>

            <div className="bg-white/80 dark:bg-gray-800/70 backdrop-blur-sm rounded-3xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 p-6 transform hover:scale-105 transition-all duration-300">
              <div className="flex items-center">
                <div className="p-4 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-2xl mr-4 shadow-lg">
                  <span className="text-3xl">⏱️</span>
                </div>
                <div>
                  <p className="text-gray-600 dark:text-gray-400 font-medium">Practice Time</p>
                  <p className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">12.5h</p>
                </div>
              </div>
            </div>

            <div className="bg-white/80 dark:bg-gray-800/70 backdrop-blur-sm rounded-3xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 p-6 transform hover:scale-105 transition-all duration-300">
              <div className="flex items-center">
                <div className="p-4 bg-gradient-to-br from-purple-400 to-purple-600 rounded-2xl mr-4 shadow-lg">
                  <span className="text-3xl">🏆</span>
                </div>
                <div>
                  <p className="text-gray-600 dark:text-gray-400 font-medium">Achievements</p>
                  <p className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">8</p>
                </div>
              </div>
            </div>
          </div>
        </details>
      </div>
    </div>
  );
};

export default Dashboard;
