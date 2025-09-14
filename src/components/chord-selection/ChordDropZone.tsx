import React from 'react'
import { useDrop } from 'react-dnd'
import { getChordTheme } from '../../utils/diagramTheme'

interface ChordDropZoneProps {
  index: number
  chord?: string
  onDrop: (chord: string, index: number) => void
  onRemove: (index: number) => void
  isRequired: boolean
}

export const ChordDropZone: React.FC<ChordDropZoneProps> = ({
  index,
  chord,
  onDrop,
  onRemove,
  isRequired,
}) => {
  const [{ isOver, canDrop }, drop] = useDrop(
    () => ({
      accept: 'chord',
      drop: (item: { chord: string }) => {
        onDrop(item.chord, index)
      },
      collect: (monitor) => ({
        isOver: !!monitor.isOver(),
        canDrop: !!monitor.canDrop(),
      }),
    }),
    [index, onDrop]
  )

  const handleRemove = () => {
    if (chord) {
      onRemove(index)
    }
  }

  const borderColor = isOver && canDrop
    ? 'border-green-400 bg-green-50 dark:bg-green-900/20'
    : canDrop
    ? 'border-blue-300 bg-blue-50 dark:bg-blue-900/20'
    : chord
    ? 'border-gray-300 bg-white dark:bg-gray-700 dark:border-gray-600'
    : 'border-dashed border-gray-300 bg-gray-50 dark:bg-gray-800 dark:border-gray-600'

  const theme = chord ? getChordTheme(chord) : null

  return (
    <div
      ref={drop}
      className={`relative p-4 rounded-xl border-2 transition-all duration-200 min-h-[80px] flex items-center justify-between ${borderColor}`}
    >
      <div className="flex items-center space-x-3 flex-1">
        {/* Position number */}
        <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center text-sm font-semibold">
          {index + 1}
        </div>
        
        {/* Chord display or placeholder */}
        {chord ? (
          <div className="flex items-center space-x-3">
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold shadow-lg"
              style={{ backgroundColor: theme?.primary ?? '#6b7280' }}
            >
              {chord}
            </div>
            <div>
              <div className="font-semibold text-gray-800 dark:text-gray-200">
                {chord}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {chord.includes('m') ? 'Minor' : 'Major'}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-full border-2 border-dashed border-gray-300 dark:border-gray-600 flex items-center justify-center">
              <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <div>
              <div className="font-medium text-gray-500 dark:text-gray-400">
                {isRequired ? 'Required' : 'Optional'}
              </div>
              <div className="text-sm text-gray-400 dark:text-gray-500">
                Drop a chord here
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Remove button */}
      {chord && (
        <button
          onClick={handleRemove}
          className="ml-2 p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors duration-200"
          title="Remove chord"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
      
      {/* Drop indicator */}
      {isOver && canDrop && (
        <div className="absolute inset-0 rounded-xl bg-green-400/20 border-2 border-green-400 flex items-center justify-center">
          <div className="bg-green-500 text-white px-3 py-1 rounded-lg text-sm font-medium">
            Drop here
          </div>
        </div>
      )}
    </div>
  )
}

export default ChordDropZone