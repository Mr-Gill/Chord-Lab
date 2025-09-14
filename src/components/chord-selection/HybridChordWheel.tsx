import React, { useRef, useState } from 'react'
import { useDrag } from 'react-dnd'

// Chord colors from the standardized color scheme
const CHORD_COLORS = {
  // Major chords - outer ring
  'C': '#cc39bc',
  'G': '#714faa',
  'D': '#3b8bf9',
  'A': '#02c7f9',
  'E': '#00e3e2',
  'B': '#00d48e',
  'F#': '#37b838',
  'Db': '#79c505',
  'Ab': '#fdd500',
  'Eb': '#ff6813',
  'Bb': '#ff4b2c',
  'F': '#ff2a44',
  
  // Minor chords - inner ring
  'Am': '#ab369e',
  'Em': '#624890',
  'Bm': '#3777cf',
  'F#m': '#08a6cf',
  'C#m': '#06bebe',
  'G#m': '#05b17a',
  'D#m': '#339c35',
  'Bbm': '#69a50b',
  'Fm': '#d2b207',
  'Cm': '#d45a16',
  'Gm': '#d4442a',
  'Dm': '#d4293f',
}

// Circle of Fifths layout - 12 positions around the circle
const CHORD_WHEEL_DATA = [
  // Major chords (outer ring)
  { chord: 'C', angle: 0, ring: 'major', color: CHORD_COLORS.C },
  { chord: 'G', angle: 30, ring: 'major', color: CHORD_COLORS.G },
  { chord: 'D', angle: 60, ring: 'major', color: CHORD_COLORS.D },
  { chord: 'A', angle: 90, ring: 'major', color: CHORD_COLORS.A },
  { chord: 'E', angle: 120, ring: 'major', color: CHORD_COLORS.E },
  { chord: 'B', angle: 150, ring: 'major', color: CHORD_COLORS.B },
  { chord: 'F#', angle: 180, ring: 'major', color: CHORD_COLORS['F#'] },
  { chord: 'Db', angle: 210, ring: 'major', color: CHORD_COLORS.Db },
  { chord: 'Ab', angle: 240, ring: 'major', color: CHORD_COLORS.Ab },
  { chord: 'Eb', angle: 270, ring: 'major', color: CHORD_COLORS.Eb },
  { chord: 'Bb', angle: 300, ring: 'major', color: CHORD_COLORS.Bb },
  { chord: 'F', angle: 330, ring: 'major', color: CHORD_COLORS.F },
  
  // Minor chords (inner ring) - relative minors
  { chord: 'Am', angle: 0, ring: 'minor', color: CHORD_COLORS.Am },
  { chord: 'Em', angle: 30, ring: 'minor', color: CHORD_COLORS.Em },
  { chord: 'Bm', angle: 60, ring: 'minor', color: CHORD_COLORS.Bm },
  { chord: 'F#m', angle: 90, ring: 'minor', color: CHORD_COLORS['F#m'] },
  { chord: 'C#m', angle: 120, ring: 'minor', color: CHORD_COLORS['C#m'] },
  { chord: 'G#m', angle: 150, ring: 'minor', color: CHORD_COLORS['G#m'] },
  { chord: 'D#m', angle: 180, ring: 'minor', color: CHORD_COLORS['D#m'] },
  { chord: 'Bbm', angle: 210, ring: 'minor', color: CHORD_COLORS.Bbm },
  { chord: 'Fm', angle: 240, ring: 'minor', color: CHORD_COLORS.Fm },
  { chord: 'Cm', angle: 270, ring: 'minor', color: CHORD_COLORS.Cm },
  { chord: 'Gm', angle: 300, ring: 'minor', color: CHORD_COLORS.Gm },
  { chord: 'Dm', angle: 330, ring: 'minor', color: CHORD_COLORS.Dm },
]

interface ChordSegmentProps {
  chord: string
  angle: number
  ring: 'major' | 'minor'
  color: string
  isSelected: boolean
  isHovered: boolean
  onPreview: (chord: string) => void
  onHoverEnd: () => void
  onChordClick: (chord: string) => void
}

