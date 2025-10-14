import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { RootState } from '../store';

// Real API configuration for your FastAPI backend
export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:8002', // Your FastAPI backend URL
    prepareHeaders: (headers, { getState }) => {
      // Add auth token if available
      const token = (getState() as RootState).auth?.token;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      headers.set('content-type', 'application/json');
      return headers;
    },
  }),
  // Tag types for cache invalidation
  tagTypes: ['Client', 'Bot', 'User', 'Auth'],
  // Define endpoints
  endpoints: () => ({}),
});

export default apiSlice;
