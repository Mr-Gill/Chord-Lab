import React, { useRef } from 'react'
import { useDrag } from 'react-dnd'

interface DraggableChordButtonProps {
  chord: string
  x: number
  y: number
  color: string
  isHovered: boolean
  isSelected: boolean
  onPreview: (chord: string) => void
  onHoverEnd: () => void
}

export const DraggableChordButton: React.FC<DraggableChordButtonProps> = ({
  chord,
  x,
  y,
  color,
  isHovered,
  isSelected,
  onPreview,
  onHoverEnd,
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

  const handleMouseEnter = () => {
    onPreview(chord)
  }

  const handleMouseLeave = () => {
    onHoverEnd()
  }

  const size = 64
  const opacity = isDragging ? 0.5 : isSelected ? 0.95 : isHovered ? 0.9 : 0.8
  const scale = isDragging ? 1.1 : isHovered ? 1.05 : 1
  const borderWidth = isSelected ? '3px' : isHovered ? '2px' : '1px'

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
        border: `${borderWidth} solid ${isSelected ? '#ffffff' : isHovered ? '#e5e7eb' : '#d1d5db'}`,
        opacity,
        transform: `scale(${scale})`,
        cursor: isDragging ? 'grabbing' : 'grab',
        transition: 'all 0.2s ease',
        boxShadow: (isHovered || isSelected) ? `0 0 20px ${color}40` : 'none',
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="flex items-center justify-center text-white font-bold text-sm select-none"
    >
      {/* Glow effect for hovered/selected chords */}
      {(isHovered || isSelected) && (
        <div
          style={{
            position: 'absolute',
            inset: '-8px',
            borderRadius: '50%',
            backgroundColor: color,
            opacity: 0.3,
            animation: 'pulse 2s infinite',
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

export default DraggableChordButton