import api from './api';

export const prescriptionService = {
  async getAll() {
    const response = await api.get('/prescriptions');
    return response.data || [];
  },

  async getById(id) {
    const response = await api.get(`/prescriptions/${id}`);
    return response.data;
  },

  async create(prescriptionData) {
    const response = await api.post('/prescriptions', prescriptionData);
    return response.data;
  },

  async update(id, prescriptionData) {
    const response = await api.put(`/prescriptions/${id}`, prescriptionData);
    return response.data;
  },

  async delete(id) {
    const response = await api.delete(`/prescriptions/${id}`);
    return response.data;
  }
};

export default prescriptionService;
