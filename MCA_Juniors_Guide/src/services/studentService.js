import axios from 'axios';

const API_BASE_URL = 'https://padidaw-parama-backend.onrender.com/api';
const STORAGE_KEY = 'student_marking_data';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  },
});

// Add auth token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('current_student_auth');
      throw new Error('User not authenticated');
    }
    throw error;
  }
);

const getCurrentUserId = () => {
  const token = localStorage.getItem('token');
  if (token) {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.id; // Student ID from JWT
    } catch (e) {
      console.warn('Invalid token format');
      return null;
    }
  }
  return null;
};

const getLocalData = () => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
  } catch {
    return {};
  }
};

const saveLocalData = (data) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

export const studentService = {
  // Save or update student CGPA data
  saveStudentData: async (studentData) => {
    const userId = getCurrentUserId();
    if (!userId) throw new Error('User not authenticated');
    
    try {
      const payload = {
        registration_no: studentData.registration_no,
        name: studentData.name,
        semesters: studentData.semesters.map(sem => ({
          semester_number: sem.semester_number,
          courses: sem.courses.map(course => ({
            course_code: course.course_code,
            course_name: course.course_name,
            credits: course.credits,
            grade: course.grade,
            grade_points: course.grade_points
          }))
        }))
      };
      
      // Use POST for create/update (backend handles upsert)
      const response = await api.post('/students/data', payload);
      return response.data;
    } catch (error) {
      // Fallback to local storage
      const allData = getLocalData();
      allData[userId] = { ...studentData, lastUpdated: new Date().toISOString() };
      saveLocalData(allData);
      return { data: studentData, message: 'Saved locally' };
    }
  },

  // Get student CGPA data
  getStudentData: async () => {
    const userId = getCurrentUserId();
    if (!userId) throw new Error('User not authenticated');
    
    try {
      // Try API first
      const response = await api.get('/students/data');
      const dbData = response.data.data;
      
      // Return data in the format expected by frontend
      return {
        data: {
          registration_no: dbData.registration_no,
          name: dbData.name,
          semesters: dbData.semesters || []
        }
      };
    } catch (error) {
      if (error.response?.status === 404) {
        // No data found, return empty structure
        return {
          data: {
            registration_no: '',
            name: '',
            semesters: []
          }
        };
      }
      
      // Fallback to local storage
      const allData = getLocalData();
      const userData = allData[userId];
      
      if (!userData) {
        return {
          data: {
            registration_no: '',
            name: '',
            semesters: []
          }
        };
      }
      
      return { data: userData };
    }
  }
};

export default studentService;