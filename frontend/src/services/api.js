/**
 * @file api.js
 * @description Centralized Axios API client with request/response interceptors
 * for authentication, error handling, and organized API method collections.
 */

import axios from 'axios';

// Create a pre-configured Axios instance pointing to the backend API
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://book-store-l8lq.onrender.com/api',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

/**
 * Request interceptor: Attaches the Bearer token to all non-public routes.
 */
API.interceptors.request.use(
  (config) => {
    // Public auth routes that do not require an Authorization header
    const noAuthRoutes = [
      '/auth/forgot-password',
      '/auth/register',
      '/auth/login',
      '/auth/reset-password',
      '/auth/google',
      '/auth/google/callback'
    ];

    const isAuthRoute = noAuthRoutes.some(route => config.url.includes(route));

    if (!isAuthRoute) {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * Response interceptor: Handles errors including connection issues and 401 Unauthorized.
 */
API.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Handle connection errors
    if (!error.response) {
      if (error.code === 'ECONNABORTED') {
        console.error('Backend connection timeout');
        error.message = 'Backend server is not responding. Please try again.';
      } else if (error.message === 'Network Error' || !navigator.onLine) {
        console.error('Network error or backend is down');
        error.message = 'Cannot connect to backend server. Please check if it is running on port 5002.';
      }
    }

    // Handle 401 Unauthorized
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');

      if (
        !window.location.pathname.includes('/login') &&
        !window.location.pathname.includes('/register')
      ) {
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

// Authentication endpoints
export const authAPI = {
register: async (userData) => {
  try {
    const res = await API.post('/auth/register', userData);
    return { success: true, ...res.data };
  } catch (err) {
    return handleApiError(err);
  }
},
  login: async (userData) => {
  try {
    const res = await API.post('/auth/login', userData);

    localStorage.setItem('token', res.data.accessToken);
    localStorage.setItem('user', JSON.stringify(res.data.data));

    return { success: true, ...res.data };
  } catch (err) {
    return handleApiError(err);
  }
},
  forgotPassword: (email) => API.post('/auth/forgot-password', { email }),
  resetPassword: (data) => API.post('/auth/reset-password', data),
  logout: () => API.post('/auth/logout'),
  getMe: () => API.get('/auth/me'),
  refreshToken: () => API.post('/auth/refresh'),
  googleAuth: () => API.get('/auth/google/status'),
  initiateGoogleLogin: () => {
window.location.href = `${import.meta.env.VITE_API_URL}/auth/google`;  }
};

// Book catalog endpoints
export const bookAPI = {
  getBooks: (params = {}) => API.get('/books', { params }),
  getBook: (id) => API.get(`/books/${id}`),
  createBook: (bookData) => API.post('/books', bookData),
  updateBook: (id, bookData) => API.put(`/books/${id}`, bookData),
  deleteBook: (id) => API.delete(`/books/${id}`),
  getGenres: () => API.get('/books/genres'),
  getPriceRange: () => API.get('/books/price-range'),
  getBooksByUser: (userId) => API.get(`/books/user/${userId}`),
};

// User profile and favorites endpoints
export const userAPI = {
  getProfile: () => API.get('/users/profile'),
  updateProfile: (userData) => API.put('/users/profile', userData),
  getFavorites: () => API.get('/users/favorites'),
  addToFavorites: (bookId) => API.post(`/users/favorites/${bookId}`),
  removeFromFavorites: (bookId) => API.delete(`/users/favorites/${bookId}`),
  getStats: () => API.get('/users/stats'),
  getDashboardData: () => API.get('/users/dashboard'),
};

// File upload and image retrieval endpoints
export const uploadAPI = {
  /** Upload a book cover image using multipart/form-data */
  uploadBookCover: (file) => {
    const formData = new FormData();
    formData.append('coverImage', file);

    return API.post('/uploads/book-cover', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },

  /** Returns the full URL for a stored book cover image */
getBookCover: (fileId) => {
  if (!fileId) return null;

  const baseUrl = import.meta.env.VITE_API_URL || 'https://book-store-l8lq.onrender.com/api';
  return `${baseUrl}/uploads/image/${fileId}`;
},
  /** Delete a stored book cover image by file ID */
  deleteBookCover: (fileId) => API.delete(`/uploads/image/${fileId}`)
};

// Admin management endpoints
export const adminAPI = {
  // User management
  getAllUsers: (params = {}) => API.get('/admin/users', { params }),
  getUserById: (id) => API.get(`/admin/users/${id}`),
  updateUser: (userId, userData) => API.put(`/admin/users/${userId}`, userData),
  updateUserRole: (userId, roleData) => API.put(`/admin/users/${userId}/role`, roleData),
  toggleUserStatus: (userId, statusData) => API.put(`/admin/users/${userId}/status`, statusData),
  deleteUser: (userId) => API.delete(`/admin/users/${userId}`),

  // Book management
  getAllBooks: (params = {}) => API.get('/admin/books', { params }),
  updateBook: (bookId, bookData) => API.put(`/admin/books/${bookId}`, bookData),
  deleteBook: (bookId) => API.delete(`/admin/books/${bookId}`),

  // Create a new user (admin-only)
  createUser: (userData) => API.post('/admin/users/new', userData),

  // System statistics and analytics
  getDashboard: () => API.get('/admin/dashboard'),
  getStats: () => API.get('/admin/stats'),

  // Role management
  getAllRoles: () => API.get('/admin/roles'),
  updateRolePermissions: (roleId, permissions) =>
    API.put(`/admin/roles/${roleId}/permissions`, permissions),

  // User activity logs
  getUserActivity: (userId, params = {}) =>
    API.get(`/admin/activity/${userId}`, { params }),
};

/**
 * Normalizes an Axios error into a consistent response shape.
 * @param {Error} error - The caught Axios error
 * @returns {Object} Normalized error object
 */
export const handleApiError = (error) => {
  if (error.response) {
    return {
      success: false,
      status: error.response.status,
      error: error.response.data?.error || 'Server error',
      data: error.response.data
    };
  } else if (error.request) {
    return {
      success: false,
      status: 0,
      error: 'Network error. Please check your connection.',
      data: null
    };
  } else {
    return {
      success: false,
      status: -1,
      error: error.message || 'Unknown error occurred',
      data: null
    };
  }
};

export default API;