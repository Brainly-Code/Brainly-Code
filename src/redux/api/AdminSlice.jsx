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

    createCourse: builder.mutation({
      query: (courseData) => ({
        url: '/courses/create',
        method: 'POST',
        body: courseData,
      }),
      invalidatesTags: ['Course'],
    }),

    deleteUser: builder.mutation({
      query: id => ({
        url: `${ADMIN_URL}/${id}`,
        method: "DELETE",
      })
    }),

    createLessonSolution: builder.mutation({
      query: data => ({
        url: `${ADMIN_URL}/lesson/solution`,
        method: "POST",
        body: data
      })
    }),


  }),
});

export const {
  useGetDashboardStatsQuery,
  useGetUsersQuery,
  useDeleteUserMutation,
  useCreateCourseMutation, // ✅ export this to use in components
  useCreateLessonSolutionMutation
} = AdminSlice;
