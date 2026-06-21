import api from '../../../lib/axios.js';

export const contactApi = {
  getAll: () => api.get('/contact'),
  submitMessage: (data) => api.post('/contact/message', data),
  update: (data) => api.put('/contact', data),
};
