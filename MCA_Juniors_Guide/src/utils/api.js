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

export const authAPI = {
  register: (userData) =>
    apiCall('/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    }),

  login: (email, password) => 
    apiCall('/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  logout: () => 
    apiCall('/logout', { method: 'POST' }),
};

export const attendanceAPI = {
  getMyData: () => apiCall('/attendance/me'),

  addSubject: (id, name, credits) =>
    apiCall('/subject', {
      method: 'POST',
      body: JSON.stringify({ id, name, credits }),
    }),

  deleteSubject: (subjectId) =>
    apiCall('/subject', {
      method: 'DELETE',
      body: JSON.stringify({ subjectId }),
    }),

  markAttendance: (subjectId, status, hours) =>
    apiCall('/attendance', {
      method: 'POST',
      body: JSON.stringify({ subjectId, status, hours }),
    }),

  updateAttendance: (attendanceId, newHours) =>
    apiCall('/update-status', {
      method: 'PUT',
      body: JSON.stringify({ attendanceId, newHours }),
    }),

  deleteAttendance: (attendanceId) =>
    apiCall('/attendance', {
      method: 'DELETE',
      body: JSON.stringify({ attendanceId }),
    }),
};