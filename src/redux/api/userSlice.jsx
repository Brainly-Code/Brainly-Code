import { apiSlice } from "./apiSlice.jsx";

const USER_URL = "/users";
const AUTH_URL = "/auth";
const PROFILE_URL = "/profile-image";

export const userApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Register a new user
    register: builder.mutation({
      query: (data) => ({
        url: `${AUTH_URL}/signup`,
        method: "POST",
        body: data,
      }),
    }),

    // Log in user
    login: builder.mutation({
      query: (data) => ({
        url: `${AUTH_URL}/login`,
        method: "POST",
        body: data,
      }),
    }),

    // Get current logged-in user's profile
    getCurrentUser: builder.query({
      query: () => ({
        url: `${USER_URL}/profile`,
        method: "GET",
      }),
      // Automatically refetch when the cache is older than 5 minutes
      keepUnusedDataFor: 300,
    }),

    // Get specific user by ID
    getUserById: builder.query({
      query: (id) => ({
        url: `${USER_URL}/user/${id}`,
        method: "GET",
      }),
    }),

    // Logout user
    logout: builder.mutation({
      query: () => ({
        url: `${AUTH_URL}/logout`,
        method: "POST",
      }),
    }),

    // Update user info
    updateUser: builder.mutation({
      query: ({ id, formData }) => ({
        url: `${USER_URL}/edit/${id}`,
        method: "PATCH",
        body: formData,
      }),
    }),

    // Get current user's profile image
    getProfileImage: builder.query({
      query: (id) => ({
        url: `${PROFILE_URL}/${id}`,
        method: "GET",
      }),
    }),

    // Update user profile image
    updateProfileImage: builder.mutation({
      query: ({ id, imageFile }) => {
        const formData = new FormData();
        formData.append("image", imageFile);
        return {
          url: `${PROFILE_URL}/${id}`,
          method: "POST",
          body: formData,
        };
      },
    }),

    // Get all profile images
    getProfileImages: builder.query({
      query: () => ({
        url: `${PROFILE_URL}`,
        method: "GET",
      }),
    }),

    // Upgrade user to premium/pro
    upgradeToPro: builder.mutation({
      query: (userId) => ({
        url: `${USER_URL}/upgrade-to-pro/${userId}`,
        method: "PATCH",
        // Add payment-related body here if needed
      }),
    }),
    // OAuth redirect endpoints (if you want to fetch user data after redirect)
    oauthGoogle: builder.query({
      query: () => ({
        url: `${AUTH_URL}/google/redirect`,
        method: "GET",
        credentials: "include", // send cookies/session if backend uses it
      }),
    }),

    oauthGithub: builder.query({
      query: () => ({
        url: `${AUTH_URL}/github/redirect`,
        method: "GET",
        credentials: "include",
      }),
    }),
  }),
});

export const {
  useOauthGoogleQuery,
  useOauthGithubQuery,
  useRegisterMutation,
  useLoginMutation,
  useLogoutMutation,
  useGetCurrentUserQuery,
  useGetUserByIdQuery,
  useUpdateUserMutation,
  useGetProfileImageQuery,
  useUpdateProfileImageMutation,
  useGetProfileImagesQuery,
  useUpgradeToProMutation,
} = userApiSlice;
