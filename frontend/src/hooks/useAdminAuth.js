import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const useAdminAuth = () => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    const raw   = localStorage.getItem('adminData');
    if (token && raw) {
      try { setAdmin(JSON.parse(raw)); } catch { clearAuth(); }
    }
    setLoading(false);
  }, []);

  const clearAuth = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminData');
    setAdmin(null);
  };

  const login = (data) => {
    localStorage.setItem('adminToken', data.token);
    localStorage.setItem('adminData', JSON.stringify({ name: data.name, email: data.email }));
    setAdmin({ name: data.name, email: data.email });
  };

  const logout = () => {
    clearAuth();
    navigate('/admin/login');
  };

  return { admin, loading, login, logout, isAuthenticated: !!admin };
};
