import api from './api';

export const patientService = {
  async getAll() {
    const response = await api.get('/patients');
    return response.data || [];
  },

  async getById(id) {
    const response = await api.get(`/patients/${id}`);
    return response.data;
  },

  async getProfile(id) {
    const response = await api.get(`/patients/${id}/profile`);
    return response.data;
  },

  async create(patientData) {
    const response = await api.post('/patients', patientData);
    return response.data;
  },

  async update(id, patientData) {
    const response = await api.put(`/patients/${id}`, patientData);
    return response.data;
  },

  async delete(id) {
    const response = await api.delete(`/patients/${id}`);
    return response.data;
  }
};

export default patientService;
