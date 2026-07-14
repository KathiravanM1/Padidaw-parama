import { attendanceAPI } from './api';

let currentUser = null;

export const setUserByRollNumber = async (rollNumber) => {
  // console.log("setUserByRollNumber called with:", rollNumber);
  const userData = await attendanceAPI.getUserByRollNumber(rollNumber);
  currentUser = userData;
  // console.log("currentUser", currentUser);  
  return currentUser;
};

export const getCurrentUser = () => {
  return currentUser?.rollNumber || null;
};

export const logoutUser = () => {
  currentUser = null;
};

export const getCurrentUserData = () => {
  return currentUser;
};

export const refreshUserData = async () => {
  if (currentUser?.rollNumber) {
    const userData = await attendanceAPI.getUserByRollNumber(currentUser.rollNumber);
    currentUser = userData;
  }
  return currentUser;
};