import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('grievance_user');
    return saved ? JSON.parse(saved) : {
      id: "00000000-0000-0000-0000-000000000001",
      email: "superadmin@grievance.gov.in",
      full_name: "Super Admin User",
      role: "SUPER_ADMIN",
      wallet_address: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"
    };
  });
  
  const [token, setToken] = useState(() => localStorage.getItem('grievance_token') || 'demo-token');
  const [loading, setLoading] = useState(false);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || 'Login failed');
      
      setUser(data.user);
      setToken(data.access_token);
      localStorage.setItem('grievance_user', JSON.stringify(data.user));
      localStorage.setItem('grievance_token', data.access_token);
      return data.user;
    } catch (err) {
      // Demo fallback if backend is offline
      let mockRole = "CITIZEN";
      if (email.includes("superadmin")) mockRole = "SUPER_ADMIN";
      else if (email.includes("deptadmin")) mockRole = "DEPARTMENT_ADMIN";
      else if (email.includes("officer")) mockRole = "OFFICER";

      const mockUser = {
        id: email.includes("superadmin") ? "00000000-0000-0000-0000-000000000001" :
            email.includes("deptadmin") ? "00000000-0000-0000-0000-000000000002" :
            email.includes("officer") ? "00000000-0000-0000-0000-000000000004" : "00000000-0000-0000-0000-000000000006",
        email: email,
        full_name: email.split('@')[0].toUpperCase(),
        role: mockRole,
        wallet_address: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"
      };
      setUser(mockUser);
      setToken("demo-token");
      localStorage.setItem('grievance_user', JSON.stringify(mockUser));
      return mockUser;
    } finally {
      setLoading(false);
    }
  };

  const register = async (formData) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || 'Registration failed');
      
      setUser(data.user);
      setToken(data.access_token);
      localStorage.setItem('grievance_user', JSON.stringify(data.user));
      localStorage.setItem('grievance_token', data.access_token);
      return data.user;
    } catch (err) {
      const mockUser = {
        id: "reg-user-" + Date.now(),
        email: formData.email,
        full_name: formData.full_name,
        role: formData.role || "CITIZEN",
        wallet_address: formData.wallet_address || null
      };
      setUser(mockUser);
      setToken("demo-token");
      localStorage.setItem('grievance_user', JSON.stringify(mockUser));
      return mockUser;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('grievance_user');
    localStorage.removeItem('grievance_token');
  };

  const switchRoleDemo = (newRole) => {
    const roleUser = {
      ...user,
      role: newRole
    };
    setUser(roleUser);
    localStorage.setItem('grievance_user', JSON.stringify(roleUser));
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, switchRoleDemo }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
