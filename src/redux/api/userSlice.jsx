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

    updateProfileImage: builder.mutation({
      query: ({ id, data }) => ({
        url: `${PROFILE_URL}/${id}`,
        method: "POST",
        body: data
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
        method: "PATCH"
      }),
    }),
        getProfileImages: builder.query({
      query: () => ({
        url: `${PROFILE_URL}`,
        method: "GET",
      }),
    }),
      upgradeToPro: builder.mutation({
      query: (userId) => ({
        url: `${USER_URL}/upgrade-to-pro/${userId}`,
        method: "PATCH",
        // Add payment-related body here if needed
      }),
    }),
  })
});

export const {
  useRegisterMutation,
  useLoginMutation,
  useLogoutMutation,
  useGetCurrentUserQuery,
  useGetUserByIdQuery,
  useUpdateUserMutation,
  useGetProfileImageQuery,
  useGetProfileImagesQuery,
  useUpdateProfileImageMutation,
  useUpgradeToProMutation,
} = userApiSlice;
