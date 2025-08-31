const API_BASE_URL = 'https://padidaw-parama-backend.onrender.com/api';

const contentService = {
  // Interview Experiences
  getInterviewExperiences: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/interview-experiences`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();
      return { success: response.ok, data: data.data || [], message: data.message };
    } catch (error) {
      return { success: false, message: 'Failed to fetch interview experiences' };
    }
  },

  createInterviewExperience: async (experienceData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/interview-experiences`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(experienceData)
      });
      const data = await response.json();
      return { success: response.ok, data: data.data, message: data.message };
    } catch (error) {
      return { success: false, message: 'Failed to create interview experience' };
    }
  },

  updateInterviewExperience: async (id, experienceData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/interview-experiences/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(experienceData)
      });
      const data = await response.json();
      return { success: response.ok, data: data.data, message: data.message };
    } catch (error) {
      return { success: false, message: 'Failed to update interview experience' };
    }
  },

  deleteInterviewExperience: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/interview-experiences/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();
      return { success: response.ok, message: data.message };
    } catch (error) {
      return { success: false, message: 'Failed to delete interview experience' };
    }
  },

  approveInterviewExperience: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/interview-experiences/${id}/approve`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();
      return { success: response.ok, message: data.message };
    } catch (error) {
      return { success: false, message: 'Failed to approve interview experience' };
    }
  },

  rejectInterviewExperience: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/interview-experiences/${id}/reject`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();
      return { success: response.ok, message: data.message };
    } catch (error) {
      return { success: false, message: 'Failed to reject interview experience' };
    }
  },

  // Problem Solutions
  getProblemSolutions: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/problem-solutions`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();
      return { success: response.ok, data: data.data || [], message: data.message };
    } catch (error) {
      return { success: false, message: 'Failed to fetch problem solutions' };
    }
  },

  createProblemSolution: async (solutionData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/problem-solutions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(solutionData)
      });
      const data = await response.json();
      return { success: response.ok, data: data.data, message: data.message };
    } catch (error) {
      return { success: false, message: 'Failed to create problem solution' };
    }
  },

  updateProblemSolution: async (id, solutionData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/problem-solutions/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(solutionData)
      });
      const data = await response.json();
      return { success: response.ok, data: data.data, message: data.message };
    } catch (error) {
      return { success: false, message: 'Failed to update problem solution' };
    }
  },

  deleteProblemSolution: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/problem-solutions/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();
      return { success: response.ok, message: data.message };
    } catch (error) {
      return { success: false, message: 'Failed to delete problem solution' };
    }
  },

  approveProblemSolution: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/problem-solutions/${id}/approve`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();
      return { success: response.ok, message: data.message };
    } catch (error) {
      return { success: false, message: 'Failed to approve problem solution' };
    }
  },

  rejectProblemSolution: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/problem-solutions/${id}/reject`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();
      return { success: response.ok, message: data.message };
    } catch (error) {
      return { success: false, message: 'Failed to reject problem solution' };
    }
  },

  // Project Guidelines
  getProjectGuidelines: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/project-guidelines`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();
      return { success: response.ok, data: data.data || [], message: data.message };
    } catch (error) {
      return { success: false, message: 'Failed to fetch project guidelines' };
    }
  },

  createProjectGuideline: async (guidelineData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/project-guidelines`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(guidelineData)
      });
      const data = await response.json();
      return { success: response.ok, data: data.data, message: data.message };
    } catch (error) {
      return { success: false, message: 'Failed to create project guideline' };
    }
  },

  updateProjectGuideline: async (id, guidelineData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/project-guidelines/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(guidelineData)
      });
      const data = await response.json();
      return { success: response.ok, data: data.data, message: data.message };
    } catch (error) {
      return { success: false, message: 'Failed to update project guideline' };
    }
  },

  deleteProjectGuideline: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/project-guidelines/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();
      return { success: response.ok, message: data.message };
    } catch (error) {
      return { success: false, message: 'Failed to delete project guideline' };
    }
  },

  approveProjectGuideline: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/project-guidelines/${id}/approve`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();
      return { success: response.ok, message: data.message };
    } catch (error) {
      return { success: false, message: 'Failed to approve project guideline' };
    }
  },

  rejectProjectGuideline: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/project-guidelines/${id}/reject`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();
      return { success: response.ok, message: data.message };
    } catch (error) {
      return { success: false, message: 'Failed to reject project guideline' };
    }
  },

  // Analytics
  getContentAnalytics: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/analytics/content`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();
      return { success: response.ok, data: data.data, message: data.message };
    } catch (error) {
      return { success: false, message: 'Failed to fetch analytics' };
    }
  }
};

export { contentService };