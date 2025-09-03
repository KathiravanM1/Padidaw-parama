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
      console.log('Token payload:', payload); // Debug log
      return payload.userId || payload.id; // Student ID from JWT
    } catch (e) {
      console.warn('Invalid token format:', e);
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
  // Get student scores - Main function to fetch data
  getStudentData: async () => {
    const userId = getCurrentUserId();
    if (!userId) throw new Error('User not authenticated');
    
    try {
      console.log('Fetching student data from API...');
      console.log('Making request to:', `${API_BASE_URL}/students/scores`);
      
      // First test if the route is accessible
      try {
        const testResponse = await api.get('/students/test');
        console.log('Test endpoint response:', testResponse.data);
        
        // Check what's in the database
        const debugResponse = await api.get('/students/debug/all');
        console.log('Database contents:', debugResponse.data);
      } catch (testError) {
        console.error('Test endpoint failed:', testError.response?.data || testError.message);
      }
      
      const response = await api.get('/students/scores');
      console.log('API Response status:', response.status);
      console.log('API Response data:', response.data);
      const dbData = response.data.data;
      
      console.log('Received student data:', dbData);
      
      return {
        data: {
          registration_no: dbData.registration_no || '',
          name: dbData.name || '',
          current_cgpa: dbData.current_cgpa || 0,
          semesters: dbData.semesters || [],
          hasData: dbData.hasData || false
        }
      };
    } catch (error) {
      console.error('Error fetching student data:', error);
      
      if (error.response?.status === 403) {
        throw new Error('Access denied. Only students can access this data.');
      }
      
      // Fallback to local storage
      const allData = getLocalData();
      const userData = allData[userId];
      
      if (!userData) {
        return {
          data: {
            registration_no: '',
            name: '',
            current_cgpa: 0,
            semesters: [],
            hasData: false
          }
        };
      }
      
      return { data: { ...userData, hasData: true } };
    }
  },

  // Save or update student data
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
      
      console.log('Saving student data:', payload);
      
      // Try to update first, if fails then add
      try {
        const response = await api.put('/students/scores', payload);
        console.log('Data updated successfully');
        return response.data;
      } catch (updateError) {
        if (updateError.response?.status === 404) {
          // No existing data, create new
          const response = await api.post('/students/scores', payload);
          console.log('Data created successfully');
          return response.data;
        }
        throw updateError;
      }
    } catch (error) {
      console.error('Error saving student data:', error);
      
      if (error.response?.status === 403) {
        throw new Error('Access denied. Only students can save data.');
      }
      
      // Fallback to local storage
      const allData = getLocalData();
      allData[userId] = { ...studentData, lastUpdated: new Date().toISOString() };
      saveLocalData(allData);
      return { data: studentData, message: 'Saved locally' };
    }
  }
};

export default studentService;