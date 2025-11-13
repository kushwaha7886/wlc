import api from './api.js';

export const authService = {
  // Login user
  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data.data || response.data;
  },

  // Register user
  register: async (userData) => {
    const formData = new FormData();
    formData.append('name', userData.fullName);
    formData.append('email', userData.email);
    formData.append('password', userData.password);
    formData.append('phone', userData.phone);
    formData.append('address', userData.address);
    if (userData.avatar) {
      formData.append('avatar', userData.avatar);
    }

    const response = await api.post('/auth/register', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Refresh token
  refresh: async () => {
    const response = await api.post('/auth/refresh');
    return response.data;
  },

  // Logout user
  logout: async () => {
    const response = await api.post('/auth/logout');
    return response.data;
  },
};
