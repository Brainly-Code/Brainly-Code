import { apiSlice } from "./apiSlice.jsx";

const COURSE_URL = "/courses";

const coursesApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCourses: builder.query({
      query: () => ({
        url: `${COURSE_URL}`,
        method: "GET",
      }),
    }),

    getCourseById: builder.query({
      query: (id) => ({
        url: `${COURSE_URL}/${id}`,
        method: "GET",
      }),
    }),

    getCoursesByCreator: builder.query({
      query: () => ({
        url: `${COURSE_URL}/my-courses`,
        method: "GET",
      }),
    }),

    // ✅ Delete course by ID
    deleteCourse: builder.mutation({
      query: (id) => ({
        url: `${COURSE_URL}/${id}`,
        method: "DELETE",
      }),
    }),
    likeCourse: builder.mutation({
          query: (courseId) => ({
            url: `/courses/like/${courseId}`,
            method: 'POST', // or PATCH if your backend uses that
          }),
          invalidatesTags: ['LikedCourses','Courses'],
    }),
    getUserLikedCourses: builder.query({
      query: () => ({
        url: '/courses/liked-courses',
        method: 'GET',
      }),
      providesTags: ['LikedCourses'],
    }),


  }),
});



export const {
  useGetCoursesQuery,
  useGetCourseByIdQuery,
  useGetCoursesByCreatorQuery,
  useDeleteCourseMutation, 
  useLikeCourseMutation,
  useGetUserLikedCoursesQuery
} = coursesApiSlice