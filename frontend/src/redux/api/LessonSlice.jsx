import { apiSlice } from "./apiSlice";

const LESSONS_URL = "/lesson"
const lessonApiSlice = apiSlice.injectEndpoints({
  endpoints: builders => ({
    createLesson: builders.mutation({
      query: data => ({
        url: `${LESSONS_URL}`,
        method: "POST",
        body: data
      })
    }),

    getLessonById: builders.query({
      query: id => ({
        url: `${LESSONS_URL}/${id}`,
        method: "GET",
      })
    }),

    getLessonsForSubModule: builders.query({
      query: subModuleId => ({
        url: `${LESSONS_URL}/more/${subModuleId}`,
        method: "GET"
      }),
    })
  })
})

export const {
  useCreateLessonMutation,
  useGetLessonByIdQuery,
  useGetLessonsForSubModuleQuery,
} = lessonApiSlice;