import React, { useState } from 'react';

interface LessonStep {
  id: string;
  type: 'chord' | 'exercise' | 'theory' | 'practice';
  title: string;
  content: string;
  duration: number; // in minutes
  chords?: string[];
}

interface LessonPlan {
  id: string;
  title: string;
  description: string;
  duration: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  steps: LessonStep[];
  createdAt: Date;
}

const LessonPlanBuilder: React.FC = () => {
  const [lessonPlans, setLessonPlans] = useState<LessonPlan[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [currentPlan, setCurrentPlan] = useState<Partial<LessonPlan>>({
    title: '',
    description: '',
    difficulty: 'beginner',
    steps: [],
  });

  const stepTypes = [
    { value: 'chord', label: 'Chord Learning', icon: '🎵' },
    { value: 'exercise', label: 'Exercise', icon: '💪' },
    { value: 'theory', label: 'Theory', icon: '📚' },
    { value: 'practice', label: 'Practice Session', icon: '🎸' },
  ];

  const availableChords = [
    'C Major', 'G Major', 'D Major', 'A Major', 'E Major',
    'A Minor', 'E Minor', 'B Minor', 'F# Minor', 'C# Minor',
    'F Major', 'Bb Major', 'Eb Major',
  ];

  const addStep = () => {
    const newStep: LessonStep = {
      id: Math.random().toString(36).substring(2, 15),
      type: 'chord',
      title: '',
      content: '',
      duration: 5,
      chords: [],
    };

    setCurrentPlan(prev => ({
      ...prev,
      steps: [...(prev.steps ?? []), newStep],
    }));
  };

  const updateStep = (stepId: string, updates: Partial<LessonStep>) => {
    setCurrentPlan(prev => ({
      ...prev,
      steps: (prev.steps ?? []).map(step =>
        step.id === stepId ? { ...step, ...updates } : step
      ),
    }));
  };

  const removeStep = (stepId: string) => {
    setCurrentPlan(prev => ({
      ...prev,
      steps: (prev.steps ?? []).filter(step => step.id !== stepId),
    }));
  };

  const saveLessonPlan = () => {
    if (currentPlan.title && currentPlan.steps && currentPlan.steps.length > 0) {
      const totalDuration = currentPlan.steps.reduce((sum, step) => sum + step.duration, 0);
      
      const newPlan: LessonPlan = {
        id: Math.random().toString(36).substring(2, 15),
        title: currentPlan.title,
        description: currentPlan.description ?? '',
        duration: totalDuration,
        difficulty: currentPlan.difficulty ?? 'beginner',
        steps: currentPlan.steps,
        createdAt: new Date(),
      };

      setLessonPlans(prev => [...prev, newPlan]);
      setCurrentPlan({ title: '', description: '', difficulty: 'beginner', steps: [] });
      setIsCreating(false);
    }
  };

  const deleteLessonPlan = (planId: string) => {
    setLessonPlans(prev => prev.filter(plan => plan.id !== planId));
  };

  const formatDuration = (minutes: number) => {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}m`;
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200';
      case 'intermediate': return 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200';
      case 'advanced': return 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200';
      default: return 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200';
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
            📋 Lesson Plan Builder
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Create structured lesson plans for your students
          </p>
        </div>
        <button
          onClick={() => setIsCreating(!isCreating)}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          {isCreating ? 'Cancel' : '+ New Lesson Plan'}
        </button>
      </div>

      {isCreating && (
        <div className="mb-8 p-6 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <h4 className="text-md font-semibold text-gray-800 dark:text-gray-200 mb-4">
            Create New Lesson Plan
          </h4>
          
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Lesson Title *
                </label>
                <input
                  type="text"
                  value={currentPlan.title ?? ''}
                  onChange={(e) => setCurrentPlan(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                  placeholder="e.g., Introduction to Basic Chords"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Difficulty Level
                </label>
                <select
                  value={currentPlan.difficulty ?? 'beginner'}
                  onChange={(e) => setCurrentPlan(prev => ({ ...prev, difficulty: e.target.value as 'beginner' | 'intermediate' | 'advanced' }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Description
              </label>
              <textarea
                value={currentPlan.description ?? ''}
                onChange={(e) => setCurrentPlan(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                placeholder="Describe what students will learn in this lesson..."
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-4">
                <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Lesson Steps
                </h5>
                <button
                  onClick={addStep}
                  className="px-3 py-1 text-sm bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
                >
                  + Add Step
                </button>
              </div>

              <div className="space-y-3">
                {(currentPlan.steps ?? []).map((step, index) => (
                  <div key={step.id} className="p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        Step {index + 1}
                      </span>
                      <button
                        onClick={() => removeStep(step.id)}
                        className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-200"
                      >
                        ✕
                      </button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">Type</label>
                        <select
                          value={step.type}
                          onChange={(e) => updateStep(step.id, { type: e.target.value as 'chord' | 'exercise' | 'theory' | 'practice' })}
                          className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800"
                        >
                          {stepTypes.map(type => (
                            <option key={type.value} value={type.value}>
                              {type.icon} {type.label}
                            </option>
                          ))}
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">Duration (min)</label>
                        <input
                          type="number"
                          value={step.duration}
                          onChange={(e) => updateStep(step.id, { duration: parseInt(e.target.value) || 0 })}
                          className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800"
                          min="1"
                          max="60"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">Title</label>
                        <input
                          type="text"
                          value={step.title}
                          onChange={(e) => updateStep(step.id, { title: e.target.value })}
                          className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800"
                          placeholder="Step title"
                        />
                      </div>
                    </div>
                    
                    <div className="mt-3">
                      <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">Content</label>
                      <textarea
                        value={step.content}
                        onChange={(e) => updateStep(step.id, { content: e.target.value })}
                        rows={2}
                        className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800"
                        placeholder="Instructions for this step..."
                      />
                    </div>

                    {step.type === 'chord' && (
                      <div className="mt-3">
                        <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">Chords</label>
                        <select
                          multiple
                          value={step.chords ?? []}
                          onChange={(e) => updateStep(step.id, { 
                            chords: Array.from(e.target.selectedOptions, option => option.value)
                          })}
                          className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800"
                          size={3}
                        >
                          {availableChords.map(chord => (
                            <option key={chord} value={chord}>{chord}</option>
                          ))}
                        </select>
                        <p className="text-xs text-gray-500 mt-1">Hold Ctrl/Cmd to select multiple chords</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button
                onClick={() => setIsCreating(false)}
                className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={saveLessonPlan}
                disabled={!currentPlan.title || !currentPlan.steps?.length}
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                Save Lesson Plan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Existing Lesson Plans */}
      <div className="space-y-4">
        {lessonPlans.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 dark:text-gray-400">
              No lesson plans created yet. Create your first lesson plan to get started!
            </p>
          </div>
        ) : (
          lessonPlans.map(plan => (
            <div key={plan.id} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="font-medium text-gray-900 dark:text-gray-100">{plan.title}</h4>
                    <span className={`px-2 py-1 text-xs rounded-full ${getDifficultyColor(plan.difficulty)}`}>
                      {plan.difficulty}
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {formatDuration(plan.duration)}
                    </span>
                  </div>
                  
                  {plan.description && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{plan.description}</p>
                  )}
                  
                  <div className="flex flex-wrap gap-2 mb-3">
                    {plan.steps.map((step, index) => (
                      <span key={step.id} className="inline-flex items-center px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded">
                        {stepTypes.find(t => t.value === step.type)?.icon} Step {index + 1}: {step.title || step.type}
                      </span>
                    ))}
                  </div>
                  
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    Created {plan.createdAt.toLocaleDateString()} • {plan.steps.length} steps
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <button
                    onClick={() => deleteLessonPlan(plan.id)}
                    className="px-2 py-1 text-red-600 hover:bg-red-100 dark:hover:bg-red-900 rounded transition-colors"
                  >
                    ✕
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default LessonPlanBuilder;