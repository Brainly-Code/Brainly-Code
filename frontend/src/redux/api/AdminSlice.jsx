import { apiSlice } from "./apiSlice.jsx";

const ADMIN_URL = "/admin"; 

const AdminSlice = apiSlice.injectEndpoints({
  endpoints: builders => ({
    getDashboardStats: builders.query({
      query: () => ({
        url: `${ADMIN_URL}/stats`,
      })
    })
  })
})

export const {
  useGetDashboardStatsQuery,
} = AdminSlice
