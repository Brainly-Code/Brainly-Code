import { apiSlice } from "./apiSlice.jsx";

const ADMIN_URL = "/admin"; 

const AdminSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    getDashboardStats: builder.query({
      query: () => ({
        url: `${ADMIN_URL}/stats`,
      })
    }),

    getUsers: builder.query({
      query: () => ({
        url: `${ADMIN_URL}`,
        method: "GET",
      }),
      keepUnusedDataFor: 5
    }),
  }),
})

export const {
  useGetDashboardStatsQuery,
  useGetUsersQuery,
} = AdminSlice
