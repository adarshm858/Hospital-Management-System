import api from './api';

// Helper to decode JWT payload safely
export const parseJwt = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
};

export const authService = {
  async login(credentials) {
    const response = await api.post('/auth/login', credentials);
    const data = response.data;
    if (data && data.token) {
      localStorage.setItem('token', data.token);
      const decoded = parseJwt(data.token);
      const user = {
        email: decoded?.sub || credentials.email,
        role: decoded?.role || decoded?.authorities?.[0] || 'ADMIN',
        fullName: decoded?.name || credentials.email.split('@')[0]
      };
      localStorage.setItem('user', JSON.stringify(user));
    }
    return data;
  },

  async register(userData) {
    const response = await api.post('/auth/register', userData);
    const data = response.data;
    if (data && data.token) {
      localStorage.setItem('token', data.token);
      const decoded = parseJwt(data.token);
      const user = {
        email: decoded?.sub || userData.email,
        role: decoded?.role || userData.role || 'ADMIN',
        fullName: userData.fullName
      };
      localStorage.setItem('user', JSON.stringify(user));
    }
    return data;
  },

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getToken() {
    return localStorage.getItem('token');
  },

  isAuthenticated() {
    const token = localStorage.getItem('token');
    if (!token) return false;
    const decoded = parseJwt(token);
    if (!decoded || !decoded.exp) return true;
    return decoded.exp * 1000 > Date.now();
  },

  getCurrentUser() {
    const rawUser = localStorage.getItem('user');
    if (rawUser) {
      try {
        return JSON.parse(rawUser);
      } catch {
        // fallback
      }
    }
    const token = localStorage.getItem('token');
    if (token) {
      const decoded = parseJwt(token);
      if (decoded) {
        return {
          email: decoded.sub || 'user@medicare.hms',
          role: decoded.role || 'ADMIN',
          fullName: decoded.name || 'Hospital Administrator'
        };
      }
    }
    return {
      email: 'admin@medicare.hms',
      role: 'ADMIN',
      fullName: 'Dr. Admin'
    };
  }
};

export default authService;
