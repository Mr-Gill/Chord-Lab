import React, { useRef, useState } from 'react'
import { useDrag } from 'react-dnd'

// Color scheme for different chord families based on Circle of Fifths
const CHORD_COLORS = {
  // Major chords - outer ring
  'C': '#4FC3F7',   // Light blue
  'G': '#66BB6A',   // Green  
  'D': '#FFA726',   // Orange
  'A': '#EF5350',   // Red
  'E': '#AB47BC',   // Purple
  'B': '#5C6BC0',   // Indigo
  'F#': '#26A69A',  // Teal
  'Db': '#29B6F6',  // Blue
  'Ab': '#42A5F5',  // Blue
  'Eb': '#7E57C2',  // Deep purple
  'Bb': '#8D6E63',  // Brown
  'F': '#FF7043',   // Deep orange
  
  // Minor chords - inner ring (darker versions)
  'Am': '#0277BD',  // Dark blue
  'Em': '#388E3C',  // Dark green
  'Bm': '#F57C00',  // Dark orange
  'F#m': '#C62828', // Dark red
  'C#m': '#7B1FA2', // Dark purple
  'G#m': '#303F9F', // Dark indigo
  'D#m': '#00695C', // Dark teal
  'Bbm': '#1565C0', // Dark blue
  'Fm': '#1976D2',  // Dark blue
  'Cm': '#512DA8',  // Dark purple
  'Gm': '#5D4037',  // Dark brown
  'Dm': '#D84315',  // Dark orange
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
  isSelected,
  isHovered,
  onPreview,
  onHoverEnd,
  onChordClick
}) => {
  const ref = useRef<HTMLDivElement>(null)
  const [isClicked, setIsClicked] = useState(false)

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

  const handleClick = () => {
    onChordClick(chord)
    // Visual feedback for click
    setIsClicked(true)
    setTimeout(() => setIsClicked(false), 300)
  }

  // Calculate position based on angle and ring
  const centerX = 250
  const centerY = 250
  const radius = ring === 'major' ? 170 : 110
  const radians = (angle - 90) * (Math.PI / 180) // -90 to start at top
  const x = centerX + radius * Math.cos(radians)
  const y = centerY + radius * Math.sin(radians)

  const size = ring === 'major' ? 50 : 40
  const fontSize = ring === 'major' ? 'text-sm' : 'text-xs'
  
  const opacity = isDragging ? 0.5 : isSelected ? 0.95 : isHovered ? 0.9 : 0.8
  const scale = isDragging ? 1.1 : isClicked ? 1.15 : isHovered ? 1.05 : 1
  const borderWidth = isSelected ? '3px' : isHovered || isClicked ? '2px' : '1px'
  const borderColor = isClicked ? '#fbbf24' : isSelected ? '#ffffff' : isHovered ? '#e5e7eb' : '#d1d5db'

  return (
    <div
      ref={ref}
      style={{
        position: 'absolute',
        left: x - size / 2,
        top: y - size / 2,
        width: size,
        height: size,
        backgroundColor: color,
        borderRadius: '50%',
        border: `${borderWidth} solid ${borderColor}`,
        opacity,
        transform: `scale(${scale})`,
        cursor: isDragging ? 'grabbing' : 'grab',
        transition: 'all 0.2s ease',
        boxShadow: (isHovered || isSelected || isClicked) ? `0 0 20px ${color}40` : 'none',
        zIndex: 10,
      }}
      onMouseEnter={() => onPreview(chord)}
      onMouseLeave={onHoverEnd}
      onClick={handleClick}
      className={`flex items-center justify-center text-white font-bold ${fontSize} select-none`}
    >
      {/* Glow effect for hovered/selected/clicked chords */}
      {(isHovered || isSelected || isClicked) && (
        <div
          style={{
            position: 'absolute',
            inset: '-8px',
            borderRadius: '50%',
            backgroundColor: isClicked ? '#fbbf24' : color,
            opacity: isClicked ? 0.5 : 0.3,
            animation: isClicked ? 'pulse 0.3s ease-out' : 'pulse 2s infinite',
          }}
        />
      )}
      
      <span className="relative z-10">{chord}</span>
      
      {/* Drag indicator */}
      {isDragging && (
        <div
          style={{
            position: 'absolute',
            top: size + 8,
            left: '50%',
            transform: 'translateX(-50%)',
            fontSize: '12px',
            color: '#6b7280',
            whiteSpace: 'nowrap',
          }}
        >
          Dragging...
        </div>
      )}
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
  // Generate SVG path for a segment
  const generateSegmentPath = (angle: number, ring: 'major' | 'minor') => {
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
    
    return `
      M ${x1} ${y1}
      L ${x2} ${y2}
      A ${outerRadius} ${outerRadius} 0 0 1 ${x3} ${y3}
      L ${x4} ${y4}
      A ${innerRadius} ${innerRadius} 0 0 0 ${x1} ${y1}
      Z
    `
  }

  return (
    <div className="flex items-center justify-center w-full h-[500px] relative">
      {/* Background SVG wheel */}
      <svg 
        width="500" 
        height="500" 
        viewBox="0 0 500 500"
        className="w-full h-full max-w-[500px] max-h-[500px] absolute"
      >
        {/* Background segments */}
        {CHORD_WHEEL_DATA.map(({ chord, angle, ring, color }) => {
          const isSelected = selectedChords.includes(chord)
          const isHovered = hoveredChord === chord
          const opacity = isSelected ? 0.8 : isHovered ? 0.6 : 0.4
          
          return (
            <path
              key={`bg-${chord}`}
              d={generateSegmentPath(angle, ring)}
              fill={color}
              opacity={opacity}
              stroke="rgba(255,255,255,0.2)"
              strokeWidth="1"
              className="transition-all duration-200"
            />
          )
        })}
        
        {/* Reference circles */}
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
      
      {/* Draggable chord buttons overlay */}
      {CHORD_WHEEL_DATA.map(({ chord, angle, ring, color }) => (
        <DraggableChordButton
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