import api from './api';

export const authService = {
  register: async (data) => {
    const res = await api.post('/api/auth/register', data);
    return res.data;
  },

  login: async (data) => {
    const res = await api.post('/api/auth/login', data);
    return res.data;
  },

  getMe: async () => {
    const res = await api.get('/api/auth/me');
    return res.data;
  },

  forgotPassword: async (email) => {
    const res = await api.post('/api/auth/forgot-password', { email });
    return res.data;
  },

  resetPassword: async (token, password) => {
    const res = await api.post('/api/auth/reset-password', { token, password });
    return res.data;
  },
};
