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
      query: (id) => ({
        url: `${COURSE_URL}/like/${id}`,
        method: "POST",
      }),
    }),

    getUserLikedCourses: builder.query({
      query: () => ({
        url: `${COURSE_URL}/liked-courses`, // make sure your backend has this route
        method: "GET",
      }),
    }),
  }),
});



export const {
  useGetCoursesQuery,
  useGetCourseByIdQuery,
  useGetCoursesByCreatorQuery,
  useDeleteCourseMutation, 
  useLikeCourseMutation,
    useGetUserLikedCoursesQuery,
} = coursesApiSlice