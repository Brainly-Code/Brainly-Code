import { apiSlice } from "./apiSlice.jsx";

const COURSE_URL = "/courses"; 

const AdminSlice = apiSlice.injectEndpoints({
  endpoints: builders => ({
    createCourse : builders.mutation({
      query: data => ({
        url: `${COURSE_URL}/create`,
        method: "POST",
        body: data
      }),
    })
  })
})

export const {
  useCreateCourseMutation
} = AdminSlice
