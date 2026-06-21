'use client';

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize auth state from localStorage
  useEffect(() => {
    const storedToken = localStorage.getItem('trao_token');
    const storedUser = localStorage.getItem('trao_user');

    if (storedToken && storedUser) {
      try {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      } catch (_) {
        localStorage.removeItem('trao_token');
        localStorage.removeItem('trao_user');
      }
    }
    setLoading(false);
  }, []);

  const login = useCallback(async (email, password) => {
    const data = await authService.login({ email, password });
    const { token: newToken, user: newUser } = data.data;
    localStorage.setItem('trao_token', newToken);
    localStorage.setItem('trao_user', JSON.stringify(newUser));
    setToken(newToken);
    setUser(newUser);
    return data;
  }, []);

  const register = useCallback(async (email, password, name) => {
    const data = await authService.register({ email, password, name });
    const { token: newToken, user: newUser } = data.data;
    localStorage.setItem('trao_token', newToken);
    localStorage.setItem('trao_user', JSON.stringify(newUser));
    setToken(newToken);
    setUser(newUser);
    return data;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('trao_token');
    localStorage.removeItem('trao_user');
    setToken(null);
    setUser(null);
  }, []);

  const isAuthenticated = !!token && !!user;

  return (
    <AuthContext.Provider value={{ user, token, loading, isAuthenticated, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
