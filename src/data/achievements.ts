export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
}

export const achievements: Record<string, Achievement> = {
  FIRST_CHORD: {
    id: 'FIRST_CHORD',
    name: 'First Chord!',
    description: 'Learn your first chord.',
    icon: '🎵',
  },
  CHORD_NOVICE: {
    id: 'CHORD_NOVICE',
    name: 'Chord Novice',
    description: 'Learn 5 different chords.',
    icon: '🎸',
  },
  CHORD_APPRENTICE: {
    id: 'CHORD_APPRENTICE',
    name: 'Chord Apprentice',
    description: 'Learn 10 different chords.',
    icon: '🎹',
  },
  FIRST_LESSON: {
    id: 'FIRST_LESSON',
    name: 'First Lesson Complete',
    description: 'Complete your first lesson.',
    icon: '🎓',
  },
  SONG_BEGINNER: {
    id: 'SONG_BEGINNER',
    name: 'Song Beginner',
    description: 'Play along with a song for the first time.',
    icon: '🎶',
  },
  CHORD_MASTER: {
    id: 'CHORD_MASTER',
    name: 'Chord Master',
    description: 'Play 100+ chords.',
    icon: '🏆',
  },
  STREAK_MASTER: {
    id: 'STREAK_MASTER',
    name: 'Streak Master',
    description: 'Achieve a 50+ chord streak.',
    icon: '🔥',
  },
  SPEED_DEMON: {
    id: 'SPEED_DEMON',
    name: 'Speed Demon',
    description: 'Set a new challenge record.',
    icon: '⚡️',
  },
  DEDICATED_LEARNER: {
    id: 'DEDICATED_LEARNER',
    name: 'Dedicated Learner',
    description: 'Practice for 5+ minutes.',
    icon: '🧑 🎓',
  },
  COLLABORATION_STARTER: {
    id: 'COLLABORATION_STARTER',
    name: 'Collaboration Starter',
    description: 'Start your first live collaboration session.',
    icon: '🤝',
  },
  TEAM_PLAYER: {
    id: 'TEAM_PLAYER',
    name: 'Team Player',
    description: 'Join a collaborative learning session.',
    icon: '👥',
  },
  ASSIGNMENT_CREATOR: {
    id: 'ASSIGNMENT_CREATOR',
    name: 'Assignment Creator',
    description: 'Create your first assignment for students.',
    icon: '📋',
  },
  ASSIGNMENT_COMPLETER: {
    id: 'ASSIGNMENT_COMPLETER',
    name: 'Assignment Completer',
    description: 'Complete your first assigned practice.',
    icon: '✅',
  },
  PROJECTION_MASTER: {
    id: 'PROJECTION_MASTER',
    name: 'Projection Master',
    description: 'Use projection mode for teaching.',
    icon: '📽️',
  },
  CONSISTENCY_CHAMPION: {
    id: 'CONSISTENCY_CHAMPION',
    name: 'Consistency Champion',
    description: 'Practice for 7 days in a row.',
    icon: '📅',
  },
  CHORD_COLLECTOR: {
    id: 'CHORD_COLLECTOR',
    name: 'Chord Collector',
    description: 'Learn 25 different chords.',
    icon: '🎼',
  },
  SPEED_LEARNER: {
    id: 'SPEED_LEARNER',
    name: 'Speed Learner',
    description: 'Complete a lesson in under 3 minutes.',
    icon: '⏱️',
  },
  MENTOR: {
    id: 'MENTOR',
    name: 'Mentor',
    description: 'Help 5 students in collaboration sessions.',
    icon: '🎯',
  },
};
