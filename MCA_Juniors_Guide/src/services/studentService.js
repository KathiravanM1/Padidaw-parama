import axios from 'axios';

const API_BASE_URL = 'http://localhost:5002/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer default-token'
  },
});

export const studentService = {
  // Save student data
  saveStudentData: async (studentData) => {
    try {
      const response = await api.post('/students/data', studentData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Update student data
  updateStudentData: async (studentData) => {
    try {
      const response = await api.put('/students/data', studentData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get student data
  getStudentData: async () => {
    try {
      const response = await api.get('/students/data');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};

export default studentService;