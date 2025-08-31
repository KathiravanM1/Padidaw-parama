import axios from 'axios';

const API_BASE_URL = 'https://padidaw-parama-backend.onrender.com/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const problemService = {
  // Create a new problem
  createProblem: async (problemData) => {
    try {
      const response = await api.post('/problems', problemData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get all problems with optional filters
  getAllProblems: async (filters = {}) => {
    try {
      const response = await api.get('/problems', { params: filters });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get problem by ID
  getProblemById: async (id) => {
    try {
      const response = await api.get(`/problems/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};

export default problemService;