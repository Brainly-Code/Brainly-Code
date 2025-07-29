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

    updateUser: builder.mutation({
      query: ({ id, formData }) => ({
        url: `${USER_URL}/edit/${id}`,
        method: "PATCH",
        body: formData
      })
    }),

    getProfileImage: builder.query({
      query: (id) => ({
        url: `${PROFILE_URL}/${id}`,
        method: "GET",
      })
    }),

    updateProfileImage: builder.mutation({
      query: ({ id, imageFile }) => {
        const formData = new FormData();
        formData.append("image", imageFile);
        console.log("FormData for uploadProfileImage:", formData.get("image")); // Log the file

        return {
          url: `${PROFILE_URL}/${id}`,
          method: "POST",
          body: formData,
        };
      },
    }),

    getProfileImages: builder.query({
      query: () => ({
        url: `${PROFILE_URL}`,
        method: "GET",
      })
    })
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
  useUpdateProfileImageMutation,
  useGetProfileImagesQuery,
} = userApiSlice;
