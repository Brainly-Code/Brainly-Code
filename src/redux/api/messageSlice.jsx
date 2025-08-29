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
  }),
});

export const { useGetMessagesQuery, useSendMessageMutation } = messagesApiSlice;
