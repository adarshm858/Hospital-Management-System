import api from './api';

export const labService = {
  // Lab Tests
  async getAllTests() {
    const response = await api.get('/lab-tests');
    return response.data || [];
  },

  async getTestById(id) {
    const response = await api.get(`/lab-tests/${id}`);
    return response.data;
  },

  async createTest(testData) {
    const response = await api.post('/lab-tests', testData);
    return response.data;
  },

  async updateTest(id, testData) {
    const response = await api.put(`/lab-tests/${id}`, testData);
    return response.data;
  },

  async deleteTest(id) {
    const response = await api.delete(`/lab-tests/${id}`);
    return response.data;
  },

  // Lab Reports
  async getAllReports() {
    const response = await api.get('/lab-reports');
    return response.data || [];
  },

  async getReportById(id) {
    const response = await api.get(`/lab-reports/${id}`);
    return response.data;
  },

  async getReportsByPatient(patientId) {
    const response = await api.get(`/lab-reports/patient/${patientId}`);
    return response.data || [];
  },

  async getReportsByDoctor(doctorId) {
    const response = await api.get(`/lab-reports/doctor/${doctorId}`);
    return response.data || [];
  },

  async createReport(reportData) {
    const response = await api.post('/lab-reports', reportData);
    return response.data;
  },

  async updateReport(id, reportData) {
    const response = await api.put(`/lab-reports/${id}`, reportData);
    return response.data;
  },

  async deleteReport(id) {
    const response = await api.delete(`/lab-reports/${id}`);
    return response.data;
  }
};

export default labService;
