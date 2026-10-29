import api from './api';

export const appointmentService = {
  async getAll() {
    const response = await api.get('/appointments');
    return response.data || [];
  },

  async getById(id) {
    const response = await api.get(`/appointments/${id}`);
    return response.data;
  },

  async create(appointmentData) {
    const response = await api.post('/appointments', appointmentData);
    return response.data;
  },

  async update(id, appointmentData) {
    const response = await api.put(`/appointments/${id}`, appointmentData);
    return response.data;
  },

  async delete(id) {
    const response = await api.delete(`/appointments/${id}`);
    return response.data;
  }
};

export default appointmentService;
