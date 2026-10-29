import api from './api';

export const dashboardService = {
  async getCounts() {
    const response = await api.get('/dashboard/count');
    return response.data || {};
  },

  async getRecentActivity() {
    const response = await api.get('/dashboard/activity');
    return response.data || [];
  }
};

export default dashboardService;
