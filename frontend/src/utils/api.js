const API_BASE =import.meta.env.VITE_API_URL+'/attendance';

const apiCall = async (endpoint, options = {}) => {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'API call failed');
  }

  return response.json();
};

export const attendanceAPI = {
  getUserByRollNumber: (rollNumber) => 
    apiCall(`/user/${rollNumber}`, { method: 'GET' }),

  addSubject: (id, name, credits, rollNumber) =>
    apiCall('/subject', {
      method: 'POST',
      body: JSON.stringify({ id, name, credits, rollNumber }),
    }),

  deleteSubject: (subjectId, rollNumber) =>
    apiCall('/subject', {
      method: 'DELETE',
      body: JSON.stringify({ subjectId, rollNumber }),
    }),

  markAttendance: (subjectId, status, hours, rollNumber) =>
    apiCall('/attendance', {
      method: 'POST',
      body: JSON.stringify({ subjectId, status, hours, rollNumber }),
    }),

  updateAttendance: (attendanceId, newHours, rollNumber) =>
    apiCall('/update-status', {
      method: 'PUT',
      body: JSON.stringify({ attendanceId, newHours, rollNumber }),
    }),

  deleteAttendance: (attendanceId, rollNumber) =>
    apiCall('/attendance', {
      method: 'DELETE',
      body: JSON.stringify({ attendanceId, rollNumber }),
    }),
};