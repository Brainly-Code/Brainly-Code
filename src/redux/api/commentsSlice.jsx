import { apiSlice } from "./apiSlice";

export const commentApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getComments: builder.query({
      query: () => '/comments',
      providesTags: ['Comment'],
    }),
    addComment: builder.mutation({
      query: (newComment) => ({
        url: '/comments',
        method: 'POST',
        body: newComment,
      }),
      invalidatesTags: ['Comment'],
    }),
  }),
});

export const { useGetCommentsQuery, useAddCommentMutation } = commentApi;
