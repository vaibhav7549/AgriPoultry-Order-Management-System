import React, { createContext, useContext, useState, useEffect } from 'react';
import { DUMMY_USERS } from '../data/mockData';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [users, setUsers] = useState(DUMMY_USERS);
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('agripoultry_user');
      return saved ? JSON.parse(saved) : null;
    } catch { return null; }
  });

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('agripoultry_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('agripoultry_user');
    }
  }, [currentUser]);

  /** Login: validates username/phone + password + role */
  const login = (identifier, password, role) => {
    const user = users.find(u =>
      (u.username === identifier || u.phone === identifier) &&
      u.password === password &&
      u.role === role
    );
    if (user) {
      const { password: _, ...safeUser } = user;
      setCurrentUser(safeUser);
      return { success: true, user: safeUser };
    }
    return { success: false, error: 'Invalid username/phone or password' };
  };

  /** Logout */
  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('agripoultry_user');
  };

  /** Register a new user (adds to in-memory array) */
  const register = (userData) => {
    const exists = users.find(u => u.username === userData.username || u.phone === userData.phone);
    if (exists) return { success: false, error: 'Username or phone already registered' };
    
    const newUser = {
      id: `${userData.role === 'distributor' ? 'D' : 'C'}${String(users.length + 1).padStart(3, '0')}`,
      avatar: userData.name?.charAt(0)?.toUpperCase() || 'U',
      ...userData,
    };
    setUsers(prev => [...prev, newUser]);
    return { success: true };
  };

  /** Reset password (finds user by phone/email and updates password in-memory) */
  const resetPassword = (identifier, newPassword) => {
    const idx = users.findIndex(u => u.phone === identifier || u.email === identifier);
    if (idx === -1) return { success: false, error: 'User not found' };
    setUsers(prev => {
      const updated = [...prev];
      updated[idx] = { ...updated[idx], password: newPassword };
      return updated;
    });
    return { success: true };
  };

  /** Update current user profile */
  const updateProfile = (updates) => {
    setCurrentUser(prev => ({ ...prev, ...updates }));
    setUsers(prev => prev.map(u => u.id === currentUser?.id ? { ...u, ...updates } : u));
  };

  return (
    <AuthContext.Provider value={{ currentUser, users, login, logout, register, resetPassword, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

export default AuthContext;
