import { attendanceAPI } from './api';
import { getCurrentUserData, refreshUserData as refreshSession } from './sessionAuth';

const getMaxLeaveHours = (credits) => {
  const creditValue = parseFloat(credits);
  if (creditValue === 4.5) return 13;
  if (creditValue === 4) return 11;
  if (creditValue === 3) return 9;
  if (creditValue === 1.5) return 6;
  return Math.floor(creditValue * 3);
};

export const refreshUserData = async () => {
  return await refreshSession();
};



export const addSubject = async (subjectData) => {
  const userData = getCurrentUserData();
  if (!userData?.rollNumber) throw new Error('User not logged in');
  const subjectId = `subject_${Date.now()}`;
  await attendanceAPI.addSubject(subjectId, subjectData.name, subjectData.credits, userData.rollNumber);
  await refreshUserData();
  return { id: subjectId, ...subjectData };
};

export const markAttendance = async (subjectId, hours) => {
  const userData = getCurrentUserData();
  if (!userData?.rollNumber) throw new Error('User not logged in');
  await attendanceAPI.markAttendance(subjectId, 'absent', hours, userData.rollNumber);
  await refreshUserData();
};

export const deleteSubject = async (subjectId) => {
  const userData = getCurrentUserData();
  // console.log('deleteSubject userData:', userData);
  if (!userData?.rollNumber) throw new Error('User not logged in');
  await attendanceAPI.deleteSubject(subjectId, userData.rollNumber);
  await refreshUserData();
  return true;
};

export const updateAttendance = async (entryId, newHours) => {
  const userData = getCurrentUserData();
  if (!userData?.rollNumber) throw new Error('User not logged in');
  await attendanceAPI.updateAttendance(entryId, newHours, userData.rollNumber);
  await refreshUserData();
  return true;
};

export const deleteAttendance = async (entryId) => {
  const userData = getCurrentUserData();
  if (!userData?.rollNumber) throw new Error('User not logged in');
  await attendanceAPI.deleteAttendance(entryId, userData.rollNumber);
  await refreshUserData();
  return true;
};

export { getMaxLeaveHours };