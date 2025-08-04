import { fetchBaseQuery, createApi } from "@reduxjs/toolkit/query/react";

const baseQuery = fetchBaseQuery({ 
  baseUrl: 'http://localhost:3000',
  prepareHeaders: (headers, { getState }) => {
    const token = getState().auth?.userInfo?.access_token;

    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  },
  
  credentials: "include"  
});

export const apiSlice = createApi({
  baseQuery,
  tagTypes: ['User','Videos'],
  endpoints: () => ({}),
});

