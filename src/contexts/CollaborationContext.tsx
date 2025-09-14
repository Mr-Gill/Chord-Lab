import React, { createContext, useContext, useState, useEffect } from 'react';

interface StudentSession {
  id: string;
  name: string;
  isOnline: boolean;
  lastActivity: number;
  currentChord?: string;
  practiceTime: number;
  chordsPlayed: number;
  accuracy: number;
}

interface Assignment {
  id: string;
  title: string;
  description: string;
  chords: string[];
  dueDate?: Date;
  createdAt: Date;
  assignedStudents: string[];
}

interface CollaborationContextType {
  isTeacher: boolean;
  sessionId: string | null;
  students: StudentSession[];
  assignments: Assignment[];
  setIsTeacher: (isTeacher: boolean) => void;
  startSession: () => string;
  joinSession: (sessionId: string, studentName: string) => void;
  endSession: () => void;
  updateStudentActivity: (studentId: string, activity: Partial<StudentSession>) => void;
  createAssignment: (assignment: Omit<Assignment, 'id' | 'createdAt'>) => void;
  deleteAssignment: (assignmentId: string) => void;
  broadcastToStudents: (message: any) => void;
}

const CollaborationContext = createContext<CollaborationContextType | undefined>(undefined);

export const useCollaboration = () => {
  const context = useContext(CollaborationContext);
  if (!context) {
    throw new Error('useCollaboration must be used within a CollaborationProvider');
  }
  return context;
};

interface CollaborationProviderProps {
  children: React.ReactNode;
}

export const CollaborationProvider: React.FC<CollaborationProviderProps> = ({ children }) => {
  const [isTeacher, setIsTeacher] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [students, setStudents] = useState<StudentSession[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);

  // Simulate WebSocket connection - in production, this would be a real WebSocket
  useEffect(() => {
    if (sessionId) {
      // Load assignments from localStorage
      const savedAssignments = localStorage.getItem(`assignments_${sessionId}`);
      if (savedAssignments) {
        setAssignments(JSON.parse(savedAssignments));
      }

      // Simulate periodic student activity updates
      const interval = setInterval(() => {
        setStudents(prev => prev.map(student => ({
          ...student,
          isOnline: Date.now() - student.lastActivity < 30000, // Consider offline after 30 seconds
        })));
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [sessionId]);

  // Save assignments to localStorage when they change
  useEffect(() => {
    if (sessionId && assignments.length > 0) {
      localStorage.setItem(`assignments_${sessionId}`, JSON.stringify(assignments));
    }
  }, [assignments, sessionId]);

  const startSession = (): string => {
    const newSessionId = Math.random().toString(36).substring(2, 15);
    setSessionId(newSessionId);
    setIsTeacher(true);
    setStudents([]);
    return newSessionId;
  };

  const joinSession = (sessionId: string, studentName: string): void => {
    setSessionId(sessionId);
    setIsTeacher(false);
    
    // Add current user as a student
    const studentSession: StudentSession = {
      id: Math.random().toString(36).substring(2, 15),
      name: studentName,
      isOnline: true,
      lastActivity: Date.now(),
      practiceTime: 0,
      chordsPlayed: 0,
      accuracy: 0,
    };

    setStudents(prev => [...prev, studentSession]);
  };

  const endSession = (): void => {
    setSessionId(null);
    setIsTeacher(false);
    setStudents([]);
  };

  const updateStudentActivity = (studentId: string, activity: Partial<StudentSession>): void => {
    setStudents(prev => prev.map(student => 
      student.id === studentId 
        ? { ...student, ...activity, lastActivity: Date.now() }
        : student
    ));
  };

  const createAssignment = (assignment: Omit<Assignment, 'id' | 'createdAt'>): void => {
    const newAssignment: Assignment = {
      ...assignment,
      id: Math.random().toString(36).substring(2, 15),
      createdAt: new Date(),
    };
    setAssignments(prev => [...prev, newAssignment]);
  };

  const deleteAssignment = (assignmentId: string): void => {
    setAssignments(prev => prev.filter(a => a.id !== assignmentId));
  };

  const broadcastToStudents = (message: any): void => {
    // In production, this would send the message via WebSocket
    console.log('Broadcasting to students:', message);
  };

  const value: CollaborationContextType = {
    isTeacher,
    sessionId,
    students,
    assignments,
    setIsTeacher,
    startSession,
    joinSession,
    endSession,
    updateStudentActivity,
    createAssignment,
    deleteAssignment,
    broadcastToStudents,
  };

  return (
    <CollaborationContext.Provider value={value}>
      {children}
    </CollaborationContext.Provider>
  );
};