// src/redux/api/lessonVideoApi.js
import { apiSlice } from './apiSlice'; // your base apiSlice

export const lessonVideoApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getLessonVideos: builder.query({
      query: () => '/lesson-videos',  // GET all lesson videos
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'LessonVideo', id })),
              { type: 'LessonVideo', id: 'LIST' },
            ]
          : [{ type: 'LessonVideo', id: 'LIST' }],
    }),

    getLessonVideosByMiniModule: builder.query({
      query: (miniModuleId) => `/lesson-videos/mini-module/${miniModuleId}`,
      providesTags: (result, error, miniModuleId) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'LessonVideo', id })),
              { type: 'LessonVideo', id: `MINIMODULE_${miniModuleId}` },
            ]
          : [{ type: 'LessonVideo', id: `MINIMODULE_${miniModuleId}` }],
    }),

    getLessonVideoById: builder.query({
      query: (id) => `/lesson-videos/${id}`,
      providesTags: (result, error, id) => [{ type: 'LessonVideo', id }],
    }),

    createLessonVideo: builder.mutation({
      query: ({ file, ...data }) => {
        const formData = new FormData();
        formData.append('file', file);
        Object.entries(data).forEach(([key, value]) => formData.append(key, value));

        return {
          url: '/lesson-videos',
          method: 'POST',
          body: formData,
        };
      },
      invalidatesTags: [{ type: 'LessonVideo', id: 'LIST' }],
    }),

    deleteLessonVideo: builder.mutation({
      query: (id) => ({
        url: `/lesson-videos/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [{ type: 'LessonVideo', id }],
    }),
  }),
});

export const {
  useGetLessonVideosQuery,
  useGetLessonVideosByMiniModuleQuery,
  useGetLessonVideoByIdQuery,
  useCreateLessonVideoMutation,
  useDeleteLessonVideoMutation,
} = lessonVideoApi;
