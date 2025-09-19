import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;
// Create axios instance with base configuration
const api = axios.create({
  baseURL: API_URL || 'http://localhost:5000/api',
  timeout: 30000, // 30 seconds timeout for file uploads
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding auth tokens
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for handling errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('adminToken');
      window.location.href = '/admin/login';
    }
    return Promise.reject(error);
  }
);

// File upload service
export const uploadService = {
  // Upload files to backend
  uploadFiles: async (files, metadata, onProgress) => {
    const uploadedFiles = [];
    const totalFiles = files.length;
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const formData = new FormData();
      formData.append('file', file);
      
      const uploadType = metadata.type === 'question-paper' ? 'questionPapers' : 'materials';
      const endpoint = `/upload/${metadata.semesterId}/${metadata.subjectId}/${uploadType}`;
      
      try {
        const response = await api.post(endpoint, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          onUploadProgress: (progressEvent) => {
            const fileProgress = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            const totalProgress = Math.round(
              ((i * 100) + fileProgress) / totalFiles
            );
            if (onProgress) {
              onProgress(totalProgress);
            }
          },
        });
        
        uploadedFiles.push(response.data.file);
      } catch (error) {
        throw new Error(
          error.response?.data?.message || 
          `Failed to upload ${file.name}. Please try again.`
        );
      }
    }
    
    return { files: uploadedFiles };
  },

  // Get uploaded files by filters
  getFiles: async (filters = {}) => {
    try {
      const response = await api.get('/files', { params: filters });
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || 
        'Failed to fetch files.'
      );
    }
  },

  // Delete file
  deleteFile: async (fileId) => {
    try {
      const response = await api.delete(`/files/${fileId}`);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || 
        'Failed to delete file.'
      );
    }
  },
};

// Health check
export const healthCheck = async () => {
  try {
    const response = await api.get('/health');
    return response.data;
  } catch (error) {
    throw new Error('Backend service unavailable');
  }
};

// Get semesters
export const getSemesters = async () => {
  try {
    const response = await api.get('/semesters');
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch semesters');
  }
};

export const addSubject = async (semId, subjectData) => {
  const response = await axios.post(
    `${import.meta.env.VITE_API_URL}/semesters/${semId}/subjects`,
    subjectData // ✅ send object directly
  );
  return response.data;
};

export default api;