import { authAPI } from './api';

let currentUser = null;

export const registerUser = async (userData) => {
  const response = await authAPI.register(userData);
  return response;
};

export const loginUser = async (email, password) => {
  const response = await authAPI.login(email, password);
  currentUser = response.student;
  return currentUser;
};

export const getCurrentUser = () => {
  return currentUser?.rollNumber || null;
};

export const logoutUser = async () => {
  await authAPI.logout();
  currentUser = null;
};

export const getCurrentUserData = () => {
  return currentUser;
};