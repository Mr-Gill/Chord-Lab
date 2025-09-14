import React, { useRef, useState } from 'react'
import { useDrag } from 'react-dnd'

// Improved color scheme matching the reference design - cleaner, more professional
const CHORD_COLORS = {
  // Major chords - outer ring (harmonious, professional colors with better gradients)
  'C': '#4a90e2',   // Professional blue
  'G': '#50c878',   // Professional green  
  'D': '#ff8c42',   // Professional orange
  'A': '#ff6b6b',   // Professional coral red
  'E': '#a855f7',   // Professional purple
  'B': '#3b82f6',   // Professional blue
  'F#': '#14b8a6',  // Professional teal
  'Db': '#60a5fa',  // Light professional blue
  'Ab': '#4fd1c7',  // Light professional teal
  'Eb': '#c084fc',  // Light professional purple
  'Bb': '#d8b4fe',  // Light professional lavender
  'F': '#fbbf24',   // Professional yellow/gold
  
  // Minor chords - inner ring (coordinated darker versions with better contrast)
  'Am': '#1e40af',  // Deep professional blue
  'Em': '#059669',  // Deep professional green
  'Bm': '#ea580c',  // Deep professional orange
  'F#m': '#dc2626', // Deep professional red
  'C#m': '#7c3aed', // Deep professional purple
  'G#m': '#1d4ed8', // Deep professional blue
  'D#m': '#0d9488', // Deep professional teal
  'Bbm': '#2563eb', // Medium professional blue
  'Fm': '#10b981',  // Medium professional teal
  'Cm': '#8b5cf6',  // Medium professional purple
  'Gm': '#a78bfa',  // Medium professional lavender
  'Dm': '#f59e0b',  // Medium professional amber
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

  // Enhanced styling for professional appearance matching reference design
  const opacity = isSelected ? 1 : isHovered ? 0.95 : 0.85
  const strokeWidth = isSelected ? 3 : isHovered || isClicked ? 2.5 : 0.5
  const strokeColor = isClicked ? '#fbbf24' : isSelected ? '#ffffff' : isHovered ? '#ffffff' : 'rgba(255,255,255,0.2)'
  const fontSize = ring === 'major' ? '15' : '13'
  const fontWeight = isSelected || isHovered ? 'bold' : '600'
  
  // Enhanced gradient effect for more professional appearance
  const gradientId = `gradient-${chord}-${ring}`

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
      {/* Gradient definition for this segment */}
      <defs>
        <radialGradient id={gradientId} cx="50%" cy="50%" r="100%">
          <stop offset="0%" style={{ stopColor: color, stopOpacity: 0.9 }} />
          <stop offset="100%" style={{ stopColor: color, stopOpacity: 1 }} />
        </radialGradient>
      </defs>
      
      {/* Main segment with gradient fill */}
      <path
        d={path}
        fill={`url(#${gradientId})`}
        opacity={opacity}
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        className="transition-all duration-300"
        style={{
          filter: (isHovered || isSelected || isClicked) ? `drop-shadow(0 4px 12px ${color}60) brightness(1.1)` : 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))',
        }}
      />
      
      {/* Enhanced chord name text */}
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
          textShadow: '0 2px 4px rgba(0,0,0,0.8)',
          filter: isClicked ? 'brightness(1.5)' : 'none',
        }}
      >
        {chord}
      </text>
      
      {/* Enhanced click glow effect */}
      {isClicked && (
        <path
          d={path}
          fill="none"
          stroke="#fbbf24"
          strokeWidth="4"
          opacity="0.9"
          className="animate-ping"
          style={{
            filter: 'drop-shadow(0 0 8px #fbbf24)',
          }}
        />
      )}
    </g>
  )
}

// Separate draggable button positioned over the segments
interface DraggableChordButtonProps {
  chord: string
  angle: number
  ring: 'major' | 'minor'
  color: string
  isSelected: boolean
  isHovered: boolean
  onPreview: (chord: string) => void
  onHoverEnd: () => void
}

