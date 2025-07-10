// src/redux/api/videoApi.js
import { apiSlice } from './apiSlice';

export const videoApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getVideosForCourse: builder.query({
      query: (courseId) => `/videos?courseId=${courseId}`,
      providesTags: (result, error, courseId) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Videos', id })),
              { type: 'Videos', id: `COURSE_${courseId}` },
            ]
          : [{ type: 'Videos', id: `COURSE_${courseId}` }],
    }),

    getVideoById: builder.query({
      query: (id) => `/videos/${id}`,
      providesTags: (result, error, id) => [{ type: 'Video', id }],
    }),

    createVideo: builder.mutation({
      query: ({ courseId, title, number, file }) => {
        const formData = new FormData();
        formData.append('courseId', courseId);
        formData.append('title', title);
        formData.append('number', number);
        formData.append('file', file);

        return {
          url: '/videos',
          method: 'POST',
          body: formData,
        };
      },
      invalidatesTags: (result, error, { courseId }) => [{ type: 'Videos', id: `COURSE_${courseId}` }],
    }),

    deleteVideo: builder.mutation({
      query: (id) => ({
        url: `/videos/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [{ type: 'Videos', id }],
    }),
  }),
});

export const {
  useGetVideosForCourseQuery,
  useGetVideoByIdQuery,
  useCreateVideoMutation,
  useDeleteVideoMutation,
} = videoApi;
