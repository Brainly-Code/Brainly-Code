import { apiSlice } from "./apiSlice.jsx";

const USER_URL = "/users";
const AUTH_URL = "/auth";
const PROFILE_URL = "/profile-image";

export const userApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    register: builder.mutation({
      query: (data) => ({
        url: `${AUTH_URL}/signup`,
        body: data,
        method: "POST"
      })
    }),

    login: builder.mutation({
      query: (data) => ({
        url: `${AUTH_URL}/login`,
        body: data,
        method: "POST"
      })
    }),

    profile: builder.mutation({
      query: ({ id, formData }) => ({
        url: `${USER_URL}/edit/${id}`,
        method: "PUT",
        body: formData
      })
    }),

    getCurrentUser: builder.query({
      query: () => ({
        url: `${USER_URL}/profile`,
        method: "GET",
      })
    }),

    getUserById: builder.query({
      query: (id) => ({
        url: `${USER_URL}/user/${id}`,
        method: "GET",
      })
    }),

    logout: builder.mutation({
      query: () => ({
        url: `${AUTH_URL}/logout`,
        method: "POST",
      })
    }),

    getUsers: builder.query({
      query: () => ({
        url: `${USER_URL}`,
        method: "GET",
      }),
      keepUnusedDataFor: 5
    }),

    getProfileImage: builder.query({
      query: (id) => ({
        url: `${PROFILE_URL}/${id}`,
        method: "GET",
      })
    }),

    updateUser: builder.mutation({
      query: ({ data, id }) => ({
        url: `${USER_URL}/edit/${id}`,
        body: data,
        method: "PUT"
      }),
    }),
  })
});

export const {
  useRegisterMutation,
  useLoginMutation,
  useLogoutMutation,
  useGetCurrentUserQuery,
  useGetUsersQuery,
  useGetUserByIdQuery,
  useUpdateUserMutation,
  useGetProfileImageQuery,
  useProfileMutation,
} = userApiSlice;
