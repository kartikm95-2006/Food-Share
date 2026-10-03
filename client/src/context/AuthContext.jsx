import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [demoUsers, setDemoUsers] = useState([]);
  const [theme, setTheme] = useState(localStorage.getItem('foodshare_theme') || 'dark');
  const [viewMode, setViewMode] = useState('responsive'); // 'responsive' | 'mobile_frame'

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('foodshare_theme', theme);
  }, [theme]);

  // Load demo users and current session
  useEffect(() => {
    async function initAuth() {
      try {
        // Fetch demo users for the viva switchbar
        const demoRes = await authApi.getDemoUsers().catch(() => ({ users: [] }));
        setDemoUsers(demoRes.users || []);

        const token = localStorage.getItem('foodshare_token');
        if (token) {
          const res = await authApi.getMe();
          setUser(res.user);
        } else if (demoRes.users && demoRes.users.length > 0) {
          // Default auto-login to first demo user (Kartik Mahindrakar) for seamless start
          const defaultUser = demoRes.users.find(u => u.email === 'kartik@foodshare.org') || demoRes.users[0];
          await quickSwitch(defaultUser);
        }
      } catch (err) {
        console.warn('Auto auth error:', err);
        localStorage.removeItem('foodshare_token');
      } finally {
        setLoading(false);
      }
    }

    initAuth();
  }, []);

  const login = async (email, password) => {
    const res = await authApi.login(email, password);
    localStorage.setItem('foodshare_token', res.token);
    setUser(res.user);
    return res.user;
  };

  const register = async (userData) => {
    const res = await authApi.register(userData);
    localStorage.setItem('foodshare_token', res.token);
    setUser(res.user);
    return res.user;
  };

  const logout = () => {
    localStorage.removeItem('foodshare_token');
    setUser(null);
  };

  // Quick 1-click switcher for college demonstration & viva
  const quickSwitch = async (targetUser) => {
    try {
      // Login with standard passwords
      const passwordMap = {
        'kartik@foodshare.org': 'donor123',
        'canteen@apsit.edu.in': 'canteen123',
        'ngo@helpinghands.org': 'ngo123',
        'rotibank@thane.org': 'roti123',
        'admin@foodshare.org': 'admin123'
      };
      const pwd = passwordMap[targetUser.email] || 'donor123';
      const res = await authApi.login(targetUser.email, pwd);
      localStorage.setItem('foodshare_token', res.token);
      setUser(res.user);
    } catch (err) {
      console.error('Quick switch failed:', err);
    }
  };

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  const toggleViewMode = () => {
    setViewMode(prev => (prev === 'responsive' ? 'mobile_frame' : 'responsive'));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        demoUsers,
        theme,
        viewMode,
        login,
        register,
        logout,
        quickSwitch,
        toggleTheme,
        toggleViewMode
      }}
    >
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
