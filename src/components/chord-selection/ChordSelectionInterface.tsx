import React, { useState, useCallback } from 'react'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { useNavigate } from 'react-router-dom'
import { HybridChordWheel } from './HybridChordWheel'
import { ChordDropZone } from './ChordDropZone'
import { useAudioContext } from '../../contexts/AudioProvider'

interface ChordSelectionInterfaceProps {
  onChordsSelected?: (chords: string[]) => void
}

export const ChordSelectionInterface: React.FC<ChordSelectionInterfaceProps> = ({
  onChordsSelected
}) => {
  const [selectedChords, setSelectedChords] = useState<string[]>([])
  const [hoveredChord, setHoveredChord] = useState<string | null>(null)
  const navigate = useNavigate()
  const { initAudio, playChord } = useAudioContext()

  const handleChordDrop = useCallback((chord: string, index: number) => {
    const newChords = [...selectedChords]
    newChords[index] = chord
    setSelectedChords(newChords)
    onChordsSelected?.(newChords.filter(c => c))

    // Play chord feedback using full chord
    initAudio()
    
    // Import the chord definition to get proper notes
    import('../../data/chords').then(({ chords }) => {
      const chordDef = chords[chord]
      if (chordDef) {
        // Play the full chord using the piano notes from the chord definition
        playChord(chordDef.pianoNotes, 0.6, 'piano')
      } else {
        // Fallback to simple chord construction
        const isMinor = chord.endsWith('m')
        const root = isMinor ? chord.slice(0, -1) : chord
        const NOTE_SEQUENCE = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']
        const rootIndex = NOTE_SEQUENCE.indexOf(root)
        if (rootIndex !== -1) {
          const thirdIndex = (rootIndex + (isMinor ? 3 : 4)) % 12
          const fifthIndex = (rootIndex + 7) % 12
          const notes = [
            `${NOTE_SEQUENCE[rootIndex]}4`,
            `${NOTE_SEQUENCE[thirdIndex]}4`,
            `${NOTE_SEQUENCE[fifthIndex]}4`,
          ]
          playChord(notes, 0.6)
        }
      }
    }).catch(() => {
      // Fallback to simple chord construction if import fails
      const isMinor = chord.endsWith('m')
      const root = isMinor ? chord.slice(0, -1) : chord
      const NOTE_SEQUENCE = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']
      const rootIndex = NOTE_SEQUENCE.indexOf(root)
      if (rootIndex !== -1) {
        const thirdIndex = (rootIndex + (isMinor ? 3 : 4)) % 12
        const fifthIndex = (rootIndex + 7) % 12
        const notes = [
          `${NOTE_SEQUENCE[rootIndex]}4`,
          `${NOTE_SEQUENCE[thirdIndex]}4`,
          `${NOTE_SEQUENCE[fifthIndex]}4`,
        ]
        playChord(notes, 0.6)
      }
    })
  }, [selectedChords, onChordsSelected, initAudio, playChord])

  const handleRemoveChord = useCallback((index: number) => {
    const newChords = [...selectedChords]
    newChords.splice(index, 1)
    setSelectedChords(newChords)
    onChordsSelected?.(newChords)
  }, [selectedChords, onChordsSelected])

  const handleStartPractice = useCallback(() => {
    if (selectedChords.length >= 2) {
      // Navigate to practice mode with selected chords
      const chordsParam = selectedChords.join(',')
      navigate(`/practice?chords=${encodeURIComponent(chordsParam)}`)
    }
  }, [selectedChords, navigate])

  const handleChordPreview = useCallback((chord: string) => {
    setHoveredChord(chord)
    void initAudio()
    
    // Import the chord definition to get proper notes
    import('../../data/chords').then(({ chords }) => {
      const chordDef = chords[chord]
      if (chordDef) {
        // Play the full chord using the piano notes from the chord definition
        playChord(chordDef.pianoNotes, 0.4, 'piano')
      } else {
        // Fallback to simple chord construction
        const isMinor = chord.endsWith('m')
        const root = isMinor ? chord.slice(0, -1) : chord
        const NOTE_SEQUENCE = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']
        const rootIndex = NOTE_SEQUENCE.indexOf(root)
        if (rootIndex !== -1) {
          const thirdIndex = (rootIndex + (isMinor ? 3 : 4)) % 12
          const fifthIndex = (rootIndex + 7) % 12
          const notes = [
            `${NOTE_SEQUENCE[rootIndex]}4`,
            `${NOTE_SEQUENCE[thirdIndex]}4`,
            `${NOTE_SEQUENCE[fifthIndex]}4`,
          ]
          playChord(notes, 0.4)
        }
      }
    }).catch(() => {
      // Fallback to simple chord construction if import fails
      const isMinor = chord.endsWith('m')
      const root = isMinor ? chord.slice(0, -1) : chord
      const NOTE_SEQUENCE = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']
      const rootIndex = NOTE_SEQUENCE.indexOf(root)
      if (rootIndex !== -1) {
        const thirdIndex = (rootIndex + (isMinor ? 3 : 4)) % 12
        const fifthIndex = (rootIndex + 7) % 12
        const notes = [
          `${NOTE_SEQUENCE[rootIndex]}4`,
          `${NOTE_SEQUENCE[thirdIndex]}4`,
          `${NOTE_SEQUENCE[fifthIndex]}4`,
        ]
        playChord(notes, 0.4)
      }
    })
  }, [initAudio, playChord])

  const handleChordClick = useCallback((chord: string) => {
    initAudio()
    
    // Import the chord definition to get proper notes
    import('../../data/chords').then(({ chords }) => {
      const chordDef = chords[chord]
      if (chordDef) {
        // Play the full chord using the piano notes from the chord definition
        playChord(chordDef.pianoNotes, 1.0, 'piano')
      } else {
        // Fallback to simple chord construction
        const isMinor = chord.endsWith('m')
        const root = isMinor ? chord.slice(0, -1) : chord
        const NOTE_SEQUENCE = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']
        const rootIndex = NOTE_SEQUENCE.indexOf(root)
        if (rootIndex !== -1) {
          const thirdIndex = (rootIndex + (isMinor ? 3 : 4)) % 12
          const fifthIndex = (rootIndex + 7) % 12
          const notes = [
            `${NOTE_SEQUENCE[rootIndex]}4`,
            `${NOTE_SEQUENCE[thirdIndex]}4`,
            `${NOTE_SEQUENCE[fifthIndex]}4`,
          ]
          playChord(notes, 1.0)
        }
      }
    }).catch(() => {
      // Fallback to simple chord construction if import fails
      const isMinor = chord.endsWith('m')
      const root = isMinor ? chord.slice(0, -1) : chord
      const NOTE_SEQUENCE = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']
      const rootIndex = NOTE_SEQUENCE.indexOf(root)
      if (rootIndex !== -1) {
        const thirdIndex = (rootIndex + (isMinor ? 3 : 4)) % 12
        const fifthIndex = (rootIndex + 7) % 12
        const notes = [
          `${NOTE_SEQUENCE[rootIndex]}4`,
          `${NOTE_SEQUENCE[thirdIndex]}4`,
          `${NOTE_SEQUENCE[fifthIndex]}4`,
        ]
        playChord(notes, 1.0)
      }
    })
  }, [initAudio, playChord])

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
        {/* Header */}
        <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-lg shadow-lg p-6">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-emerald-600 bg-clip-text text-transparent mb-2">
              Choose Your Chords
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Drag chords from the wheel to build your practice progression. Adjacent chords work well together!
            </p>
          </div>
        </div>

        {/* Main Content - Laptop optimized horizontal layout */}
        <div className="max-w-7xl mx-auto p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 min-h-[700px]">
            
            {/* Chord Wheel - Left side */}
            <div className="lg:col-span-2">
              <div className="bg-white/80 dark:bg-gray-800/70 backdrop-blur-sm rounded-3xl shadow-2xl p-8 h-full">
                <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-6 text-center">
                  Chord Wheel
                </h2>
                
                {/* Chord Wheel using hybrid component */}
                <HybridChordWheel
                  selectedChords={selectedChords}
                  hoveredChord={hoveredChord}
                  onPreview={handleChordPreview}
                  onHoverEnd={() => setHoveredChord(null)}
                  onChordClick={handleChordClick}
                />
              </div>
            </div>

            {/* Chord Selection Area - Right side */}
            <div className="lg:col-span-1">
              <div className="bg-white/80 dark:bg-gray-800/70 backdrop-blur-sm rounded-3xl shadow-2xl p-8 h-full">
                <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-6">
                  Your Progression
                </h2>
                
                {/* Drop zones for chord progression */}
                <div className="space-y-4 mb-8">
                  {[0, 1, 2, 3].map((index) => (
                    <ChordDropZone
                      key={index}
                      index={index}
                      chord={selectedChords[index]}
                      onDrop={handleChordDrop}
                      onRemove={handleRemoveChord}
                      isRequired={index < 2}
                    />
                  ))}
                </div>

                {/* Practice button */}
                <div className="space-y-4">
                  <button
                    onClick={handleStartPractice}
                    disabled={selectedChords.length < 2}
                    className={`w-full py-4 px-6 rounded-xl font-semibold text-white transition-all duration-300 ${
                      selectedChords.length >= 2
                        ? 'bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 transform hover:scale-105 shadow-lg hover:shadow-xl'
                        : 'bg-gray-400 cursor-not-allowed opacity-50'
                    }`}
                  >
                    Start Practice
                    {selectedChords.length > 0 && (() => {
                      const selectedCount = selectedChords.filter(c => c).length;
                      return (
                        <span className="block text-sm opacity-90">
                          {selectedCount} chord{selectedCount !== 1 ? 's' : ''} selected
                        </span>
                      );
                    })()}
                  </button>
                  
                  {selectedChords.length < 2 && (
                    <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                      Select at least 2 chords to start practicing
                    </p>
                  )}
                  
                  {selectedChords.length >= 2 && (
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl">
                      <p className="text-sm text-blue-700 dark:text-blue-300 text-center">
                        💡 <strong>Tip:</strong> Adjacent chords on the wheel work great together!
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DndProvider>
  )
}

export default ChordSelectionInterface