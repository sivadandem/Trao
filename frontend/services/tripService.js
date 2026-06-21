import api from './api';

export const tripService = {
  // Generate new trip with AI
  generateTrip: async (data) => {
    const res = await api.post('/api/trips/generate', data);
    return res.data;
  },

  // Get all trips (with optional search/filter/pagination)
  getTrips: async (params = {}) => {
    const res = await api.get('/api/trips', { params });
    return res.data;
  },

  // Get single trip by ID
  getTripById: async (id) => {
    const res = await api.get(`/api/trips/${id}`);
    return res.data;
  },

  // Delete a trip
  deleteTrip: async (id) => {
    const res = await api.delete(`/api/trips/${id}`);
    return res.data;
  },

  // Add activity to a day
  addActivity: async (id, dayNumber, activity) => {
    const res = await api.patch(`/api/trips/${id}/add-activity`, { dayNumber, activity });
    return res.data;
  },

  // Remove activity from a day
  removeActivity: async (id, dayNumber, activityId) => {
    const res = await api.patch(`/api/trips/${id}/remove-activity`, { dayNumber, activityId });
    return res.data;
  },

  // Edit an existing activity
  editActivity: async (id, dayNumber, activityId, updates) => {
    const res = await api.patch(`/api/trips/${id}/edit-activity`, { dayNumber, activityId, updates });
    return res.data;
  },

  // Regenerate specific day with AI
  regenerateDay: async (id, dayNumber, instructions = '') => {
    const res = await api.patch(`/api/trips/${id}/regenerate-day`, { dayNumber, instructions });
    return res.data;
  },

  // Add packing item
  addPackingItem: async (id, item, category) => {
    const res = await api.post(`/api/trips/${id}/packing-list`, { item, category });
    return res.data;
  },

  // Toggle packing item completion
  updatePackingItem: async (id, itemId, completed) => {
    const res = await api.patch(`/api/trips/${id}/packing-list`, { itemId, completed });
    return res.data;
  },

  // Remove packing item
  removePackingItem: async (id, itemId) => {
    const res = await api.delete(`/api/trips/${id}/packing-list/${itemId}`);
    return res.data;
  },
};
