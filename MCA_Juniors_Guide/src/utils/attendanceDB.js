import { attendanceAPI } from './api';
import { getCurrentUserData } from './sessionAuth';

let userData = null;

const getMaxLeaveHours = (credits) => {
  const creditValue = parseFloat(credits);
  if (creditValue === 4.5) return 13;
  if (creditValue === 4) return 11;
  if (creditValue === 3) return 9;
  if (creditValue === 1.5) return 6;
  return Math.floor(creditValue * 3);
};

export const refreshUserData = async () => {
  userData = await attendanceAPI.getMyData();
  return userData;
};



export const addSubject = async (subjectData) => {
  const subjectId = `${userData.rollNumber}_${Date.now()}`;
  await attendanceAPI.addSubject(subjectId, subjectData.name, subjectData.credits);
  await refreshUserData();
  return { id: subjectId, ...subjectData };
};

export const markAttendance = async (subjectId, hours) => {
  await attendanceAPI.markAttendance(subjectId, 'absent', hours);
  await refreshUserData();
};

export const deleteSubject = async (subjectId) => {
  await attendanceAPI.deleteSubject(subjectId);
  await refreshUserData();
  return true;
};

export const updateAttendance = async (entryId, newHours) => {
  await attendanceAPI.updateAttendance(entryId, newHours);
  await refreshUserData();
  return true;
};

export const deleteAttendance = async (entryId) => {
  await attendanceAPI.deleteAttendance(entryId);
  await refreshUserData();
  return true;
};

export { getMaxLeaveHours };