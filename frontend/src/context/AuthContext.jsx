// context/AuthContext.jsx - IMPORTANT FIX
import React, { createContext, useState, useContext, useEffect } from 'react';
import { authAPI } from '../services/api.js';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  //  INITIALIZE AUTH ON MOUNT
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        const userStr = localStorage.getItem('user');
        
        if (token && userStr) {
          try {
            //  SET AXIOS HEADER FOR ALL FUTURE REQUESTS
            const API = (await import('../services/api.js')).default;
            API.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            
            const userData = JSON.parse(userStr);
            setUser(userData);
            setIsAuthenticated(true);
          } catch (e) {
            console.error('Error parsing user data:', e);
            localStorage.removeItem('token');
            localStorage.removeItem('user');
          }
        }
      } catch (error) {
        console.error('Auth initialization failed:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

 const register = async (userData) => {
  try {
    console.log('� Registering user:', userData);
    
    const response = await authAPI.register(userData);
    
    console.log('� Register API Response:', response.data);
    
    if (response.data.success) {
      toast.success('Registration successful! Please login.');
      return { 
        success: true, 
        data: response.data.data,
        message: 'Registration successful' 
      };
    } else {
      throw new Error(response.data.error || 'Registration failed');
    }
  } catch (error) {
    console.error('Register error:', error);
    
    //  SPECIFIC ERROR HANDLING FOR ROLE
    let errorMsg = error.response?.data?.error || error.message || 'Registration failed';
    
    if (errorMsg.includes('role') || errorMsg.includes('Role')) {
      errorMsg = 'Invalid role selected. Please choose a valid role.';
    }
    
    toast.error(errorMsg);
    return { 
      success: false, 
      error: errorMsg 
    };
  }
};
  const login = async (credentials) => {
    try {
      const response = await authAPI.login(credentials);
      
      console.log('� Login Response:', response.data);
      
      if (response.data.success) {
        const { accessToken, data: userData } = response.data;
        
        //  SAVE TO LOCALSTORAGE
        localStorage.setItem('token', accessToken);
        localStorage.setItem('user', JSON.stringify(userData));
        
        //  SET AXIOS HEADER FOR ALL FUTURE REQUESTS
        const API = (await import('../services/api.js')).default;
        API.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
        
        //  UPDATE STATE
        setUser(userData);
        setIsAuthenticated(true);
        
        toast.success('Login successful!');
        return { success: true, data: userData };
      } else {
        throw new Error(response.data.error || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      const errorMsg = error.response?.data?.error || error.message || 'Login failed';
      toast.error(errorMsg);
      return { success: false, error: errorMsg };
    }
  };

  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      //  CLEAR LOCALSTORAGE
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      
      //  CLEAR AXIOS HEADER
      const API = (await import('../services/api.js')).default;
      delete API.defaults.headers.common['Authorization'];
      
      //  UPDATE STATE
      setUser(null);
      setIsAuthenticated(false);
      
      toast.success('Logged out successfully');
    }
  };

  const forgotPassword = async (email) => {
    try {
      console.log('� Forgot password called with email:', email);
      
      const response = await authAPI.forgotPassword(email);
      console.log('� Forgot password response:', response.data);
      
      if (response.data.success) {
        toast.success(response.data.message || 'Reset link sent successfully');
        return { 
          success: true, 
          message: response.data.message,
          data: response.data 
        };
      } else {
        throw new Error(response.data.error || 'Failed to send reset link');
      }
    } catch (error) {
      console.error(' Forgot password error:', error);
      
      let errorMsg = 'Failed to send reset link';
      if (error.response?.data?.error) {
        errorMsg = error.response.data.error;
      } else if (error.message) {
        errorMsg = error.message;
      }
      
      toast.error(errorMsg);
      throw new Error(errorMsg);
    }
  };

  const resetPassword = async (token, password) => {
    try {
      const response = await authAPI.resetPassword({ token, password });
      return response.data;
    } catch (error) {
      const errorMsg = error.response?.data?.error || error.message;
      throw new Error(errorMsg);
    }
  };

  //  GET TOKEN FUNCTION
  const getToken = () => {
    return localStorage.getItem('token');
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    getToken, //  EXPORT GET TOKEN
    register,
    login,
    logout,
    forgotPassword,
    resetPassword
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};