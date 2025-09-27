import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

// Simple hardcoded credentials. Change as needed.
const DEFAULT_EMAIL = "admin@example.com";
const DEFAULT_PASSWORD = "admin123";

type AuthUser = {
  email: string;
};

type AuthContextType = {
  user: AuthUser | null;
  isAuthenticated: boolean;
  login: (email: string, password: string, remember?: boolean) => Promise<boolean> | boolean;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    const remember = localStorage.getItem("auth_remember");
    const stored = remember ? localStorage.getItem("auth_user") : null;
    if (!remember) {
      // Ensure no auto-login without explicit remember flag
      localStorage.removeItem("auth_user");
    }
    if (remember && stored) {
      try {
        const parsed: AuthUser = JSON.parse(stored);
        setUser(parsed);
      } catch {
        localStorage.removeItem("auth_user");
        localStorage.removeItem("auth_remember");
      }
    }
  }, []);

  const login = (email: string, password: string, remember: boolean = false) => {
    const ok = email.trim() === DEFAULT_EMAIL && password === DEFAULT_PASSWORD;
    if (ok) {
      const u = { email };
      setUser(u);
      if (remember) {
        localStorage.setItem("auth_user", JSON.stringify(u));
        localStorage.setItem("auth_remember", "1");
      } else {
        localStorage.removeItem("auth_user");
        localStorage.removeItem("auth_remember");
      }
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("auth_user");
    localStorage.removeItem("auth_remember");
  };

  const value = useMemo<AuthContextType>(() => ({
    user,
    isAuthenticated: !!user,
    login,
    logout,
  }), [user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};

// ProtectedRoute helper component
import { Navigate, useLocation } from "react-router";
export const ProtectedRoute: React.FC<React.PropsWithChildren> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  if (!isAuthenticated) {
    return <Navigate to="/signin" replace state={{ from: location }} />;
  }
  return <>{children}</>;
};