const ChordSegment: React.FC<ChordSegmentProps> = ({
  chord,
  angle,
  ring,
  color,
  isSelected,
  isHovered,
  onPreview,
  onHoverEnd,
  onChordClick
}) => {
  const [isClicked, setIsClicked] = useState(false)

  const handleClick = () => {
    onChordClick(chord)
    setIsClicked(true)
    setTimeout(() => setIsClicked(false), 300)
  }

  // Calculate segment path and text position
  const centerX = 250
  const centerY = 250
  const outerRadius = ring === 'major' ? 200 : 140
  const innerRadius = ring === 'major' ? 140 : 80
  const segmentAngle = 30 // 360/12 = 30 degrees per segment
  
  // Convert to radians and adjust for SVG coordinate system (start from top)
  const startAngle = (angle - 90 - segmentAngle/2) * Math.PI / 180
  const endAngle = (angle - 90 + segmentAngle/2) * Math.PI / 180
  
  // Calculate path points
  const x1 = centerX + innerRadius * Math.cos(startAngle)
  const y1 = centerY + innerRadius * Math.sin(startAngle)
  const x2 = centerX + outerRadius * Math.cos(startAngle)
  const y2 = centerY + outerRadius * Math.sin(startAngle)
  const x3 = centerX + outerRadius * Math.cos(endAngle)
  const y3 = centerY + outerRadius * Math.sin(endAngle)
  const x4 = centerX + innerRadius * Math.cos(endAngle)
  const y4 = centerY + innerRadius * Math.sin(endAngle)
  
  const path = `
    M ${x1} ${y1}
    L ${x2} ${y2}
    A ${outerRadius} ${outerRadius} 0 0 1 ${x3} ${y3}
    L ${x4} ${y4}
    A ${innerRadius} ${innerRadius} 0 0 0 ${x1} ${y1}
    Z
  `

  // Calculate text position (middle of the segment)
  const textRadius = (outerRadius + innerRadius) / 2
  const textAngle = (angle - 90) * Math.PI / 180
  const textX = centerX + textRadius * Math.cos(textAngle)
  const textY = centerY + textRadius * Math.sin(textAngle)

  // Enhanced styling matching the reference image - clean, professional appearance
  const opacity = isSelected ? 1 : isHovered ? 0.95 : 0.9
  const strokeWidth = isSelected ? 2.5 : isHovered || isClicked ? 2 : 1.5
  const strokeColor = isClicked ? '#ffffff' : isSelected ? '#ffffff' : isHovered ? '#ffffff' : 'rgba(255,255,255,0.4)'
  const fontSize = ring === 'major' ? '14' : '12'
  const fontWeight = isSelected || isHovered ? 'bold' : '600'
  
  // Professional gradient effects matching reference design
  const gradientId = `gradient-${chord}-${ring}`
  const shadowId = `shadow-${chord}-${ring}`

  return (
    <g
      style={{
        cursor: 'pointer',
        transition: 'all 0.3s ease',
      }}
      onMouseEnter={() => onPreview(chord)}
      onMouseLeave={onHoverEnd}
      onClick={handleClick}
    >
      {/* Enhanced gradient and shadow definitions for reference-style appearance */}
      <defs>
        <radialGradient id={gradientId} cx="50%" cy="30%" r="80%">
          <stop offset="0%" style={{ stopColor: color, stopOpacity: 1 }} />
          <stop offset="70%" style={{ stopColor: color, stopOpacity: 0.9 }} />
          <stop offset="100%" style={{ stopColor: color, stopOpacity: 0.8 }} />
        </radialGradient>
        <filter id={shadowId} x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.3"/>
        </filter>
      </defs>
      
      {/* Main segment with enhanced styling matching reference */}
      <path
        d={path}
        fill={`url(#${gradientId})`}
        opacity={opacity}
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        filter={`url(#${shadowId})`}
        className="transition-all duration-300"
        style={{
          filter: (isHovered || isSelected || isClicked) ? 
            `drop-shadow(0 4px 12px ${color}40) brightness(1.05)` : 
            `drop-shadow(0 1px 3px rgba(0,0,0,0.2))`,
        }}
      />
      
      {/* Enhanced chord name text with better readability */}
      <text
        x={textX}
        y={textY}
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={fontSize}
        fontWeight={fontWeight}
        fill="white"
        className="select-none pointer-events-none"
        style={{
          textShadow: '0 2px 4px rgba(0,0,0,0.7), 0 1px 2px rgba(0,0,0,0.9)',
          filter: isClicked ? 'brightness(1.3)' : 'none',
          letterSpacing: '0.5px'
        }}
      >
        {chord}
      </text>
      
      {/* Enhanced interaction feedback */}
      {isClicked && (
        <path
          d={path}
          fill="none"
          stroke="rgba(255,255,255,0.8)"
          strokeWidth="3"
          opacity="0.8"
          className="animate-ping"
          style={{
            filter: 'drop-shadow(0 0 8px rgba(255,255,255,0.6))',
          }}
        />
      )}
    </g>
  )
}

