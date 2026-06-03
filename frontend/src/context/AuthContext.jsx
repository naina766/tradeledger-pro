import React, { createContext, useState, useEffect } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async () => {
    try {
      const res = await api.get('/auth/profile');
      setUser(res.data.data.user);
    } catch (err) {
      localStorage.clear();
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      fetchProfile();
    } else {
      setLoading(false);
    }

    // Auto-logout listener for Axios interceptor failures
    const handleAutoLogout = () => {
      setUser(null);
      toast.error('Session expired. Please log in again.');
    };

    window.addEventListener('auth-logout', handleAutoLogout);
    return () => {
      window.removeEventListener('auth-logout', handleAutoLogout);
    };
  }, []);

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    const { user: userProfile, accessToken, refreshToken } = res.data.data;

    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    setUser(userProfile);
    toast.success('Logged in successfully!');
    return userProfile;
  };

  const register = async (name, email, password, confirmPassword) => {
    const res = await api.post('/auth/register', { name, email, password, confirmPassword });
    const { user: userProfile, accessToken, refreshToken } = res.data.data;

    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    setUser(userProfile);
    toast.success('Registered and logged in successfully!');
    return userProfile;
  };

  const logout = async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        await api.post('/auth/logout', { refreshToken });
      }
    } catch (err) {
      // Suppress endpoint error if token is already invalidated
    } finally {
      localStorage.clear();
      setUser(null);
      toast.success('Logged out successfully.');
    }
  };

  const updateProfile = (updatedUser) => {
    setUser(updatedUser);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateProfile, fetchProfile }}>
      {children}
    </AuthContext.Provider>
  );
};
