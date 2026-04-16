// src/services/api.js - COMPLETELY CORRECTED VERSION
import axios from 'axios';

// Create axios instance
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

//  Get auth headers function
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Request interceptor
API.interceptors.request.use(
  (config) => {
    // Don't add Authorization header for auth routes
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
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
API.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    // Handle 401 Unauthorized
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      if (!window.location.pathname.includes('/login') && 
          !window.location.pathname.includes('/register')) {
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);

// ==================== AUTH API ====================
export const authAPI = {
  register: (userData) => API.post('/auth/register', userData),
  login: (userData) => API.post('/auth/login', userData),
  forgotPassword: (email) => API.post('/auth/forgot-password', { email }),
  resetPassword: (data) => API.post('/auth/reset-password', data),
  logout: () => API.post('/auth/logout'),
  getMe: () => API.get('/auth/me'),
  refreshToken: () => API.post('/auth/refresh'),
  googleAuth: () => API.get('/auth/google/status'),
  initiateGoogleLogin: () => {
    window.location.href = `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/auth/google`;
  }
};

// ==================== BOOK API ====================
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

// ==================== USER API ====================
export const userAPI = {
  getProfile: () => API.get('/users/profile'),
  updateProfile: (userData) => API.put('/users/profile', userData),
  getFavorites: () => API.get('/users/favorites'),
  addToFavorites: (bookId) => API.post(`/users/favorites/${bookId}`),
  removeFromFavorites: (bookId) => API.delete(`/users/favorites/${bookId}`),
  getStats: () => API.get('/users/stats'),
  getDashboardData: () => API.get('/users/dashboard'),
};

// ==================== UPLOAD API ====================
export const uploadAPI = {
  // Upload book cover image to GridFS
  uploadBookCover: (file) => {
    const formData = new FormData();
    formData.append('coverImage', file);
    
    return API.post('/uploads/book-cover', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  },
  
  // Get book cover image by file ID
  getBookCover: (fileId) => `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/uploads/image/${fileId}`,
  
  // Delete book cover image
  deleteBookCover: (fileId) => API.delete(`/uploads/image/${fileId}`)
};

// ==================== ADMIN API - FIXED VERSION ====================
export const adminAPI = {
  //  USERS MANAGEMENT
  getAllUsers: (params = {}) => API.get('/admin/users', { params }),
  
  getUserById: (id) => API.get(`/admin/users/${id}`),
  
  updateUser: (userId, userData) => 
    API.put(`/admin/users/${userId}`, userData),
  
  updateUserRole: (userId, roleData) => 
    API.put(`/admin/users/${userId}/role`, roleData),
  
  toggleUserStatus: (userId, statusData) => 
    API.put(`/admin/users/${userId}/status`, statusData),
  
  deleteUser: (userId) => API.delete(`/admin/users/${userId}`),
  
  //  BOOKS MANAGEMENT
  getAllBooks: (params = {}) => API.get('/admin/books', { params }),
  
  updateBook: (bookId, bookData) => 
    API.put(`/admin/books/${bookId}`, bookData),
  
  deleteBook: (bookId) => API.delete(`/admin/books/${bookId}`),
  
  //  USER MANAGEMENT
  createUser: (userData) => API.post('/admin/users/new', userData),
  
  //  STATISTICS & REPORTS
 getSystemStats: () => API.get('/admin/dashboard'),
  
  getUserStats: () => API.get('/admin/user-stats'),
  
  //  ROLES MANAGEMENT
  getAllRoles: () => API.get('/admin/roles'),
  
  updateRolePermissions: (roleId, permissions) => 
    API.put(`/admin/roles/${roleId}/permissions`, permissions),
  
  //  ACTIVITY LOGS (optional)
  getUserActivity: (userId, params = {}) => 
    API.get(`/admin/activity/${userId}`, { params }),
};

// ==================== UTILITY ====================
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