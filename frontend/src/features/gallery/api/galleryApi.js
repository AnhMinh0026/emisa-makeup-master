import api from '../../../lib/axios.js';

export const galleryApi = {
  getAll: (params) => api.get('/images', { params }),
  upload: (formData) => api.post('/images', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  delete: (id) => api.delete(`/images/${id}`),
};
