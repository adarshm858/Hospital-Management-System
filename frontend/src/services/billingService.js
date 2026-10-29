import api from './api';

export const billingService = {
  async getAll() {
    const response = await api.get('/bills');
    return response.data || [];
  },

  async getById(id) {
    const response = await api.get(`/bills/${id}`);
    return response.data;
  },

  async create(billData) {
    const response = await api.post('/bills', billData);
    return response.data;
  },

  async update(id, billData) {
    const response = await api.put(`/bills/${id}`, billData);
    return response.data;
  },

  async delete(id) {
    const response = await api.delete(`/bills/${id}`);
    return response.data;
  },

  async downloadInvoicePdf(id, billId = '') {
    const response = await api.get(`/bills/${id}/invoice`, {
      responseType: 'blob'
    });
    const blob = new Blob([response.data], { type: 'application/pdf' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Invoice-${billId || id}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    return true;
  }
};

export default billingService;
