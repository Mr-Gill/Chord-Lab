import { useState } from 'react';
import type { FC } from 'react';
import SimplePracticeMode from './SimplePracticeMode';
import PracticeMode from './PracticeMode';

const PracticeModeWrapper: FC = () => {
  const [showAdvanced, setShowAdvanced] = useState(false);

  if (showAdvanced) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
            Advanced Practice Mode
          </h2>
          <button
            onClick={() => setShowAdvanced(false)}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold hover:shadow-lg transition-all duration-300"
          >
            ✨ Simple Mode
          </button>
        </div>
        <PracticeMode />
      </div>
    );
  }

  return (
    <SimplePracticeMode
      showAdvanced={showAdvanced}
      onShowAdvanced={() => setShowAdvanced(true)}
    />
  );
};

export default PracticeModeWrapper;