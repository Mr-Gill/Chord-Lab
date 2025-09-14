import React, { useState, useCallback, useRef } from 'react'
import { useDrag } from 'react-dnd'
import { getPrimaryColor } from '../../utils/diagramTheme'

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
}

const ChordSegment: React.FC<ChordSegmentProps> = ({
  chord,
  angle,
  ring,
  color,
  isSelected,
  isHovered,
  onPreview,
  onHoverEnd
}) => {
  const dragRef = useRef<HTMLDivElement>(null)
  
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
  
  drag(dragRef)

  // Calculate segment dimensions
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
  
  // Create SVG path for the segment
  const pathData = `
    M ${x1} ${y1}
    L ${x2} ${y2}
    A ${outerRadius} ${outerRadius} 0 0 1 ${x3} ${y3}
    L ${x4} ${y4}
    A ${innerRadius} ${innerRadius} 0 0 0 ${x1} ${y1}
    Z
  `
  
  // Calculate text position (middle of segment)
  const textRadius = (innerRadius + outerRadius) / 2
  const textAngle = (angle - 90) * Math.PI / 180
  const textX = centerX + textRadius * Math.cos(textAngle)
  const textY = centerY + textRadius * Math.sin(textAngle)
  
  const opacity = isDragging ? 0.5 : isSelected ? 1 : isHovered ? 0.9 : 0.8
  const strokeWidth = isSelected ? 3 : isHovered ? 2 : 1
  const strokeColor = isSelected ? '#ffffff' : isHovered ? '#ffffff' : 'rgba(255,255,255,0.3)'

  return (
    <>
      {/* Invisible drag handle positioned over the segment */}
      <div
        ref={dragRef}
        style={{
          position: 'absolute',
          left: textX - 30,
          top: textY - 20,
          width: 60,
          height: 40,
          cursor: isDragging ? 'grabbing' : 'grab',
          zIndex: 10,
        }}
        onMouseEnter={() => onPreview(chord)}
        onMouseLeave={onHoverEnd}
        onClick={() => onPreview(chord)} // Add click handler for audio
      />
      
      <g
        style={{ 
          filter: (isHovered || isSelected) ? `drop-shadow(0 0 10px ${color})` : 'none',
          pointerEvents: 'none' // Let the div handle interactions
        }}
      >
      {/* Segment path */}
      <path
        d={pathData}
        fill={color}
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        opacity={opacity}
        className="transition-all duration-200"
      />
      
      {/* Chord label */}
      <text
        x={textX}
        y={textY}
        textAnchor="middle"
        dominantBaseline="middle"
        fill="white"
        fontSize={ring === 'major' ? '16' : '14'}
        fontWeight="bold"
        className="select-none pointer-events-none"
        style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}
      >
        {chord}
      </text>
      
      {/* Glow effect for selected/hovered */}
      {(isHovered || isSelected) && (
        <path
          d={pathData}
          fill="none"
          stroke={color}
          strokeWidth="6"
          opacity="0.4"
          className="animate-pulse"
        />
      )}
      </g>
    </>
  )
}

interface CircularChordWheelProps {
  selectedChords: string[]
  hoveredChord: string | null
  onPreview: (chord: string) => void
  onHoverEnd: () => void
}

export const CircularChordWheel: React.FC<CircularChordWheelProps> = ({
  selectedChords,
  hoveredChord,
  onPreview,
  onHoverEnd
}) => {
  return (
    <div className="flex items-center justify-center w-full h-[500px] relative">
      <svg 
        width="500" 
        height="500" 
        viewBox="0 0 500 500"
        className="w-full h-full max-w-[500px] max-h-[500px]"
      >
        {/* Background circles for reference */}
        <circle
          cx="250"
          cy="250"
          r="200"
          fill="none"
          stroke="rgba(255,255,255,0.1)"
          strokeWidth="1"
        />
        <circle
          cx="250"
          cy="250"
          r="140"
          fill="none"
          stroke="rgba(255,255,255,0.1)"
          strokeWidth="1"
        />
        <circle
          cx="250"
          cy="250"
          r="80"
          fill="none"
          stroke="rgba(255,255,255,0.1)"
          strokeWidth="1"
        />
        
        {/* Center circle with instructions */}
        <circle
          cx="250"
          cy="250"
          r="75"
          fill="rgba(255,255,255,0.9)"
          stroke="rgba(0,0,0,0.1)"
          strokeWidth="2"
        />
        
        {/* Center text */}
        <text
          x="250"
          y="240"
          textAnchor="middle"
          fontSize="12"
          fill="#374151"
          fontWeight="500"
        >
          Drag chords
        </text>
        <text
          x="250"
          y="255"
          textAnchor="middle"
          fontSize="12"
          fill="#374151"
          fontWeight="500"
        >
          to build your
        </text>
        <text
          x="250"
          y="270"
          textAnchor="middle"
          fontSize="12"
          fill="#374151"
          fontWeight="500"
        >
          progression
        </text>
        
        {/* Chord segments */}
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
          />
        ))}
        
        {/* Ring labels */}
        <text
          x="250"
          y="50"
          textAnchor="middle"
          fontSize="14"
          fill="rgba(255,255,255,0.7)"
          fontWeight="600"
        >
          Major Chords
        </text>
        <text
          x="250"
          y="390"
          textAnchor="middle"
          fontSize="12"
          fill="rgba(255,255,255,0.5)"
          fontWeight="500"
        >
          Minor Chords
        </text>
      </svg>
    </div>
  )
}

export default CircularChordWheel