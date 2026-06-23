const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Get token from localStorage
const getToken = () => localStorage.getItem('token');

// Set token in localStorage
const setToken = (token) => localStorage.setItem('token', token);

// Remove token from localStorage
const removeToken = () => localStorage.removeItem('token');

// Helper function to make API calls
const apiCall = async (endpoint, options = {}) => {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Something went wrong');
  }

  return data;
};

// Auth API
export const authAPI = {
  register: async (name, email, password) => {
    const data = await apiCall('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    });
    if (data.token) setToken(data.token);
    return data;
  },

  login: async (email, password) => {
    const data = await apiCall('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    if (data.token) setToken(data.token);
    return data;
  },

  logout: () => {
    removeToken();
  },

  getMe: async () => {
    return apiCall('/auth/me');
  },
};

// Profile API
export const profileAPI = {
  updateProfile: async (profileData) => {
    return apiCall('/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  },

  getProfile: async () => {
    return apiCall('/profile');
  },
};

// Meals API
export const mealsAPI = {
  getAll: async () => {
    return apiCall('/meals');
  },

  getToday: async () => {
    return apiCall('/meals/today');
  },

  create: async (mealData) => {
    return apiCall('/meals', {
      method: 'POST',
      body: JSON.stringify(mealData),
    });
  },

  update: async (id, mealData) => {
    return apiCall(`/meals/${id}`, {
      method: 'PUT',
      body: JSON.stringify(mealData),
    });
  },

  delete: async (id) => {
    return apiCall(`/meals/${id}`, {
      method: 'DELETE',
    });
  },
};

export { getToken, setToken, removeToken };