// Enhanced draggable overlay that provides drag functionality without interfering with clicks
interface DraggableChordButtonProps {
  chord: string
  angle: number
  ring: 'major' | 'minor'
  color: string
  isSelected: boolean
  isHovered: boolean
  onPreview: (chord: string) => void
  onHoverEnd: () => void
  onChordClick: (chord: string) => void
}

const DraggableChordButton: React.FC<DraggableChordButtonProps> = ({
  chord,
  angle,
  ring,
  color,
  onPreview,
  onHoverEnd,
  onChordClick
}) => {
  const ref = useRef<HTMLDivElement>(null)

  const [{ isDragging }, drag] = useDrag(
    () => ({
      type: 'chord',
      item: { chord },
      collect: (monitor) => ({
        isDragging: !!monitor.isDragging(),
      }),
    }),
    [chord]
  )

  drag(ref)

  // Calculate position based on angle and ring to match segment
  const centerX = 250
  const centerY = 250
  const outerRadius = ring === 'major' ? 200 : 140
  const innerRadius = ring === 'major' ? 140 : 80
  const radius = (outerRadius + innerRadius) / 2
  const radians = (angle - 90) * (Math.PI / 180)
  const x = centerX + radius * Math.cos(radians)
  const y = centerY + radius * Math.sin(radians)

  const size = ring === 'major' ? 50 : 40
  
  return (
    <div
      ref={ref}
      data-chord={chord}
      style={{
        position: 'absolute',
        left: x - size / 2,
        top: y - size / 2,
        width: size,
        height: size,
        cursor: isDragging ? 'grabbing' : 'grab',
        opacity: isDragging ? 0.8 : 0.3, // Semi-visible for drag functionality
        backgroundColor: isDragging ? color : 'transparent',
        borderRadius: '50%',
        border: isDragging ? '2px solid white' : '1px solid rgba(255,255,255,0.2)',
        zIndex: isDragging ? 20 : 2, // Higher z-index to enable drag
        transition: 'all 0.2s ease',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: ring === 'major' ? '12px' : '10px',
        fontWeight: 'bold',
        color: 'white',
        textShadow: '0 1px 2px rgba(0,0,0,0.8)',
        pointerEvents: 'auto', // Always allow drag events
      }}
      onMouseEnter={() => onPreview(chord)}
      onMouseLeave={onHoverEnd}
      onClick={() => onChordClick(chord)}
    >
      {isDragging && chord}
    </div>
  )
}


interface HybridChordWheelProps {
  selectedChords: string[]
  hoveredChord: string | null
  onPreview: (chord: string) => void
  onHoverEnd: () => void
  onChordClick: (chord: string) => void
}

