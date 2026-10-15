import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthResponse } from '../types';
import { authService } from '../services/authService';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  login: (data: { email: string; password: string }) => Promise<void>;
  register: (data: { full_name: string; email: string; password: string; phone?: string }) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
  loginAsDemo: (role: 'admin' | 'citizen') => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('civicai_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('civicai_token'));
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const initAuth = async () => {
      if (token) {
        try {
          const freshUser = await authService.getMe();
          setUser(freshUser);
          localStorage.setItem('civicai_user', JSON.stringify(freshUser));
        } catch (err) {
          console.error('Session validation failed:', err);
          authService.logout();
          setUser(null);
          setToken(null);
        }
      }
      setIsLoading(false);
    };
    initAuth();
  }, [token]);

  const handleAuthSuccess = (data: AuthResponse) => {
    setToken(data.access_token);
    setUser(data.user);
    localStorage.setItem('civicai_token', data.access_token);
    localStorage.setItem('civicai_user', JSON.stringify(data.user));
  };

  const login = async (credentials: { email: string; password: string }) => {
    setIsLoading(true);
    try {
      const data = await authService.login(credentials);
      handleAuthSuccess(data);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: { full_name: string; email: string; password: string; phone?: string }) => {
    setIsLoading(true);
    try {
      const data = await authService.register(userData);
      handleAuthSuccess(data);
    } finally {
      setIsLoading(false);
    }
  };

  const loginAsDemo = async (role: 'admin' | 'citizen') => {
    if (role === 'admin') {
      await login({
        email: 'admin@civicai.org',
        password: 'AdminPassword123!',
      });
    } else {
      await login({
        email: 'citizen.alex@civicai.org',
        password: 'CitizenPassword123!',
      });
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    setToken(null);
  };

  const refreshUser = async () => {
    if (token) {
      const freshUser = await authService.getMe();
      setUser(freshUser);
      localStorage.setItem('civicai_user', JSON.stringify(freshUser));
    }
  };

  const value = {
    user,
    token,
    isAuthenticated: !!user && !!token,
    isAdmin: user?.role === 'admin',
    isLoading,
    login,
    register,
    logout,
    refreshUser,
    loginAsDemo,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
