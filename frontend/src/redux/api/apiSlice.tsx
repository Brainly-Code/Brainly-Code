import { fetchBaseQuery, createApi } from "@reduxjs/toolkit/query/react";

const baseQuery = fetchBaseQuery({ 
  baseUrl: 'http://localhost:3000',
  prepareHeaders: (headers, { getState }) => {
      // @ts-ignore
    const token = getState()?.auth?.userInfo?.accessToken;
    if(token) {
      headers.set('Authorization', `Bearer ${token}`)
    }
    
    return headers;
  },
  credentials: "include"  
});

export const apiSlice = createApi({
  baseQuery,
  tagTypes: ['User'],
  endpoints: () => ({}),
});

