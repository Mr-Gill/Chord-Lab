import React, { useRef, useState } from 'react'
import { useDrag } from 'react-dnd'

// Color scheme for different chord families based on Circle of Fifths
const CHORD_COLORS = {
  // Major chords - outer ring (brighter, more saturated colors)
  'C': '#5dade2',   // Bright blue
  'G': '#58d68d',   // Bright green  
  'D': '#f39c12',   // Bright orange
  'A': '#e74c3c',   // Bright red
  'E': '#9b59b6',   // Bright purple
  'B': '#3498db',   // Bright blue
  'F#': '#1abc9c',  // Bright teal
  'Db': '#85c1e9',  // Light blue
  'Ab': '#76d7c4',  // Light teal
  'Eb': '#bb8fce',  // Light purple
  'Bb': '#d7bde2',  // Light lavender
  'F': '#f8c471',   // Light orange
  
  // Minor chords - inner ring (muted, darker versions)
  'Am': '#2980b9',  // Dark blue
  'Em': '#27ae60',  // Dark green
  'Bm': '#d35400',  // Dark orange
  'F#m': '#c0392b', // Dark red
  'C#m': '#8e44ad', // Dark purple
  'G#m': '#2471a3', // Dark blue
  'D#m': '#148f77', // Dark teal
  'Bbm': '#5499c7', // Medium blue
  'Fm': '#52c4a0',  // Medium teal
  'Cm': '#a569bd',  // Medium purple
  'Gm': '#c39bd3',  // Medium lavender
  'Dm': '#f4d03f',  // Medium yellow
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
  const svgRef = useRef<SVGGElement>(null)
  const dragRef = useRef<HTMLDivElement>(null)
  const [isClicked, setIsClicked] = useState(false)
  const [isDragMode, setIsDragMode] = useState(false)

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

  // Connect drag to invisible overlay
  React.useEffect(() => {
    if (dragRef.current) {
      drag(dragRef.current)
    }
  }, [drag])

  const handleClick = () => {
    if (!isDragMode) {
      onChordClick(chord)
      setIsClicked(true)
      setTimeout(() => setIsClicked(false), 300)
    }
  }

  const handleMouseDown = () => {
    setIsDragMode(true)
    setTimeout(() => setIsDragMode(false), 500) // Reset after potential drag
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

  // Calculate position for drag overlay
  const avgRadius = (outerRadius + innerRadius) / 2
  const radians = (angle - 90) * (Math.PI / 180)
  const overlayX = centerX + avgRadius * Math.cos(radians)
  const overlayY = centerY + avgRadius * Math.sin(radians)
  const overlaySize = ring === 'major' ? 50 : 40

  // Dynamic styling based on state
  const opacity = isDragging ? 0.6 : isSelected ? 1 : isHovered ? 0.9 : 0.8
  const strokeWidth = isSelected ? 3 : isHovered || isClicked ? 2 : 1
  const strokeColor = isClicked ? '#fbbf24' : isSelected ? '#ffffff' : isHovered ? '#e5e7eb' : 'rgba(255,255,255,0.3)'
  const fontSize = ring === 'major' ? '14' : '12'
  const fontWeight = isSelected || isHovered ? 'bold' : '600'

  return (
    <>
      {/* Visual SVG segment */}
      <g
        ref={svgRef}
        style={{
          cursor: 'pointer',
          transition: 'all 0.2s ease',
        }}
        onMouseEnter={() => onPreview(chord)}
        onMouseLeave={onHoverEnd}
        onClick={handleClick}
      >
        {/* Main segment */}
        <path
          d={path}
          fill={color}
          opacity={opacity}
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          className="transition-all duration-200"
          style={{
            filter: (isHovered || isSelected || isClicked) ? `drop-shadow(0 0 10px ${color}80)` : 'none',
          }}
        />
        
        {/* Chord name text */}
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
            textShadow: '0 1px 2px rgba(0,0,0,0.8)',
            filter: isClicked ? 'brightness(1.5)' : 'none',
          }}
        >
          {chord}
        </text>
        
        {/* Click glow effect */}
        {isClicked && (
          <path
            d={path}
            fill="none"
            stroke="#fbbf24"
            strokeWidth="3"
            opacity="0.8"
            className="animate-ping"
          />
        )}
      </g>
      
      {/* Drag overlay - only visible during hover/drag */}
      <div
        ref={dragRef}
        style={{
          position: 'absolute',
          left: overlayX - overlaySize / 2,
          top: overlayY - overlaySize / 2,
          width: overlaySize,
          height: overlaySize,
          cursor: 'grab',
          opacity: isHovered || isDragging ? 0.2 : 0,
          backgroundColor: isDragging ? color : 'transparent',
          borderRadius: '50%',
          border: isHovered ? '2px dashed rgba(255,255,255,0.5)' : 'none',
          zIndex: 3,
          pointerEvents: 'auto',
          transition: 'all 0.2s ease',
        }}
        onMouseDown={handleMouseDown}
        onMouseEnter={() => onPreview(chord)}
        onMouseLeave={onHoverEnd}
      />
    </>
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
      {/* SVG-based segmented chord wheel */}
      <svg 
        width="500" 
        height="500" 
        viewBox="0 0 500 500"
        className="w-full h-full max-w-[500px] max-h-[500px] absolute"
        style={{ zIndex: 1 }}
      >
        {/* Reference circles for visual structure */}
        <circle
          cx="250"
          cy="250"
          r="200"
          fill="none"
          stroke="rgba(255,255,255,0.2)"
          strokeWidth="1"
        />
        <circle
          cx="250"
          cy="250"
          r="140"
          fill="none"
          stroke="rgba(255,255,255,0.2)"
          strokeWidth="1"
        />
        <circle
          cx="250"
          cy="250"
          r="80"
          fill="none"
          stroke="rgba(255,255,255,0.2)"
          strokeWidth="1"
        />
        
        {/* Center circle with instructions */}
        <circle
          cx="250"
          cy="250"
          r="75"
          fill="rgba(30, 41, 59, 0.95)"
          stroke="rgba(255,255,255,0.3)"
          strokeWidth="2"
        />
        
        {/* Center text */}
        <text
          x="250"
          y="235"
          textAnchor="middle"
          fontSize="13"
          fill="rgba(255,255,255,0.9)"
          fontWeight="600"
        >
          Drag chords
        </text>
        <text
          x="250"
          y="252"
          textAnchor="middle"
          fontSize="13"
          fill="rgba(255,255,255,0.9)"
          fontWeight="600"
        >
          to build your
        </text>
        <text
          x="250"
          y="269"
          textAnchor="middle"
          fontSize="13"
          fill="rgba(255,255,255,0.9)"
          fontWeight="600"
        >
          progression
        </text>
        
        {/* Ring labels */}
        <text
          x="250"
          y="45"
          textAnchor="middle"
          fontSize="16"
          fill="rgba(255,255,255,0.8)"
          fontWeight="700"
        >
          Major Chords
        </text>
        <text
          x="250"
          y="395"
          textAnchor="middle"
          fontSize="14"
          fill="rgba(255,255,255,0.6)"
          fontWeight="600"
        >
          Minor Chords
        </text>
      </svg>
      
      {/* Chord segments with integrated drag functionality */}
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
    </div>
  )
}

export default HybridChordWheel