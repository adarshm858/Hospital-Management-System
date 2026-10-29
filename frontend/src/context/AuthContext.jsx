import { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/authService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeRole, setActiveRoleState] = useState(() => {
    return localStorage.getItem('hms-active-role') || 'ADMIN';
  });

  useEffect(() => {
    try {
      if (authService.isAuthenticated()) {
        const currentUser = authService.getCurrentUser();
        setUser(currentUser);
        if (currentUser?.role && !localStorage.getItem('hms-active-role')) {
          setActiveRoleState(currentUser.role);
          localStorage.setItem('hms-active-role', currentUser.role);
        }
      } else {
        authService.logout();
        setUser(null);
      }
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const setActiveRole = (role) => {
    setActiveRoleState(role);
    localStorage.setItem('hms-active-role', role);
  };

  const login = async (credentials) => {
    const data = await authService.login(credentials);
    const currentUser = authService.getCurrentUser();
    setUser(currentUser);
    if (currentUser?.role) {
      setActiveRole(currentUser.role);
    }
    return data;
  };

  const register = async (userData) => {
    const data = await authService.register(userData);
    const currentUser = authService.getCurrentUser();
    setUser(currentUser);
    if (currentUser?.role) {
      setActiveRole(currentUser.role);
    }
    return data;
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        activeRole,
        setActiveRole,
        isAuthenticated: !!user && authService.isAuthenticated(),
        loading,
        login,
        register,
        logout
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
