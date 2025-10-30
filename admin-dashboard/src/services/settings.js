import api from './api';

export const settingsService = {
  // Get all settings
  getAllSettings: async () => {
    const response = await api.get('/settings');
    return response.data;
  },

  // Get settings by category
  getSettingsByCategory: async (category) => {
    const response = await api.get(`/settings/${category}`);
    return response.data;
  },

  // Get setting by key
  getSettingByKey: async (key) => {
    const response = await api.get(`/settings/key/${key}`);
    return response.data;
  },

  // Update settings by category
  updateSettingsByCategory: async (category, settings) => {
    const response = await api.put(`/settings/${category}`, settings);
    return response.data;
  },

  // Update setting by key
  updateSettingByKey: async (key, data) => {
    const response = await api.put(`/settings/key/${key}`, data);
    return response.data;
  },

  // Initialize default settings
  initializeDefaults: async () => {
    const response = await api.post('/settings/initialize');
    return response.data;
  },

  // Delete setting by key
  deleteSettingByKey: async (key) => {
    const response = await api.delete(`/settings/key/${key}`);
    return response.data;
  },

  // Export all settings
  exportSettings: async () => {
    const response = await api.get('/settings/export');
    return response.data;
  },

  // Import settings
  importSettings: async (settings) => {
    const response = await api.post('/settings/import', { settings });
    return response.data;
  },

  // Get public settings
  getPublicSettings: async () => {
    const response = await api.get('/settings/public');
    return response.data;
  }
};

export default settingsService; 