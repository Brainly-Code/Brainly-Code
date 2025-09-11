import { apiSlice } from "./apiSlice.jsx";

const CHAT_URL = "/chat";

export const messagesApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Fetch messages between two users
    getMessages: builder.query({
      query: ({ userId, otherUserId }) => `${CHAT_URL}/${userId}/${otherUserId}`,
      providesTags: (result, error, { userId, otherUserId }) => [
        { type: "Messages", id: `${userId}-${otherUserId}` },
      ],
    }),

    // Send a new message
    sendMessage: builder.mutation({
      query: (messageData) => ({
        url: CHAT_URL,
        method: "POST",
        body: messageData,
      }),
      invalidatesTags: (result, error, { senderId, receiverId }) => [
        { type: "Messages", id: `${senderId}-${receiverId}` },
      ],
    }),

    getUnreadCounts: builder.query({
      query: (userId) => ({
        url: `${CHAT_URL}/unread-count/${userId}`,
        method: "GET"
      })
    }),

    readMessages: builder.mutation({
      query: ({ userId, otherUserId }) => ({
        url: `/chat/read/${userId}/${otherUserId}`,
        method: "GET"
      })
    }),

    getUnreadBySender: builder.query({
      query: ({userId, otherUserId}) => ({
        url: `${CHAT_URL}/${userId}/${otherUserId}`,
        method: "GET"
      })
    })
}),
});

export const { useGetUnreadBySenderQuery, useReadMessagesMutation, useGetUnreadCountsQuery, useGetMessagesQuery, useSendMessageMutation } = messagesApiSlice;
