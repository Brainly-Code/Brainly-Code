import { fetchBaseQuery, createApi } from "@reduxjs/toolkit/query/react";

const baseQuery = fetchBaseQuery({ 
  baseUrl: 'http://localhost:3000',
  prepareHeaders: (headers, { getState }) => {
    const token = getState().auth?.userInfo?.access_token;  
<<<<<<< HEAD
=======
    
>>>>>>> 55e3e1576d7cd601157cc3a8d87cd33a55bc8491
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

