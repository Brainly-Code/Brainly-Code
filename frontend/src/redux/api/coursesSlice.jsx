import { apiSlice } from "./apiSlice";

const COURSE_URL = "/courses";

const coursesApiSlice = apiSlice.injectEndpoints({
  endpoints: builders => ({
    getCourses: builders.query({
      query: () => ({
        url: `${COURSE_URL}`,
        method: "GET"
      })
    }),

    getCourseById: builders.query({
      query: id => ({
        url: `${COURSE_URL}/${id}`,
        method: "GET"
      }) 
    }) 
  })
})

export const {
  useGetCoursesQuery,
  useGetCourseByIdQuery,
} = coursesApiSlice