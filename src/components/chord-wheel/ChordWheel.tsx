import React, { useRef } from 'react';
import { useDrag } from 'react-dnd';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useAudioContext } from '../../contexts/AudioProvider';
import './ChordWheel.css';

interface ChordWheelProps {
  chords: string[];
  onChordSelect?: (chord: string) => void;
}

interface ChordItemProps {
  chord: string;
  index: number;
  total: number;
  onChordSelect?: (chord: string) => void;
}

const ChordItem: React.FC<ChordItemProps> = ({ chord, index, total, onChordSelect }) => {
  const { playChord } = useAudioContext();
  const ref = useRef<HTMLDivElement>(null);
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'CHORD',
    item: { chord, index },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  drag(ref);

  const handleClick = () => {
    onChordSelect?.(chord);
    playChord([chord]);
  };

  // Calculate position around the circle
  const angle = (index * (360 / total)) - 90;
  const radius = 120;
  const x = radius * Math.cos(angle * Math.PI / 180);
  const y = radius * Math.sin(angle * Math.PI / 180);

  return (
    <div 
      ref={ref}
      className={`chord-item ${isDragging ? 'dragging' : ''}`}
      onClick={handleClick}
      style={{
        transform: `translate(calc(150px + ${x}px - 50%), calc(150px + ${y}px - 50%))`,
      }}
    >
      {chord}
    </div>
  );
};

const ChordWheel: React.FC<ChordWheelProps> = ({ chords, onChordSelect }) => {
  return (
    <DndProvider backend={HTML5Backend}>
      <div className="chord-wheel">
        {chords.map((chord, index) => (
          <ChordItem 
            key={`${chord}-${index}`} 
            chord={chord} 
            index={index}
            total={chords.length}
            onChordSelect={onChordSelect}
          />
        ))}
      </div>
    </DndProvider>
  );
};

export default ChordWheel;
