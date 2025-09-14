import { useMemo, useState, useRef, type KeyboardEvent, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { getChordTheme } from '../utils/diagramTheme'
import { useAudioContext } from '../contexts/AudioProvider'

// Simple, responsive chord wheel with majors on outer ring and relative minors on inner ring
// Colors pulled from getChordTheme to ensure consistency with diagrams and archived palette

const MAJORS_ORDER = ['C','G','D','A','E','B','F#','Db','Ab','Eb','Bb','F']
const RELATIVE_MINORS = {
  C: 'Am',
  G: 'Em',
  D: 'Bm',
  A: 'F#m',
  E: 'C#m',
  B: 'G#m',
  'F#': 'D#m',
  Db: 'Bbm',
  Ab: 'Fm',
  Eb: 'Cm',
  Bb: 'Gm',
  F: 'Dm',
} as const

function polar(cx: number, cy: number, r: number, a: number) {
  return [cx + r * Math.cos(a), cy + r * Math.sin(a)]
}

function ringSectorPath(r0: number, r1: number, a0: number, a1: number): string {
  const largeArc = a1 - a0 > Math.PI ? 1 : 0
  const [x0, y0] = polar(0, 0, r0, a0)
  const [x1, y1] = polar(0, 0, r1, a0)
  const [x2, y2] = polar(0, 0, r1, a1)
  const [x3, y3] = polar(0, 0, r0, a1)
  return [
    `M ${x1} ${y1}`,
    `A ${r1} ${r1} 0 ${largeArc} 1 ${x2} ${y2}`,
    `L ${x3} ${y3}`,
    `A ${r0} ${r0} 0 ${largeArc} 0 ${x0} ${y0}`,
    'Z',
  ].join(' ')
}

export default function ChordWheel() {
  const size = 600
  const cx = size / 2
  const cy = size / 2
  const rOuter = 270
  const rMid = 200
  const rInner = 130

  const step = (Math.PI * 2) / 12

  const [selected, setSelected] = useState<string>('C')
  const [activeKey, setActiveKey] = useState<string>('C')
  const [hovered, setHovered] = useState<number | null>(null)
  const { initAudio, playChord } = useAudioContext()
  const throttleRef = useRef(false)
  const navigate = useNavigate()

  const items = useMemo(() => {
    return MAJORS_ORDER.map((maj, i) => {
      const a0 = -Math.PI / 2 + i * step
      const a1 = a0 + step
      const min = RELATIVE_MINORS[maj as keyof typeof RELATIVE_MINORS]
      return { maj, min, i, a0, a1 }
    })
  }, [step])

  // Memoize NOTE_SEQUENCE to prevent re-creation on every render
  const NOTE_SEQUENCE = useMemo(() => [
    'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'
  ], []);

  const chordToNotes = useCallback((name: string): string[] => {
    const isMinor = name.endsWith('m')
    const root = isMinor ? name.slice(0, -1) : name
    const rootIndex = NOTE_SEQUENCE.indexOf(root)
    if (rootIndex === -1) return []
    const thirdIndex = (rootIndex + (isMinor ? 3 : 4)) % 12
    const fifthIndex = (rootIndex + 7) % 12
    return [
      `${NOTE_SEQUENCE[rootIndex]}4`,
      `${NOTE_SEQUENCE[thirdIndex]}4`,
      `${NOTE_SEQUENCE[fifthIndex]}4`,
    ]
  }, [NOTE_SEQUENCE])

  const onSelect = useCallback((name: string) => {
    setSelected(name)
    initAudio()
    if (!throttleRef.current) {
      const notes = chordToNotes(name)
      if (notes.length > 0) {
        playChord(notes, 0.8)
      }
      throttleRef.current = true
      setTimeout(() => {
        throttleRef.current = false
      }, 300)
    }
  }, [setSelected, initAudio, playChord, chordToNotes])

  const handleKeyDown = useCallback((chord: string) => (e: KeyboardEvent<SVGGElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      onSelect(chord)
    }
  }, [onSelect])

  // In a major key: I, IV, V majors; ii, iii, vi minors are commonly diatonic
  const diatonic = useMemo(() => {
    const idx = MAJORS_ORDER.indexOf(activeKey)
    if (idx === -1) return { majors: new Set<string>(), minors: new Set<string>() }
    const I = MAJORS_ORDER[idx]
    const V = MAJORS_ORDER[(idx + 1) % 12]
    const IV = MAJORS_ORDER[(idx + 12 - 1) % 12]
    const majors = new Set<string>([I, IV, V])
    const minors = new Set<string>([
      RELATIVE_MINORS[I as keyof typeof RELATIVE_MINORS],
      RELATIVE_MINORS[V as keyof typeof RELATIVE_MINORS],
      RELATIVE_MINORS[IV as keyof typeof RELATIVE_MINORS],
    ])
    return { majors, minors }
  }, [activeKey])

  return (
    <div className="w-full bg-white dark:bg-gray-800/50 rounded-2xl shadow-lg p-4 md:p-8">
      {/* Key-first workflow header */}
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">🗝️ Chord Wheel</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Pick a key from the wheel. Diatonic chords (I, ii, iii, IV, V, vi) are emphasized.
        </p>
        <div className="flex justify-center">
          <select
            id="key-selector"
            value={activeKey}
            onChange={e => setActiveKey(e.target.value)}
            className="px-4 py-2 text-lg font-semibold border-2 border-gray-300 rounded-lg bg-white text-gray-800 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {MAJORS_ORDER.map(k => (
              <option key={k} value={k}>
                {k} major
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="w-full flex justify-center">
        <svg viewBox={`0 0 ${size} ${size}`} className="w-full h-auto">
          <defs>
            <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          <g transform={`translate(${cx}, ${cy})`}>
            {/* Rings */}
            {items.map(({ maj, min, a0, a1, i }) => {
              const majColor = getChordTheme(maj).primary
              const minColor = getChordTheme(min).primary
              const outer = ringSectorPath(rMid, rOuter, a0, a1)
              const inner = ringSectorPath(rInner, rMid, a0, a1)
              const ac = (a0 + a1) / 2
              const [lxMaj, lyMaj] = polar(0, 0, (rMid + rOuter) / 2, ac)
              const [lxMin, lyMin] = polar(0, 0, (rInner + rMid) / 2, ac)
              const isDiaMaj = diatonic.majors.has(maj)
              const isDiaMin = diatonic.minors.has(min)
              const isHovered = hovered === i

              return (
                <g key={maj} data-testid={`sector-${maj}`}>
                  {/* Major sector */}
                  <g
                    role="button"
                    tabIndex={0}
                    aria-label={`Select ${maj} major`}
                    onClick={() => onSelect(maj)}
                    onKeyDown={handleKeyDown(maj)}
                    onMouseEnter={() => setHovered(i)}
                    onMouseLeave={() => setHovered(null)}
                    onFocus={() => setHovered(i)}
                    onBlur={() => setHovered(null)}
                    className="focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-900 dark:focus-visible:outline-white"
                    style={{ cursor: 'pointer' }}
                  >
                    <path
                      d={outer}
                      fill={majColor}
                      fillOpacity={isDiaMaj ? 1 : 0.3}
                      stroke="#ffffff"
                      strokeOpacity={isDiaMaj ? 0.8 : 0.3}
                      strokeWidth={isDiaMaj ? 3 : 1}
                      filter={isDiaMaj || isHovered ? 'url(#glow)' : undefined}
                      style={{ transition: 'all 150ms ease-out' }}
                    />
                    <text
                      x={lxMaj}
                      y={lyMaj}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fontSize={18}
                      fontWeight={800}
                      fill="#ffffff"
                      opacity={isDiaMaj ? 1 : 0.5}
                      style={{ pointerEvents: 'none', textShadow: '0 1px 2px rgba(0,0,0,0.3)' }}
                    >
                      {maj}
                    </text>
                  </g>

                  {/* Minor sector */}
                  <g
                    role="button"
                    tabIndex={0}
                    aria-label={`Select ${min} minor`}
                    onClick={() => onSelect(min)}
                    onKeyDown={handleKeyDown(min)}
                    onMouseEnter={() => setHovered(i)}
                    onMouseLeave={() => setHovered(null)}
                    onFocus={() => setHovered(i)}
                    onBlur={() => setHovered(null)}
                    className="focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-900 dark:focus-visible:outline-white"
                    style={{ cursor: 'pointer' }}
                  >
                    <path
                      d={inner}
                      fill={minColor}
                      fillOpacity={isDiaMin ? 1 : 0.3}
                      stroke="#ffffff"
                      strokeOpacity={isDiaMin ? 0.8 : 0.3}
                      strokeWidth={isDiaMin ? 3 : 1}
                      filter={isDiaMin || isHovered ? 'url(#glow)' : undefined}
                      style={{ transition: 'all 150ms ease-out' }}
                    />
                    <text
                      x={lxMin}
                      y={lyMin}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fontSize={14}
                      fontWeight={800}
                      fill="#ffffff"
                      opacity={isDiaMin ? 1 : 0.5}
                      style={{ pointerEvents: 'none', textShadow: '0 1px 2px rgba(0,0,0,0.3)' }}
                    >
                      {min}
                    </text>
                  </g>
                </g>
              )
            })}

            {/* Center readout */}
            <circle
              r={rInner - 18}
              fill="#ffffff"
              className="dark:fill-gray-700"
              stroke="#e5e7eb"
              strokeWidth={2}
            />
            <text
              textAnchor="middle"
              dominantBaseline="central"
              fontSize={24}
              fontWeight={800}
              fill="#111827"
              className="dark:fill-gray-100"
            >
              {selected}
            </text>
          </g>
        </svg>
      </div>
      
      {/* Roman numeral legend */}
      <div className="mt-4 mb-6">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 text-center mb-3">
          🎵 Roman Numeral Reference
        </h3>
        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
          <div className="grid grid-cols-2 md:grid-cols-6 gap-3 text-center text-sm">
            {[
              { roman: 'I', type: 'Major', description: 'Tonic' },
              { roman: 'ii', type: 'minor', description: 'Supertonic' },
              { roman: 'iii', type: 'minor', description: 'Mediant' },
              { roman: 'IV', type: 'Major', description: 'Subdominant' },
              { roman: 'V', type: 'Major', description: 'Dominant' },
              { roman: 'vi', type: 'minor', description: 'Submediant' },
            ].map(({ roman, type, description }) => (
              <div key={roman} className="bg-white dark:bg-gray-600 rounded-md p-2 border">
                <div className={`font-bold text-lg ${type === 'Major' ? 'text-blue-600' : 'text-purple-600'}`}>
                  {roman}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-300">
                  {type}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {description}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <div className="mt-4 space-y-3">
        <p className="text-sm text-gray-700 dark:text-gray-400 text-center">
          <span className="font-semibold">In {activeKey} major</span>, diatonic chords are fully colored with white text.
          <br />
          Non-diatonic chords are dimmed. Outer ring = majors; inner ring = relative minors.
        </p>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => void navigate(`/practice?key=${encodeURIComponent(activeKey)}`)}
            className="px-3 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
          >
            Practice in {activeKey}
          </button>
          <button
            onClick={() => void navigate(`/practice?chord=${encodeURIComponent(selected)}`)}
            className="px-3 py-2 rounded-lg bg-gray-900 text-white hover:bg-black dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-white"
          >
            Practice {selected}
          </button>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-500 text-center">
          💡 Key-first workflow: Pick a key above to see diatonic chords emphasized in full color.
          Click any chord to hear it and practice.
        </p>
      </div>
    </div>
  )
}
