/**
 * @file AuthContext.jsx
 * @description Authentication management context. Handles user registration, 
 * login, logout, and token persistence for the entire application.
 */

import React, { createContext, useState, useContext, useEffect } from 'react';
import { authAPI } from '../services/api.js';
import toast from 'react-hot-toast';

const AuthContext = createContext();

/**
 * Hook to access authentication context
 * @returns {Object} Authentication state and methods
 */
export const useAuth = () => useContext(AuthContext);

/**
 * Provider component for authentication context
 * @param {Object} props - Component props
 * @returns {JSX.Element} Auth provider
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  /**
   * Initializes authentication state from local storage on bootstrap
   */
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        const userStr = localStorage.getItem('user');
        
        if (token && userStr) {
          try {
            // Restore axios authorization header
            const API = (await import('../services/api.js')).default;
            API.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            
            const userData = JSON.parse(userStr);
            setUser(userData);
            setIsAuthenticated(true);
          } catch (e) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
          }
        }
      } catch (error) {
        // Auth initialization silent failure is acceptable, user remains guest
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  /**
   * Register a new user account
   * @param {Object} userData - User registration data
   * @returns {Promise<Object>} Status of registration
   */
  const register = async (userData) => {
    try {
      const response = await authAPI.register(userData);
      
      if (response.data.success) {
        toast.success('Registration successful. You can now log in.');
        return { 
          success: true, 
          data: response.data.data 
        };
      } else {
        throw new Error(response.data.error || 'Registration failed');
      }
    } catch (error) {
      let errorMsg = error.response?.data?.error || error.message || 'Registration failed';
      
      // Sanitize role-related error messages
      if (errorMsg.toLowerCase().includes('role')) {
        errorMsg = 'Select a valid role to complete registration.';
      }
      
      toast.error(errorMsg);
      return { 
        success: false, 
        error: errorMsg 
      };
    }
  };

  /**
   * Authenticate user credentials
   * @param {Object} credentials - Login credentials (email, password)
   * @returns {Promise<Object>} Status of authentication
   */
  const login = async (credentials) => {
    try {
      const response = await authAPI.login(credentials);
      
      if (response.data.success) {
        const { accessToken, data: userData } = response.data;
        
        // Persist session tokens locally
        localStorage.setItem('token', accessToken);
        localStorage.setItem('user', JSON.stringify(userData));
        
        // Update authorization header for active session
        const API = (await import('../services/api.js')).default;
        API.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
        
        setUser(userData);
        setIsAuthenticated(true);
        
        toast.success('Login successful');
        return { success: true, data: userData };
      } else {
        throw new Error(response.data.error || 'Login failed');
      }
    } catch (error) {
      const errorMsg = error.response?.data?.error || error.message || 'Login failed';
      toast.error(errorMsg);
      return { success: false, error: errorMsg };
    }
  };

  /**
   * Terminate active user session
   */
  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      // Logout failure usually means session was already invalid
    } finally {
      // Securely clear sensitive local state
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      
      const API = (await import('../services/api.js')).default;
      delete API.defaults.headers.common['Authorization'];
      
      setUser(null);
      setIsAuthenticated(false);
      
      toast.success('Logged out successfully');
    }
  };

  /**
   * Initiate password recovery process
   * @param {string} email - Registered email address
   * @returns {Promise<Object>} Recovery status
   */
  const forgotPassword = async (email) => {
    try {
      const response = await authAPI.forgotPassword(email);
      
      if (response.data.success) {
        toast.success(response.data.message || 'Password reset link sent to your email.');
        return { 
          success: true, 
          message: response.data.message
        };
      } else {
        throw new Error(response.data.error || 'Failed to send reset link');
      }
    } catch (error) {
      const errorMsg = error.response?.data?.error || error.message || 'Process failed';
      toast.error(errorMsg);
      throw new Error(errorMsg);
    }
  };

  /**
   * Complete password reset using token
   * @param {string} token - Verification token
   * @param {string} password - New password
   * @returns {Promise<Object>} Reset status
   */
  const resetPassword = async (token, password) => {
    try {
      const response = await authAPI.resetPassword({ token, password });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || error.message);
    }
  };

  /**
   * Helper to retrieve active session token
   * @returns {string|null} Access token
   */
  const getToken = () => localStorage.getItem('token');

  const contextValue = {
    user,
    loading,
    isAuthenticated,
    getToken,
    register,
    login,
    logout,
    forgotPassword,
    resetPassword
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};