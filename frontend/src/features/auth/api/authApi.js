import axios from '../../../lib/axios.js';

export const authApi = {
  login: async (credentials) => {
    const response = await axios.post('/auth/login', credentials);
    return response.data;
  }
};
