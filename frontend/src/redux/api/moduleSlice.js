import { apiSlice } from "./apiSlice.jsx";

const MODULE_URL = "/modules";

const moduleApiSlice = apiSlice.injectEndpoints({
  endpoints: builders => ({
    createModule: builders.mutation({
      query: data => ({
        url: `${MODULE_URL}`,
        method: "POST",
        body: data
      })
    }),

    getModulesForCourse: builders.query({
      query: id => ({
        url: `${MODULE_URL}/${id}`,
        method: "GET",
      })
    }),


  })
})

export const {
  useCreateModuleMutation,
  useGetModulesForCourseQuery,
} = moduleApiSlice