import { apiSlice } from './apiSlice';

// Auth interfaces matching your backend
export interface User {
  id: number;
  username: string;
  email: string;
  full_name: string;
  created_at: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  full_name: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
  user: User;
}

export interface RegisterResponse {
  success: boolean;
  message: string;
  user: User;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  new_password: string;
}

// Auth API endpoints
export const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Login
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (credentials: LoginRequest) => ({
        url: '/login',
        method: 'POST',
        body: credentials,
      }),
      invalidatesTags: ['Auth'],
    }),
    
    // Register
    register: builder.mutation<RegisterResponse, RegisterRequest>({
      query: (userData: RegisterRequest) => ({
        url: '/register',
        method: 'POST',
        body: userData,
      }),
      invalidatesTags: ['Auth'],
    }),
    
    // Forgot Password
    forgotPassword: builder.mutation<{ message: string; reset_token?: string }, ForgotPasswordRequest>({
      query: (data: ForgotPasswordRequest) => ({
        url: '/forgot-password',
        method: 'POST',
        body: data,
      }),
    }),
    
    // Reset Password
    resetPassword: builder.mutation<{ message: string }, ResetPasswordRequest>({
      query: (data: ResetPasswordRequest) => ({
        url: '/reset-password',
        method: 'POST',
        body: data,
      }),
    }),
  }),
});

// Export hooks for usage in components
export const {
  useLoginMutation,
  useRegisterMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
} = authApi;
