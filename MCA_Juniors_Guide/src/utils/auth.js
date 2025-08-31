const AUTH_KEY = 'current_student_auth';

export const loginStudent = (studentId, password) => {
  if (password !== studentId) return null; // Simple: password = studentId
  
  const data = JSON.parse(localStorage.getItem('attendance_tracker_data') || '{"students":{}}');
  let student = data.students[studentId];
  
  // Create new student if doesn't exist
  if (!student) {
    student = {
      id: studentId,
      name: `Student ${studentId}`,
      subjects: {},
      attendanceHistory: [],
      createdAt: new Date().toISOString()
    };
    data.students[studentId] = student;
    data.lastUpdated = new Date().toISOString();
    localStorage.setItem('attendance_tracker_data', JSON.stringify(data));
  }
  
  localStorage.setItem(AUTH_KEY, studentId);
  return student;
};

export const getCurrentStudent = () => {
  return localStorage.getItem(AUTH_KEY);
};

export const logoutStudent = () => {
  localStorage.removeItem(AUTH_KEY);
};

export const isAuthenticated = () => {
  return !!localStorage.getItem(AUTH_KEY);
};