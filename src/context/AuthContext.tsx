import React, { createContext, useContext, useEffect, useMemo } from "react";
import { useAppSelector, useAppDispatch } from "../store/hooks";
import { logout as logoutAction } from "../store/slices/authSlice";

type AuthUser = {
  id: number;
  username: string;
  email: string;
  full_name: string;
};

type AuthContextType = {
  user: AuthUser | null;
  isAuthenticated: boolean;
  login: (email: string, password: string, remember?: boolean) => Promise<boolean> | boolean;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  // Get auth state from Redux instead of local state
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();

  // Dummy login function - actual login happens in SignInForm with RTK Query
  const login = (email: string, password: string, remember: boolean = false) => {
    // This is handled by RTK Query in SignInForm now
    return false;
  };

  const logout = () => {
    console.log("🚪 Logout called");
    // Dispatch Redux logout action
    dispatch(logoutAction());
    console.log("✅ Logout action dispatched");
  };

  const value = useMemo<AuthContextType>(() => ({
    user,
    isAuthenticated,
    login,
    logout,
  }), [user, isAuthenticated]);

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
  
  console.log("🔒 ProtectedRoute check:", { isAuthenticated, location: location.pathname });
  
  if (!isAuthenticated) {
    console.log("❌ Not authenticated, redirecting to /signin");
    return <Navigate to="/signin" replace state={{ from: location }} />;
  }
  
  console.log("✅ Authenticated, showing protected content");
  return <>{children}</>;
};
