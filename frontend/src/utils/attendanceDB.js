const BASE = `${import.meta.env.VITE_API_URL}/attendance`;

const getToken = () => localStorage.getItem('token');

const authHeaders = () => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${getToken()}`,
});

const request = async (method, path, body) => {
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: authHeaders(),
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Request failed');
  return data;
};

export const getMaxLeaveHours = (credits) => {
  const c = parseFloat(credits);
  if (c === 4.5) return 13;
  if (c === 4) return 11;
  if (c === 3) return 9;
  if (c === 1.5) return 6;
  return Math.floor(c * 3);
};

export const fetchMyAttendance = () => request('GET', '/me');

export const addSubject = async (subjectData) => {
  const subjectId = `subject_${Date.now()}`;
  await request('POST', '/subject', { id: subjectId, name: subjectData.name, credits: subjectData.credits });
  return { id: subjectId, ...subjectData };
};

export const markAttendance = (subjectId, hours) =>
  request('POST', '/mark', { subjectId, status: 'absent', hours });

export const deleteSubject = (subjectId) =>
  request('DELETE', '/subject', { subjectId });

export const updateAttendance = (attendanceId, newHours) =>
  request('PUT', '/update', { attendanceId, newHours });

export const deleteAttendance = (attendanceId) =>
  request('DELETE', '/entry', { attendanceId });
