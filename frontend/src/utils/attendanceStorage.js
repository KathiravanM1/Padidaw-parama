// Optimal attendance storage system for multiple students
const STORAGE_KEY = 'attendance_tracker_data';

// Data structure for storing attendance data
const createEmptyAttendanceData = () => ({
  students: {},
  subjects: {},
  lastUpdated: new Date().toISOString()
});

// Get all attendance data from localStorage
export const getAttendanceData = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : createEmptyAttendanceData();
  } catch (error) {
    console.error('Error loading attendance data:', error);
    return createEmptyAttendanceData();
  }
};

// Save attendance data to localStorage
export const saveAttendanceData = (data) => {
  try {
    data.lastUpdated = new Date().toISOString();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error('Error saving attendance data:', error);
    return false;
  }
};

// Student management functions
export const addStudent = (studentId, studentName) => {
  const data = getAttendanceData();
  if (!data.students[studentId]) {
    data.students[studentId] = {
      id: studentId,
      name: studentName,
      subjects: {},
      attendanceHistory: [],
      createdAt: new Date().toISOString()
    };
    saveAttendanceData(data);
  }
  return data.students[studentId];
};

export const getStudent = (studentId) => {
  const data = getAttendanceData();
  return data.students[studentId] || null;
};

export const getAllStudents = () => {
  const data = getAttendanceData();
  return Object.values(data.students);
};

// Subject management functions
export const addSubjectToStudent = (studentId, subjectData) => {
  const data = getAttendanceData();
  if (!data.students[studentId]) return null;
  
  const subjectId = `${studentId}_${Date.now()}`;
  const subject = {
    id: subjectId,
    name: subjectData.name,
    credits: subjectData.credits,
    hoursAbsent: 0,
    createdAt: new Date().toISOString()
  };
  
  data.students[studentId].subjects[subjectId] = subject;
  saveAttendanceData(data);
  return subject;
};

// Attendance tracking functions
export const markAttendance = (studentId, subjectId, hours, date = new Date().toISOString()) => {
  const data = getAttendanceData();
  if (!data.students[studentId] || !data.students[studentId].subjects[subjectId]) {
    return null;
  }
  
  // Update subject hours
  data.students[studentId].subjects[subjectId].hoursAbsent += hours;
  
  // Add to history
  const historyEntry = {
    id: Date.now(),
    date,
    subjectId,
    subjectName: data.students[studentId].subjects[subjectId].name,
    hours
  };
  
  data.students[studentId].attendanceHistory.unshift(historyEntry);
  saveAttendanceData(data);
  return historyEntry;
};

// Get student's attendance summary
export const getStudentSummary = (studentId) => {
  const data = getAttendanceData();
  const student = data.students[studentId];
  if (!student) return null;
  
  const subjects = Object.values(student.subjects);
  const totalSubjects = subjects.length;
  const criticalSubjects = subjects.filter(s => {
    const maxLeave = getMaxLeaveHours(s.credits);
    return s.hoursAbsent > maxLeave;
  }).length;
  
  return {
    studentName: student.name,
    totalSubjects,
    criticalSubjects,
    recentHistory: student.attendanceHistory.slice(0, 10)
  };
};

// Helper function for max leave hours calculation
const getMaxLeaveHours = (credits) => {
  const creditValue = parseFloat(credits);
  if (creditValue === 4.5) return 13;
  if (creditValue === 4) return 11;
  if (creditValue === 3) return 9;
  if (creditValue === 1.5) return 6;
  return Math.floor(creditValue * 3);
};

// Export/Import functions for data backup
export const exportAttendanceData = () => {
  const data = getAttendanceData();
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `attendance_data_${new Date().toISOString().split('T')[0]}.json`;
  a.click();
  URL.revokeObjectURL(url);
};

export const importAttendanceData = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedData = JSON.parse(e.target.result);
        if (importedData.students && typeof importedData.students === 'object') {
          saveAttendanceData(importedData);
          resolve(importedData);
        } else {
          reject(new Error('Invalid data format'));
        }
      } catch (error) {
        reject(error);
      }
    };
    reader.readAsText(file);
  });
};