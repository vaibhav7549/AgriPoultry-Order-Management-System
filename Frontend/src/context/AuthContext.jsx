import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../lib/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const shouldRemember = localStorage.getItem('agripoultry_remember') === 'true';
      if (!shouldRemember) return null;
      const saved = localStorage.getItem('agripoultry_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Fetch all users on mount (needed for ForgotPassword which accesses users array)
  useEffect(() => {
    api.get('/users').then(data => {
      // Map backend responses to frontend user shape
      const mapped = data.map(u => ({
        ...u,
        role: u.role?.toLowerCase(),
      }));
      setUsers(mapped);
    }).catch(() => {});
  }, []);

  /** Login: calls backend /api/auth/login */
  const login = (identifier, password, role, rememberMe = false) => {
    // Return a result object synchronously-looking (called inside setTimeout in Login.jsx)
    // We use a trick: store a promise and resolve it. But since Login.jsx uses setTimeout,
    // we need this to work synchronously. So we do a sync XMLHttpRequest as fallback,
    // or better: make it async and return the result.
    // The Login.jsx calls login() inside setTimeout and checks result.success immediately.
    // So we must return the result synchronously. Use XMLHttpRequest sync.
    try {
      const xhr = new XMLHttpRequest();
      xhr.open('POST', '/api/auth/login', false); // synchronous
      xhr.setRequestHeader('Content-Type', 'application/json');
      xhr.send(JSON.stringify({ identifier, password, role }));
      
      if (xhr.status === 200) {
        const resp = JSON.parse(xhr.responseText);
        if (resp.success && resp.user) {
          const safeUser = { ...resp.user, role: resp.user.role?.toLowerCase() };

          // Persist only when "Remember me" is enabled.
          try {
            if (rememberMe) {
              localStorage.setItem('agripoultry_remember', 'true');
              localStorage.setItem('agripoultry_user', JSON.stringify(safeUser));
            } else {
              localStorage.setItem('agripoultry_remember', 'false');
              localStorage.removeItem('agripoultry_user');
            }
          } catch {}

          setCurrentUser(safeUser);
          // Update users array
          setUsers(prev => {
            const exists = prev.find(u => u.id === safeUser.id);
            if (exists) return prev.map(u => u.id === safeUser.id ? safeUser : u);
            return [...prev, safeUser];
          });
          return { success: true, user: safeUser };
        }
        return { success: false, error: resp.error || 'Invalid credentials' };
      }
      return { success: false, error: 'Server error' };
    } catch (e) {
      return { success: false, error: 'Cannot connect to server' };
    }
  };

  /** Logout */
  const logout = () => {
    setCurrentUser(null);
    try {
      localStorage.setItem('agripoultry_remember', 'false');
      localStorage.removeItem('agripoultry_user');
    } catch {}
    localStorage.removeItem('agripoultry_user');
  };

  /** Register a new user via backend */
  const register = (userData) => {
    try {
      const xhr = new XMLHttpRequest();
      xhr.open('POST', '/api/auth/register', false);
      xhr.setRequestHeader('Content-Type', 'application/json');
      xhr.send(JSON.stringify(userData));

      if (xhr.status === 200) {
        const resp = JSON.parse(xhr.responseText);
        return resp;
      }
      return { success: false, error: 'Server error' };
    } catch (e) {
      return { success: false, error: 'Cannot connect to server' };
    }
  };

  /** Reset password via backend */
  const resetPassword = (identifier, newPassword) => {
    try {
      const xhr = new XMLHttpRequest();
      xhr.open('POST', '/api/auth/reset-password', false);
      xhr.setRequestHeader('Content-Type', 'application/json');
      xhr.send(JSON.stringify({ identifier, newPassword }));

      if (xhr.status === 200) {
        const resp = JSON.parse(xhr.responseText);
        return resp;
      }
      return { success: false, error: 'Server error' };
    } catch (e) {
      return { success: false, error: 'Cannot connect to server' };
    }
  };

  /** Update current user profile via backend */
  const updateProfile = (updates) => {
    const userId = currentUser?.userId;
    if (!userId) {
      // Fallback to local-only update
      setCurrentUser(prev => ({ ...prev, ...updates }));
      return;
    }
    api.put(`/users/${userId}/profile`, updates).then(updatedUser => {
      const safeUser = { ...updatedUser, role: updatedUser.role?.toLowerCase() };
      setCurrentUser(prev => ({ ...prev, ...safeUser }));
    }).catch(() => {
      // Fallback — update locally anyway
      setCurrentUser(prev => ({ ...prev, ...updates }));
    });
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
