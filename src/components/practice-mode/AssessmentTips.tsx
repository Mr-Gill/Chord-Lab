import { type FC } from 'react';

interface AssessmentTipsProps {
  assessmentType: 'year7' | 'year8';
}

const AssessmentTips: FC<AssessmentTipsProps> = ({ assessmentType }) => {
  if (assessmentType === 'year7') {
    return (
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-700 rounded-xl p-6 mb-6">
        <h3 className="text-lg font-bold text-blue-800 dark:text-blue-300 mb-4 flex items-center">
          🎯 Year 7 Assessment Criteria
        </h3>
        
        <div className="space-y-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
            <h4 className="font-semibold text-blue-700 dark:text-blue-400 mb-2">🎼 Playing Chords Correctly</h4>
            <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
              Playing the right notes at the right time with correct finger positions.
            </p>
            <div className="text-xs text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 rounded p-2">
              <strong>To get a great mark:</strong> Play all four chords (C-G-Am-F) correctly with good finger positions.
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
            <h4 className="font-semibold text-blue-700 dark:text-blue-400 mb-2">🎨 Smooth Chord Changes</h4>
            <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
              Moving from one chord to the next without stopping or losing the beat.
            </p>
            <div className="text-xs text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 rounded p-2">
              <strong>To get a great mark:</strong> Change between chords smoothly without big gaps and stay in time with the backing track.
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
            <h4 className="font-semibold text-blue-700 dark:text-blue-400 mb-2">🎭 Performance Confidence & Musicality</h4>
            <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
              Showing engagement with the music and adding your own simple style.
            </p>
            <div className="text-xs text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 rounded p-2">
              <strong>To get a great mark:</strong> Perform with confidence and add your own simple musical style.
            </div>
          </div>
        </div>

        <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg">
          <p className="text-sm text-yellow-800 dark:text-yellow-300">
            <strong>💡 Remember:</strong> Your performance will be 8 bars long (about 15-30 seconds). 
            First you'll hear an 8-bar introduction, then it's your turn to play C-G-Am-F twice!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border border-purple-200 dark:border-purple-700 rounded-xl p-6 mb-6">
      <h3 className="text-lg font-bold text-purple-800 dark:text-purple-300 mb-4 flex items-center">
        🎯 Year 8 Assessment Criteria
      </h3>
      
      <div className="space-y-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
          <h4 className="font-semibold text-purple-700 dark:text-purple-400 mb-2">🎧 Good Listening Skills</h4>
          <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
            Working out and copying the playing or singing style from the original song.
          </p>
          <div className="text-xs text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/30 rounded p-2">
            <strong>Excellent work:</strong> Accurately copy the style and feel of the original song.
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
          <h4 className="font-semibold text-purple-700 dark:text-purple-400 mb-2">🎸 Strong Performance Skills</h4>
          <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
            Performing chords correctly, keeping time, and performing at different speeds.
          </p>
          <div className="text-xs text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/30 rounded p-2">
            <strong>Excellent work:</strong> Play accurately with good timing at multiple tempos.
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
          <h4 className="font-semibold text-purple-700 dark:text-purple-400 mb-2">🎨 Creative Changes</h4>
          <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
            Making the song work for your skill level and adding your own ideas.
          </p>
          <div className="text-xs text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/30 rounded p-2">
            <strong>Excellent work:</strong> Adapt the song thoughtfully and add personal creative touches.
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
          <h4 className="font-semibold text-purple-700 dark:text-purple-400 mb-2">🌟 Confident Performance</h4>
          <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
            Showing good posture/technique and making the music feel right.
          </p>
          <div className="text-xs text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/30 rounded p-2">
            <strong>Excellent work:</strong> Perform with confidence, good technique, and musical expression.
          </div>
        </div>
      </div>

      <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg">
        <p className="text-sm text-yellow-800 dark:text-yellow-300">
          <strong>💡 Remember:</strong> Your performance should be at least 30 seconds long. 
          Practice at different tempos: Slow (60-80 BPM) → Medium (90-110 BPM) → Fast (120+ BPM)
        </p>
      </div>
    </div>
  );
};

export default AssessmentTips;