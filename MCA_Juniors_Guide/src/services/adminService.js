const API_BASE_URL = 'https://api.vidivu.tech/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
};

export const adminService = {
  // Get pending senior approvals
  getPendingSeniors: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/admin/pending-seniors`, {
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch pending seniors');
      }

      const data = await response.json();
      return { success: true, data: data.pendingSeniors };
    } catch (error) {
      return { success: false, message: error.message };
    }
  },

  // Approve senior user
  approveSenior: async (userId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/admin/approve-senior/${userId}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error('Failed to approve senior');
      }

      const data = await response.json();
      return { success: true, data: data.user, message: data.message };
    } catch (error) {
      return { success: false, message: error.message };
    }
  },

  // Reject senior user (deletes user data)
  rejectSenior: async (userId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/admin/reject-senior/${userId}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error('Failed to reject senior');
      }

      const data = await response.json();
      return { success: true, message: data.message };
    } catch (error) {
      return { success: false, message: error.message };
    }
  },

  // Get all users
  getAllUsers: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/admin/users`, {
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }

      const data = await response.json();
      return { success: true, data: data.users };
    } catch (error) {
      return { success: false, message: error.message };
    }
  },

  // Delete user
  deleteUser: async (userId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/admin/users/${userId}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error('Failed to delete user');
      }

      const data = await response.json();
      return { success: true, message: data.message };
    } catch (error) {
      return { success: false, message: error.message };
    }
  },

  // Update user
  updateUser: async (userId, userData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/admin/users/${userId}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        throw new Error('Failed to update user');
      }

      const data = await response.json();
      return { success: true, data: data.user, message: data.message };
    } catch (error) {
      return { success: false, message: error.message };
    }
  },

  // Get all interview experiences
  getInterviewExperiences: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/admin/interview-experiences`, {
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch interview experiences');
      }

      const data = await response.json();
      return { success: true, data: data.experiences };
    } catch (error) {
      return { success: false, message: error.message };
    }
  },

  // Delete interview experience
  deleteInterviewExperience: async (experienceId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/admin/interview-experiences/${experienceId}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error('Failed to delete interview experience');
      }

      const data = await response.json();
      return { success: true, message: data.message };
    } catch (error) {
      return { success: false, message: error.message };
    }
  },

  // Get all problems
  getProblems: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/admin/problems`, {
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch problems');
      }

      const data = await response.json();
      return { success: true, data: data.problems };
    } catch (error) {
      return { success: false, message: error.message };
    }
  },

  // Delete problem
  deleteProblem: async (problemId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/admin/problems/${problemId}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error('Failed to delete problem');
      }

      const data = await response.json();
      return { success: true, message: data.message };
    } catch (error) {
      return { success: false, message: error.message };
    }
  },

  // Get all projects
  getProjects: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/admin/projects`, {
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch projects');
      }

      const data = await response.json();
      return { success: true, data: data.projects };
    } catch (error) {
      return { success: false, message: error.message };
    }
  },

  // Delete project
  deleteProject: async (projectId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/admin/projects/${projectId}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error('Failed to delete project');
      }

      const data = await response.json();
      return { success: true, message: data.message };
    } catch (error) {
      return { success: false, message: error.message };
    }
  },

  // Get all academic resources
  getAcademicResources: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/admin/academic-resources`, {
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch academic resources');
      }

      const data = await response.json();
      return { success: true, data: data.resources };
    } catch (error) {
      return { success: false, message: error.message };
    }
  },

  // Delete academic resource
  deleteAcademicResource: async (resourceId, resourceType, semesterId, subjectId) => {
    try {
      let endpoint;
      if (resourceType === 'material') {
        endpoint = `${API_BASE_URL}/admin/delete/materials/${semesterId}/${subjectId}/${resourceId}`;
      } else if (resourceType === 'questionPaper') {
        endpoint = `${API_BASE_URL}/admin/delete/questionPapers/${semesterId}/${subjectId}/${resourceId}`;
      } else {
        throw new Error('Invalid resource type');
      }

      const response = await fetch(endpoint, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error('Failed to delete academic resource');
      }

      const data = await response.json();
      return { success: true, message: data.message };
    } catch (error) {
      return { success: false, message: error.message };
    }
  },
};