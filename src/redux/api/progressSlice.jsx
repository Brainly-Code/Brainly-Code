import { apiSlice } from "./apiSlice";

const COURSE_PROGRESS_URL = '/courses/progress';
const MINI_MODULE_PROGRESS_URL = '/mini-modules-progress';
const MODULE_PROGRESS_URL = '/modules/progress';
const LESSON_PROGRESS_URL = '/lesson/progress';

const progressApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    createCourseProgress: builder.mutation({
      query: data => ({
        url: `${COURSE_PROGRESS_URL}`,
        method: "POST",
        body: data,
      })
    }),

    trackCourseProgress: builder.mutation({
      query: (id, courseId) => ({
        url: `${COURSE_PROGRESS_URL}/${id}`,
        method: "PATCH",
        body: courseId
      })
    }),

    getCourseProgress: builder.query({
      query: id => ({
        url: `${COURSE_PROGRESS_URL}/${id}`,
        method: "GET"
      })
    }),

    createLessonProgress: builder.mutation({
      query: (data) => ({
        url: `${LESSON_PROGRESS_URL}`,
        method: "POST",
        body: data,
      })
    }),

    trackLessonProgress: builder.mutation({
      query: (id, data) => ({
        url: `${LESSON_PROGRESS_URL}/${id}`,
        method: "PATCH",
        body: data,
      })
    }),

    getLessonProgress: builder.query({
       query: lessonId => ({
        url: `${LESSON_PROGRESS_URL}/${lessonId}`,
        method: "GET",
       })
    }),

    createMiniModuleProgress: builder.mutation({
      query: (data) => ({
        url: `${MINI_MODULE_PROGRESS_URL}`,
        method: "POST",
        body: data,
      })
    }),

    trackMiniModuleProgress: builder.mutation({
      query: (id, miniModuleId) => ({
        url: `${MINI_MODULE_PROGRESS_URL}/${id}`,
        method: "PATCH",
        body: miniModuleId,
      })
    }),

    getMiniModuleProgress: builder.query({
      query: id => ({
        url: `${MINI_MODULE_PROGRESS_URL}/${id}`,
        method: "GET"
      })
    }),

    createModuleProgress: builder.mutation({
      query: (data) => ({
        url: `${MODULE_PROGRESS_URL}`,
        method: "POST",
        body: data,
      })
    }),

    trackModuleProgress: builder.mutation({
      query: (id, moduleId) => ({
        url: `${MODULE_PROGRESS_URL}/${id}`,
        method: "PATCH",
        body: moduleId,
      })
    }),

    getModuleProgress: builder.query({
      query: id => ({
        url: `${MODULE_PROGRESS_URL}/${id}`,
        method: "GET"
      })
    }),

  })
});

export const {
  useCreateCourseProgressMutation,
  useTrackCourseProgressMutation,
  useGetCourseProgressQuery,
  useCreateModuleProgressMutation,
  useTrackModuleProgressMutation,
  useGetModuleProgressQuery,
  useCreateMiniModuleProgressMutation,
  useTrackMiniModuleProgressMutation,
  useGetMiniModuleProgressQuery,
  useCreateLessonProgressMutation,
  useTrackLessonProgressMutation,
  useGetLessonProgressQuery,
} = progressApiSlice;