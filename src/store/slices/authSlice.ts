import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '../api/authApi';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

// Helper function to safely get from localStorage
const getStoredToken = () => {
  try {
    return localStorage.getItem('token');
  } catch {
    return null;
  }
};

const getStoredUser = () => {
  try {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  } catch {
    return null;
  }
};

const initialState: AuthState = {
  user: getStoredUser(),
  token: getStoredToken(),
  isAuthenticated: !!getStoredToken(),
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<{ user: User; token: string }>) => {
      console.log("🔐 setCredentials called with:", action.payload);
      const { user, token } = action.payload;
      state.user = user;
      state.token = token;
      state.isAuthenticated = true;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      console.log("✅ Credentials saved to localStorage and Redux");
    },
    logout: (state) => {
      console.log("🔄 Redux logout action triggered");
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      console.log("🧹 Auth state cleared and localStorage cleaned");
    },
    loadUserFromStorage: (state) => {
      console.log("📦 Checking localStorage for user data...");
      const token = localStorage.getItem('token');
      const userStr = localStorage.getItem('user');
      console.log("🔍 Found token:", !!token, "Found user:", !!userStr);
      
      if (token && userStr) {
        try {
          state.token = token;
          state.user = JSON.parse(userStr);
          state.isAuthenticated = true;
          console.log("✅ User loaded from localStorage:", state.user?.username);
        } catch (error) {
          console.error("❌ Error parsing user data:", error);
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
      } else {
        console.log("❌ No valid user data in localStorage");
      }
    },
  },
});

export const { setCredentials, logout, loadUserFromStorage } = authSlice.actions;
export default authSlice.reducer;
