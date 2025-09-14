import React from 'react'
import { useDrag } from 'react-dnd'

interface DraggableChordProps {
  chord: string
  x: number
  y: number
  color: string
  isHovered: boolean
  isSelected: boolean
  onPreview: (chord: string) => void
  onHoverEnd: () => void
}

export const DraggableChord: React.FC<DraggableChordProps> = ({
  chord,
  x,
  y,
  color,
  isHovered,
  isSelected,
  onPreview,
  onHoverEnd,
}) => {
  const [{ isDragging }, drag, dragPreview] = useDrag(
    () => ({
      type: 'chord',
      item: { chord },
      collect: (monitor) => ({
        isDragging: !!monitor.isDragging(),
      }),
    }),
    [chord]
  )

  const handleMouseEnter = () => {
    onPreview(chord)
  }

  const handleMouseLeave = () => {
    onHoverEnd()
  }

  const radius = 32
  const strokeWidth = isSelected ? 3 : isHovered ? 2 : 1
  const fillOpacity = isDragging ? 0.5 : isSelected ? 0.9 : isHovered ? 0.8 : 0.7
  const transform = isDragging ? 'scale(1.1)' : isHovered ? 'scale(1.05)' : 'scale(1)'

  return (
    <g
      ref={(node) => {
        drag(node)
        dragPreview(node)
      }}
      style={{ cursor: isDragging ? 'grabbing' : 'grab', transformOrigin: `${x}px ${y}px` }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="transition-all duration-200"
    >
      {/* Glow effect for hovered/selected chords */}
      {(isHovered || isSelected) && (
        <circle
          cx={x}
          cy={y}
          r={radius + 4}
          fill={color}
          opacity="0.3"
          className="animate-pulse"
        />
      )}
      
      {/* Main chord circle */}
      <circle
        cx={x}
        cy={y}
        r={radius}
        fill={color}
        fillOpacity={fillOpacity}
        stroke={isSelected ? '#ffffff' : isHovered ? '#e5e7eb' : '#d1d5db'}
        strokeWidth={strokeWidth}
        style={{ transform }}
        className="transition-all duration-200"
      />
      
      {/* Chord label */}
      <text
        x={x}
        y={y}
        textAnchor="middle"
        dominantBaseline="middle"
        className="text-sm font-bold fill-white pointer-events-none select-none"
        style={{ transform }}
      >
        {chord}
      </text>
      
      {/* Drag indicator */}
      {isDragging && (
        <text
          x={x}
          y={y + radius + 20}
          textAnchor="middle"
          className="text-xs fill-gray-500 pointer-events-none"
        >
          Dragging...
        </text>
      )}
    </g>
  )
}

export default DraggableChord