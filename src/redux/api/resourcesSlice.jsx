import { apiSlice } from './apiSlice';

export const courseResourceApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createCourseResource: builder.mutation({
      query: ({courseId,formData}) => ({
        url: `/resources/${courseId}`, // We'll replace :courseId in the call
        method: 'POST',
        body: formData,
      }),
    }),
    getResourcesForCourse: builder.query({
      query: (courseId) => `/resources/${courseId}`,
      providesTags: (result, error, courseId) => 
        result ? [...result.map(({ id }) => ({ type: 'Resource', id })), { type: 'Resource', id: 'LIST' }] : [{ type: 'Resource', id: 'LIST' }],
    }),
    deleteResource: builder.mutation({
      query: (resourceId) => ({
        url: `/resources/${resourceId}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Resource', id: 'LIST' }],
    }),
  }),
});

export const {
  useCreateCourseResourceMutation,
  useGetResourcesForCourseQuery,
  useDeleteResourceMutation,
} = courseResourceApi;
