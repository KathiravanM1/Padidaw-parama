// User-based storage system - each user's data is completely isolated
const getUserStorageKey = (userId) => `attendance_${userId}`;

const getMaxLeaveHours = (credits) => {
  const creditValue = parseFloat(credits);
  if (creditValue === 4.5) return 13;
  if (creditValue === 4) return 11;
  if (creditValue === 3) return 9;
  if (creditValue === 1.5) return 6;
  return Math.floor(creditValue * 3);
};

// Get user's attendance data
export const getUserData = (userId) => {
  if (!userId) return null;
  try {
    const data = localStorage.getItem(getUserStorageKey(userId));
    return data ? JSON.parse(data) : {
      subjects: {},
      attendanceHistory: [],
      createdAt: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error loading user data:', error);
    return null;
  }
};

// Save user's attendance data
export const saveUserData = (userId, data) => {
  if (!userId) return false;
  try {
    data.lastUpdated = new Date().toISOString();
    localStorage.setItem(getUserStorageKey(userId), JSON.stringify(data));
    return true;
  } catch (error) {
    console.error('Error saving user data:', error);
    return false;
  }
};

// Add subject for user
export const addUserSubject = (userId, subjectData) => {
  const userData = getUserData(userId);
  if (!userData) return null;
  
  const subjectId = `${userId}_${Date.now()}`;
  const subject = {
    id: subjectId,
    name: subjectData.name,
    credits: subjectData.credits,
    hoursAbsent: 0,
    createdAt: new Date().toISOString()
  };
  
  userData.subjects[subjectId] = subject;
  saveUserData(userId, userData);
  return subject;
};

// Mark attendance for user
export const markUserAttendance = (userId, subjectId, hours) => {
  const userData = getUserData(userId);
  if (!userData || !userData.subjects[subjectId]) return null;
  
  // Update subject hours
  userData.subjects[subjectId].hoursAbsent += hours;
  
  // Add to history
  const historyEntry = {
    id: Date.now(),
    date: new Date().toISOString(),
    subjectId,
    subjectName: userData.subjects[subjectId].name,
    hours
  };
  
  userData.attendanceHistory.unshift(historyEntry);
  saveUserData(userId, userData);
  return historyEntry;
};

// Delete subject for user
export const deleteUserSubject = (userId, subjectId) => {
  const userData = getUserData(userId);
  if (!userData) return false;
  
  const subjectName = userData.subjects[subjectId]?.name;
  delete userData.subjects[subjectId];
  
  // Remove from history
  userData.attendanceHistory = userData.attendanceHistory.filter(
    h => h.subjectName !== subjectName
  );
  
  saveUserData(userId, userData);
  return true;
};

// Update attendance entry for user
export const updateUserAttendance = (userId, entryId, newHours) => {
  const userData = getUserData(userId);
  if (!userData) return false;
  
  const entry = userData.attendanceHistory.find(h => h.id === entryId);
  if (!entry) return false;
  
  const hourDifference = newHours - entry.hours;
  
  // Update subject hours
  if (userData.subjects[entry.subjectId]) {
    userData.subjects[entry.subjectId].hoursAbsent += hourDifference;
  }
  
  // Update history entry
  entry.hours = newHours;
  
  saveUserData(userId, userData);
  return true;
};

// Delete attendance entry for user
export const deleteUserAttendance = (userId, entryId) => {
  const userData = getUserData(userId);
  if (!userData) return false;
  
  const entry = userData.attendanceHistory.find(h => h.id === entryId);
  if (!entry) return false;
  
  // Update subject hours
  if (userData.subjects[entry.subjectId]) {
    userData.subjects[entry.subjectId].hoursAbsent -= entry.hours;
    if (userData.subjects[entry.subjectId].hoursAbsent <= 0) {
      delete userData.subjects[entry.subjectId];
    }
  }
  
  // Remove from history
  userData.attendanceHistory = userData.attendanceHistory.filter(h => h.id !== entryId);
  
  saveUserData(userId, userData);
  return true;
};

export { getMaxLeaveHours };