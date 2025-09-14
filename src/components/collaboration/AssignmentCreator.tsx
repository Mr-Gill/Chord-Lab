import React, { useState } from 'react';
import { useCollaboration } from '../../contexts/CollaborationContext';

const AssignmentCreator: React.FC = () => {
  const { createAssignment, assignments, deleteAssignment, students } = useCollaboration();
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    chords: [''],
    dueDate: '',
    assignedStudents: [] as string[],
  });

  const availableChords = [
    'C Major', 'G Major', 'D Major', 'A Major', 'E Major',
    'A Minor', 'E Minor', 'B Minor', 'F# Minor', 'C# Minor',
    'F Major', 'Bb Major', 'Eb Major',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.title && formData.chords.some(chord => chord)) {
      createAssignment({
        title: formData.title,
        description: formData.description,
        chords: formData.chords.filter(chord => chord),
        dueDate: formData.dueDate ? new Date(formData.dueDate) : undefined,
        assignedStudents: formData.assignedStudents,
      });
      
      setFormData({
        title: '',
        description: '',
        chords: [''],
        dueDate: '',
        assignedStudents: [],
      });
      setIsCreating(false);
    }
  };

  const addChordField = () => {
    setFormData(prev => ({
      ...prev,
      chords: [...prev.chords, ''],
    }));
  };

  const removeChordField = (index: number) => {
    setFormData(prev => ({
      ...prev,
      chords: prev.chords.filter((_, i) => i !== index),
    }));
  };

  const updateChord = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      chords: prev.chords.map((chord, i) => i === index ? value : chord),
    }));
  };

  const toggleStudentAssignment = (studentId: string) => {
    setFormData(prev => ({
      ...prev,
      assignedStudents: prev.assignedStudents.includes(studentId)
        ? prev.assignedStudents.filter(id => id !== studentId)
        : [...prev.assignedStudents, studentId],
    }));
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
          Assignments
        </h3>
        <button
          onClick={() => setIsCreating(!isCreating)}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          {isCreating ? 'Cancel' : '+ New Assignment'}
        </button>
      </div>

      {isCreating && (
        <form onSubmit={handleSubmit} className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Assignment Title *
            </label>
            <input
              id="title"
              type="text"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., Practice Basic Chords"
              required
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Description
            </label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Instructions for the assignment..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Chords to Practice *
            </label>
            {formData.chords.map((chord, index) => (
              <div key={index} className="flex items-center space-x-2 mb-2">
                <select
                  value={chord}
                  onChange={(e) => updateChord(index, e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select a chord</option>
                  {availableChords.map(chordOption => (
                    <option key={chordOption} value={chordOption}>{chordOption}</option>
                  ))}
                </select>
                {formData.chords.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeChordField(index)}
                    className="px-3 py-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900 rounded-lg transition-colors"
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addChordField}
              className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200"
            >
              + Add another chord
            </button>
          </div>

          <div>
            <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Due Date (Optional)
            </label>
            <input
              id="dueDate"
              type="datetime-local"
              value={formData.dueDate}
              onChange={(e) => setFormData(prev => ({ ...prev, dueDate: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {students.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Assign to Students
              </label>
              <div className="space-y-2">
                {students.map(student => (
                  <label key={student.id} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.assignedStudents.includes(student.id)}
                      onChange={() => toggleStudentAssignment(student.id)}
                      className="mr-2 rounded"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">{student.name}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          <div className="flex space-x-2">
            <button
              type="submit"
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
            >
              Create Assignment
            </button>
            <button
              type="button"
              onClick={() => setIsCreating(false)}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="space-y-4">
        {assignments.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 text-center py-4">
            No assignments created yet.
          </p>
        ) : (
          assignments.map(assignment => (
            <div key={assignment.id} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-1">
                    {assignment.title}
                  </h4>
                  {assignment.description && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      {assignment.description}
                    </p>
                  )}
                  <div className="flex flex-wrap gap-1 mb-2">
                    {assignment.chords.map(chord => (
                      <span key={chord} className="inline-block px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded">
                        {chord}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
                    <span>Created: {formatDate(assignment.createdAt)}</span>
                    {assignment.dueDate && (
                      <span>Due: {formatDate(assignment.dueDate)}</span>
                    )}
                    <span>Assigned to: {assignment.assignedStudents.length} students</span>
                  </div>
                </div>
                <button
                  onClick={() => deleteAssignment(assignment.id)}
                  className="px-2 py-1 text-red-600 hover:bg-red-100 dark:hover:bg-red-900 rounded transition-colors"
                >
                  ✕
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AssignmentCreator;