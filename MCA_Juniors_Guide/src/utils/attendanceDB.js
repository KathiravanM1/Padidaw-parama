import { getCurrentUser, getUserDocument, updateUserDocument } from './sessionAuth';

const getMaxLeaveHours = (credits) => {
  const creditValue = parseFloat(credits);
  if (creditValue === 4.5) return 13;
  if (creditValue === 4) return 11;
  if (creditValue === 3) return 9;
  if (creditValue === 1.5) return 6;
  return Math.floor(creditValue * 3);
};

export const getCurrentUserData = () => {
  const rollNumber = getCurrentUser();
  return rollNumber ? getUserDocument(rollNumber) : null;
};

export const addSubject = (subjectData) => {
  const rollNumber = getCurrentUser();
  if (!rollNumber) return null;
  
  const userDoc = getUserDocument(rollNumber);
  if (!userDoc) return null;
  
  const subjectId = `${rollNumber}_${Date.now()}`;
  const subject = {
    id: subjectId,
    name: subjectData.name,
    credits: subjectData.credits,
    hoursAbsent: 0,
    createdAt: new Date().toISOString()
  };
  
  userDoc.subjects[subjectId] = subject;
  updateUserDocument(rollNumber, userDoc);
  return subject;
};

export const markAttendance = (subjectId, hours) => {
  const rollNumber = getCurrentUser();
  if (!rollNumber) return null;
  
  const userDoc = getUserDocument(rollNumber);
  if (!userDoc || !userDoc.subjects[subjectId]) return null;
  
  userDoc.subjects[subjectId].hoursAbsent += hours;
  
  const historyEntry = {
    id: Date.now(),
    date: new Date().toISOString(),
    subjectId,
    subjectName: userDoc.subjects[subjectId].name,
    hours
  };
  
  userDoc.attendanceHistory.unshift(historyEntry);
  updateUserDocument(rollNumber, userDoc);
  return historyEntry;
};

export const deleteSubject = (subjectId) => {
  const rollNumber = getCurrentUser();
  if (!rollNumber) return false;
  
  const userDoc = getUserDocument(rollNumber);
  if (!userDoc) return false;
  
  const subjectName = userDoc.subjects[subjectId]?.name;
  delete userDoc.subjects[subjectId];
  userDoc.attendanceHistory = userDoc.attendanceHistory.filter(h => h.subjectName !== subjectName);
  
  updateUserDocument(rollNumber, userDoc);
  return true;
};

export const updateAttendance = (entryId, newHours) => {
  const rollNumber = getCurrentUser();
  if (!rollNumber) return false;
  
  const userDoc = getUserDocument(rollNumber);
  if (!userDoc) return false;
  
  const entry = userDoc.attendanceHistory.find(h => h.id === entryId);
  if (!entry) return false;
  
  const hourDifference = newHours - entry.hours;
  if (userDoc.subjects[entry.subjectId]) {
    userDoc.subjects[entry.subjectId].hoursAbsent += hourDifference;
  }
  
  entry.hours = newHours;
  updateUserDocument(rollNumber, userDoc);
  return true;
};

export const deleteAttendance = (entryId) => {
  const rollNumber = getCurrentUser();
  if (!rollNumber) return false;
  
  const userDoc = getUserDocument(rollNumber);
  if (!userDoc) return false;
  
  const entry = userDoc.attendanceHistory.find(h => h.id === entryId);
  if (!entry) return false;
  
  if (userDoc.subjects[entry.subjectId]) {
    userDoc.subjects[entry.subjectId].hoursAbsent -= entry.hours;
    if (userDoc.subjects[entry.subjectId].hoursAbsent <= 0) {
      delete userDoc.subjects[entry.subjectId];
    }
  }
  
  userDoc.attendanceHistory = userDoc.attendanceHistory.filter(h => h.id !== entryId);
  updateUserDocument(rollNumber, userDoc);
  return true;
};

export { getMaxLeaveHours };