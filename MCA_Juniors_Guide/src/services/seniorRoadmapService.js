const API_BASE_URL = 'https://padidaw-parama-backend.onrender.com/api';


class SeniorRoadmapService {
  // Submit roadmap with resume upload
  async submitRoadmap(formData) {
    try {
      const response = await fetch(`${API_BASE_URL}/roadmaps/submit`, {
        method: 'POST',
        body: formData, // FormData object with file
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to submit roadmap');
      }

      return data;
    } catch (error) {
      console.error('Error submitting roadmap:', error);
      throw error;
    }
  }

  // Get approved roadmaps with filtering and pagination
  async getApprovedRoadmaps(params = {}) {
    try {
      const queryParams = new URLSearchParams();
      
      if (params.domain) queryParams.append('domain', params.domain);
      if (params.page) queryParams.append('page', params.page);
      if (params.limit) queryParams.append('limit', params.limit);

      const response = await fetch(`${API_BASE_URL}/roadmaps/approved?${queryParams}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch roadmaps');
      }

      return data;
    } catch (error) {
      console.error('Error fetching roadmaps:', error);
      throw error;
    }
  }

  // Get single roadmap by ID
  async getRoadmapById(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/roadmaps/approved/${id}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch roadmap');
      }

      return data;
    } catch (error) {
      console.error('Error fetching roadmap:', error);
      throw error;
    }
  }

  // Admin: Get all roadmaps
  async getAllRoadmaps(params = {}, token) {
    try {
      const queryParams = new URLSearchParams();
      
      if (params.status) queryParams.append('status', params.status);
      if (params.domain) queryParams.append('domain', params.domain);
      if (params.page) queryParams.append('page', params.page);
      if (params.limit) queryParams.append('limit', params.limit);

      const response = await fetch(`${API_BASE_URL}/roadmaps/admin/all?${queryParams}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch roadmaps');
      }

      return data;
    } catch (error) {
      console.error('Error fetching all roadmaps:', error);
      throw error;
    }
  }

  // Admin: Update roadmap status
  async updateRoadmapStatus(id, isApproved, token) {
    try {
      const response = await fetch(`${API_BASE_URL}/roadmaps/admin/${id}/status`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isApproved }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update roadmap status');
      }

      return data;
    } catch (error) {
      console.error('Error updating roadmap status:', error);
      throw error;
    }
  }

  // Admin: Delete roadmap
  async deleteRoadmap(id, token) {
    try {
      const response = await fetch(`${API_BASE_URL}/roadmaps/admin/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to delete roadmap');
      }

      return data;
    } catch (error) {
      console.error('Error deleting roadmap:', error);
      throw error;
    }
  }
}

export default new SeniorRoadmapService();