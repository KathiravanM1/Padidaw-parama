import { useState, useEffect, useCallback } from 'react';
import { 
  getStudent, 
  getAllStudents, 
  addStudent, 
  addSubjectToStudent, 
  markAttendance,
  getStudentSummary 
} from '../utils/attendanceStorage';

export const useAttendance = () => {
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [studentData, setStudentData] = useState(null);

  // Load all students on mount
  useEffect(() => {
    refreshStudents();
  }, []);

  // Load student data when selected student changes
  useEffect(() => {
    if (selectedStudent) {
      const data = getStudent(selectedStudent.id);
      setStudentData(data);
    } else {
      setStudentData(null);
    }
  }, [selectedStudent]);

  const refreshStudents = useCallback(() => {
    const allStudents = getAllStudents();
    setStudents(allStudents);
  }, []);

  const refreshStudentData = useCallback(() => {
    if (selectedStudent) {
      const data = getStudent(selectedStudent.id);
      setStudentData(data);
    }
  }, [selectedStudent]);

  const createStudent = useCallback((studentId, studentName) => {
    const student = addStudent(studentId, studentName);
    refreshStudents();
    return student;
  }, [refreshStudents]);

  const addSubject = useCallback((subjectData) => {
    if (!selectedStudent) return null;
    
    const subject = addSubjectToStudent(selectedStudent.id, subjectData);
    refreshStudentData();
    return subject;
  }, [selectedStudent, refreshStudentData]);

  const recordAttendance = useCallback((subjectId, hours, date) => {
    if (!selectedStudent) return null;
    
    const entry = markAttendance(selectedStudent.id, subjectId, hours, date);
    refreshStudentData();
    return entry;
  }, [selectedStudent, refreshStudentData]);

  const getStudentStats = useCallback((studentId) => {
    return getStudentSummary(studentId || selectedStudent?.id);
  }, [selectedStudent]);

  return {
    // State
    students,
    selectedStudent,
    studentData,
    
    // Actions
    setSelectedStudent,
    refreshStudents,
    refreshStudentData,
    createStudent,
    addSubject,
    recordAttendance,
    getStudentStats,
    
    // Computed values
    subjects: studentData ? Object.values(studentData.subjects) : [],
    attendanceHistory: studentData ? studentData.attendanceHistory : []
  };
};