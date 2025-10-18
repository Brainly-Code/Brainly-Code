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

    getChallengeCompleters: builder.query({
      query: (challengeId) => ({
        url: `${ADMIN_URL}/challenge-completers/${challengeId}`,
        method: "GET"
      })
    }),
    
    getGraphStats: builder.query({
      query: () => ({
        url: `${ADMIN_URL}/graph-stats`,
        method: "GET",
      })
    }),

    correctCompleter: builder.mutation({
  query: (data) => ({
    url: `/admin/challenge-completers`,
    method: "PATCH",
    body: data,
  }),
}),

rejectChallengeAnswer: builder.mutation({
  query: (data) => ({
    url: `/admin/reject`,
    method: "PATCH",
    body: data
  }),
}),


  }),
});

export const {
  useGetDashboardStatsQuery,
  useGetUsersQuery,
  useDeleteUserMutation,
  useCreateCourseMutation,
  useCreateLessonSolutionMutation,
  useGetChallengeCompletersQuery,
  useCorrectCompleterMutation,
  useGetGraphStatsQuery,
  useRejectChallengeAnswerMutation
} = AdminSlice;
