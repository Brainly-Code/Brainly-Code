import { apiSlice } from "./apiSlice";

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
