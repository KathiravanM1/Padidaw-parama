const SESSION_KEY = 'current_user_session';
const DB_KEY = 'attendance_db';

// Session management
export const loginUser = (rollNumber) => {
  localStorage.setItem(SESSION_KEY, rollNumber);
  return rollNumber;
};

export const getCurrentUser = () => {
  return localStorage.getItem(SESSION_KEY);
};

export const logoutUser = () => {
  localStorage.removeItem(SESSION_KEY);
};

// Database operations
const getDB = () => {
  try {
    return JSON.parse(localStorage.getItem(DB_KEY) || '{}');
  } catch {
    return {};
  }
};

const saveDB = (db) => {
  localStorage.setItem(DB_KEY, JSON.stringify(db));
};

export const getUserDocument = (rollNumber) => {
  const db = getDB();
  return db[rollNumber] || null;
};

export const createUserDocument = (rollNumber) => {
  const db = getDB();
  if (!db[rollNumber]) {
    db[rollNumber] = {
      rollNumber,
      subjects: {},
      attendanceHistory: [],
      createdAt: new Date().toISOString()
    };
    saveDB(db);
  }
  return db[rollNumber];
};

export const updateUserDocument = (rollNumber, data) => {
  const db = getDB();
  if (db[rollNumber]) {
    db[rollNumber] = { ...db[rollNumber], ...data, lastUpdated: new Date().toISOString() };
    saveDB(db);
    return true;
  }
  return false;
};