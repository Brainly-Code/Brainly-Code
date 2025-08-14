// src/redux/api/miniModuleApi.js
import { apiSlice } from './apiSlice'; // Your base RTK Query apiSlice

const MINI_MODULE_URL = '/mini-modules';

export const miniModuleApi = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    createMiniModule: build.mutation({
      query: (data) => ({
        url: MINI_MODULE_URL,
        method: 'POST',
        body: data,
      }),
    }),
    getMiniModulesPerModule: build.query({
      query: (courseModuleId) => `${MINI_MODULE_URL}/${courseModuleId}`,
    }),
  }),
});

export const {
  useCreateMiniModuleMutation,
  useGetMiniModulesPerModuleQuery,
} = miniModuleApi;