export const HybridChordWheel: React.FC<HybridChordWheelProps> = ({
  selectedChords,
  hoveredChord,
  onPreview,
  onHoverEnd,
  onChordClick
}) => {
  return (
    <div className="flex items-center justify-center w-full h-[500px] relative">
      {/* SVG-based segmented chord wheel with enhanced styling */}
      <svg 
        width="500" 
        height="500" 
        viewBox="0 0 500 500"
        className="w-full h-full max-w-[500px] max-h-[500px] absolute"
        style={{ zIndex: 0 }} // Lower z-index to allow draggable buttons to work
      >
        {/* Enhanced background with subtle effects matching reference style */}
        <defs>
          <radialGradient id="wheelBackground" cx="50%" cy="50%" r="50%">
            <stop offset="0%" style={{ stopColor: 'rgba(15, 23, 42, 0.95)', stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: 'rgba(30, 41, 59, 0.98)', stopOpacity: 1 }} />
          </radialGradient>
          <filter id="wheelShadow" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="0" dy="4" stdDeviation="8" floodOpacity="0.3"/>
          </filter>
        </defs>
        
        {/* Clean reference circles for visual structure */}
        <circle
          cx="250"
          cy="250"
          r="200"
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth="1"
        />
        <circle
          cx="250"
          cy="250"
          r="140"
          fill="none"
          stroke="rgba(255,255,255,0.12)"
          strokeWidth="1.5"
        />
        <circle
          cx="250"
          cy="250"
          r="80"
          fill="none"
          stroke="rgba(255,255,255,0.15)"
          strokeWidth="1.5"
        />
        
        {/* Chord segments - enhanced visual design */}
        {CHORD_WHEEL_DATA.map(({ chord, angle, ring, color }) => (
          <ChordSegment
            key={chord}
            chord={chord}
            angle={angle}
            ring={ring}
            color={color}
            isSelected={selectedChords.includes(chord)}
            isHovered={hoveredChord === chord}
            onPreview={onPreview}
            onHoverEnd={onHoverEnd}
            onChordClick={onChordClick}
          />
        ))}
        
        {/* Enhanced center circle with sophisticated styling */}
        <circle
          cx="250"
          cy="250"
          r="75"
          fill="url(#wheelBackground)"
          stroke="rgba(255,255,255,0.25)"
          strokeWidth="2"
          filter="url(#wheelShadow)"
          style={{
            filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.4))',
          }}
        />
        
        {/* Enhanced center text with reference-style typography */}
        <text
          x="250"
          y="235"
          textAnchor="middle"
          fontSize="11"
          fill="rgba(255,255,255,0.95)"
          fontWeight="600"
          style={{ letterSpacing: '0.8px' }}
        >
          Drag chords
        </text>
        <text
          x="250"
          y="252"
          textAnchor="middle"
          fontSize="11"
          fill="rgba(255,255,255,0.95)"
          fontWeight="600"
          style={{ letterSpacing: '0.8px' }}
        >
          to build your
        </text>
        <text
          x="250"
          y="269"
          textAnchor="middle"
          fontSize="11"
          fill="rgba(255,255,255,0.95)"
          fontWeight="600"
          style={{ letterSpacing: '0.8px' }}
        >
          progression
        </text>
        
        {/* Enhanced ring labels with reference-style positioning and typography */}
        <text
          x="250"
          y="40"
          textAnchor="middle"
          fontSize="15"
          fill="rgba(255,255,255,0.9)"
          fontWeight="700"
          style={{ 
            letterSpacing: '1.2px',
            textShadow: '0 2px 4px rgba(0,0,0,0.5)'
          }}
        >
          Major Chords
        </text>
        <text
          x="250"
          y="400"
          textAnchor="middle"
          fontSize="13"
          fill="rgba(255,255,255,0.75)"
          fontWeight="600"
          style={{ 
            letterSpacing: '1px',
            textShadow: '0 1px 2px rgba(0,0,0,0.5)'
          }}
        >
          Minor Chords
        </text>
      </svg>
      
      {/* Invisible draggable buttons for drag-and-drop functionality */}
      {CHORD_WHEEL_DATA.map(({ chord, angle, ring, color }) => (
        <DraggableChordButton
          key={`drag-${chord}`}
          chord={chord}
          angle={angle}
          ring={ring}
          color={color}
          isSelected={selectedChords.includes(chord)}
          isHovered={hoveredChord === chord}
          onPreview={onPreview}
          onHoverEnd={onHoverEnd}
          onChordClick={onChordClick}
        />
      ))}
    </div>
  )
}

export default HybridChordWheel