const DraggableChordButton: React.FC<DraggableChordButtonProps> = ({
  chord,
  angle,
  ring,
  color,
  isSelected,
  isHovered,
  onPreview,
  onHoverEnd
}) => {
  const ref = useRef<HTMLDivElement>(null)

  const [{ isDragging }, drag] = useDrag(
    () => ({
      type: 'chord',
      item: () => {
        // Enable pointer events when drag starts
        if (ref.current) {
          ref.current.style.pointerEvents = 'auto';
          ref.current.style.zIndex = '20';
        }
        return { chord };
      },
      collect: (monitor) => ({
        isDragging: !!monitor.isDragging(),
      }),
      end: () => {
        // Disable pointer events when drag ends
        if (ref.current) {
          ref.current.style.pointerEvents = 'none';
          ref.current.style.zIndex = '5';
        }
      },
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
      style={{
        position: 'absolute',
        left: x - size / 2,
        top: y - size / 2,
        width: size,
        height: size,
        cursor: isDragging ? 'grabbing' : 'grab',
        opacity: isDragging ? 0.8 : 0, // Invisible unless dragging
        backgroundColor: isDragging ? color : 'transparent',
        borderRadius: '50%',
        border: isDragging ? '2px solid white' : 'none',
        zIndex: isDragging ? 20 : 5, // Lower z-index when not dragging to allow clicks
        transition: 'all 0.2s ease',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: ring === 'major' ? '12px' : '10px',
        fontWeight: 'bold',
        color: 'white',
        textShadow: '0 1px 2px rgba(0,0,0,0.8)',
        pointerEvents: isDragging ? 'auto' : 'auto', // Always allow events for hover detection
      }}
      onMouseEnter={() => {
        onPreview(chord);
        // Only enable pointer events for dragging when specifically hovering to drag
      }}
      onMouseLeave={() => {
        onHoverEnd();
      }}
      onMouseDown={() => {
        // Enable drag mode on mouse down
        if (ref.current) {
          ref.current.style.pointerEvents = 'auto';
          ref.current.style.zIndex = '20';
        }
      }}
      onMouseUp={() => {
        // Disable drag mode on mouse up
        if (ref.current && !isDragging) {
          ref.current.style.pointerEvents = 'none';
          ref.current.style.zIndex = '5';
        }
      }}
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
        style={{ zIndex: 1 }}
      >
        {/* Enhanced background with subtle gradient */}
        <defs>
          <radialGradient id="wheelBackground" cx="50%" cy="50%" r="50%">
            <stop offset="0%" style={{ stopColor: 'rgba(30, 41, 59, 0.95)', stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: 'rgba(15, 23, 42, 0.98)', stopOpacity: 1 }} />
          </radialGradient>
        </defs>
        
        {/* Professional reference circles for visual structure */}
        <circle
          cx="250"
          cy="250"
          r="200"
          fill="none"
          stroke="rgba(255,255,255,0.15)"
          strokeWidth="0.5"
        />
        <circle
          cx="250"
          cy="250"
          r="140"
          fill="none"
          stroke="rgba(255,255,255,0.15)"
          strokeWidth="0.5"
        />
        <circle
          cx="250"
          cy="250"
          r="80"
          fill="none"
          stroke="rgba(255,255,255,0.15)"
          strokeWidth="0.5"
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
        
        {/* Enhanced center circle with gradient background */}
        <circle
          cx="250"
          cy="250"
          r="75"
          fill="url(#wheelBackground)"
          stroke="rgba(255,255,255,0.2)"
          strokeWidth="1.5"
          style={{
            filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.3))',
          }}
        />
        
        {/* Enhanced center text with better typography */}
        <text
          x="250"
          y="235"
          textAnchor="middle"
          fontSize="12"
          fill="rgba(255,255,255,0.9)"
          fontWeight="600"
          style={{ letterSpacing: '0.5px' }}
        >
          Drag chords
        </text>
        <text
          x="250"
          y="252"
          textAnchor="middle"
          fontSize="12"
          fill="rgba(255,255,255,0.9)"
          fontWeight="600"
          style={{ letterSpacing: '0.5px' }}
        >
          to build your
        </text>
        <text
          x="250"
          y="269"
          textAnchor="middle"
          fontSize="12"
          fill="rgba(255,255,255,0.9)"
          fontWeight="600"
          style={{ letterSpacing: '0.5px' }}
        >
          progression
        </text>
        
        {/* Enhanced ring labels with professional styling */}
        <text
          x="250"
          y="42"
          textAnchor="middle"
          fontSize="16"
          fill="rgba(255,255,255,0.95)"
          fontWeight="700"
          style={{ 
            letterSpacing: '1px',
            textShadow: '0 2px 4px rgba(0,0,0,0.5)'
          }}
        >
          Major Chords
        </text>
        <text
          x="250"
          y="398"
          textAnchor="middle"
          fontSize="14"
          fill="rgba(255,255,255,0.8)"
          fontWeight="600"
          style={{ 
            letterSpacing: '0.8px',
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
        />
      ))}
    </div>
  )
}

export default HybridChordWheel