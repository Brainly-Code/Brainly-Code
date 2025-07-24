import { apiSlice } from "./apiSlice.jsx";

const ADMIN_URL = "/admin"; 

const AdminSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getDashboardStats: builder.query({
      query: () => ({
        url: `${ADMIN_URL}/stats`,
      }),
    }),

    createCourse: builder.mutation({
      query: (courseData) => ({
        url: '/courses/create',
        method: 'POST',
        body: courseData,
      }),
      invalidatesTags: ['Course'],
    }),
  }),
});

export const {
  useGetDashboardStatsQuery,
  useCreateCourseMutation, // ✅ export this to use in components
} = AdminSlice;
