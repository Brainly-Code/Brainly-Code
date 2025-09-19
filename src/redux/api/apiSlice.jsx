import { fetchBaseQuery, createApi } from '@reduxjs/toolkit/query/react';

const baseQuery = fetchBaseQuery({
  baseUrl: "https://backend-hx6c.onrender.com", // or your deployed URL
  credentials: "include",

  prepareHeaders: (headers, { getState }) => {
    const token = getState().auth.accessToken;
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

export const apiSlice = createApi({
  baseQuery,
  tagTypes: ['User', 'Videos', 'Comment'],
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => {
        return {
          url: '/auth/login',
          method: 'POST',
          body: credentials,
        };
      },
      transformResponse: (response) => {
        return response;
      },
      transformErrorResponse: (error) => {
        console.error('apiSlice: Login error:', error); // Debug
        return error;
      },
    }),
    register: builder.mutation({
      query: (data) => ({
        url: '/auth/signup',
        method: 'POST',
        body: data,
      }),
    }),
    refreshToken: builder.mutation({
      query: () => {
        return {
          url: '/auth/refresh',
          method: 'POST',
        };
      },
      transformResponse: (response) => {
        return response;
      },
      transformErrorResponse: (error) => {
        console.error('apiSlice: Refresh error:', error); // Debug
        return error;
      },
    }),
  }),
});

export const { useLoginMutation, useRegisterMutation, useRefreshTokenMutation } = apiSlice;
