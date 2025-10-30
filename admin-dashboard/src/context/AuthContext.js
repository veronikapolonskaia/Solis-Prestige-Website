import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext();

const initialState = {
  user: null,
  token: localStorage.getItem(process.env.REACT_APP_JWT_STORAGE_KEY || 'ecommerce_admin_token'),
  isAuthenticated: false,
  loading: true,
  error: null,
};

const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN_START':
      return {
        ...state,
        loading: true,
        error: null,
      };
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        loading: false,
        error: null,
      };
    case 'LOGIN_FAILURE':
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        loading: false,
        error: action.payload,
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        loading: false,
        error: null,
      };
    case 'UPDATE_USER':
      return {
        ...state,
        user: action.payload,
      };
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload,
      };
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
      };
    default:
      return state;
  }
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Check if user is authenticated on app load
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem(process.env.REACT_APP_JWT_STORAGE_KEY || 'ecommerce_admin_token');
      
      if (token) {
        try {
          const response = await authAPI.getProfile();
          dispatch({
            type: 'LOGIN_SUCCESS',
            payload: {
              user: response.data.data,
              token,
            },
          });
        } catch (error) {
          // Token is invalid, remove it
          localStorage.removeItem(process.env.REACT_APP_JWT_STORAGE_KEY || 'ecommerce_admin_token');
          localStorage.removeItem(process.env.REACT_APP_REFRESH_TOKEN_KEY || 'ecommerce_admin_refresh_token');
          dispatch({ type: 'LOGOUT' });
        }
      } else {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };

    checkAuth();
  }, []);

  const login = async (credentials) => {
    dispatch({ type: 'LOGIN_START' });
    
    try {
      const response = await authAPI.login(credentials);
      const { user, token } = response.data.data;
      
      // Store token in localStorage
      localStorage.setItem(process.env.REACT_APP_JWT_STORAGE_KEY || 'ecommerce_admin_token', token);
      
      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: { user, token },
      });
      
      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Login failed';
      dispatch({
        type: 'LOGIN_FAILURE',
        payload: errorMessage,
      });
      return { success: false, error: errorMessage };
    }
  };

  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Remove tokens from localStorage
      localStorage.removeItem(process.env.REACT_APP_JWT_STORAGE_KEY || 'ecommerce_admin_token');
      localStorage.removeItem(process.env.REACT_APP_REFRESH_TOKEN_KEY || 'ecommerce_admin_refresh_token');
      
      dispatch({ type: 'LOGOUT' });
    }
  };

  const updateProfile = async (data) => {
    try {
      const response = await authAPI.updateProfile(data);
      dispatch({
        type: 'UPDATE_USER',
        payload: response.data.data,
      });
      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Profile update failed';
      dispatch({
        type: 'SET_ERROR',
        payload: errorMessage,
      });
      return { success: false, error: errorMessage };
    }
  };

  const changePassword = async (data) => {
    try {
      await authAPI.changePassword(data);
      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Password change failed';
      dispatch({
        type: 'SET_ERROR',
        payload: errorMessage,
      });
      return { success: false, error: errorMessage };
    }
  };

  const clearError = () => {
    dispatch({ type: 'SET_ERROR', payload: null });
  };

  const value = {
    ...state,
    login,
    logout,
    updateProfile,
    changePassword,
    clearError,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 