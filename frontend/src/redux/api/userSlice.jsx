import { apiSlice } from "./apiSlice.jsx";

const USER_URL = "/users";
const AUTH_URL = "/auth";
const PROFILE_URL = "/profile-image";

export const userApiSlice = apiSlice.injectEndpoints({
  endpoints: builders => ({
    register: builders.mutation({
      query: data => ({
        url: `${AUTH_URL}/signup`,
        body: data,
        method: "POST"
      })
    }),

    login: builders.mutation({
      query: data => ({
        url: `${AUTH_URL}/login`,
        body: data,
        method: "POST"
      })
    }),

<<<<<<< HEAD
    profile: builders.mutation({
      query: ({id, formData}) => ({
        url: `${USER_URL}/edit/${id}`,
        method: "PUT",
        body: formData
      })
    }),

    getCurrentUser: builders.query({
      query: () => ({
        url: `${USER_URL}/profile`,
        method: "GET",
      })
    }),

    getUserById: builders.query({
      query: (id) => ({
        url: `${USER_URL}/user/${id}`,
=======
    getCurrentUser: builders.query({
      query: (id) => ({
        url: `${USER_URL}/${id}`,
>>>>>>> 55e3e1576d7cd601157cc3a8d87cd33a55bc8491
        method: "GET",
      })
    }),

    logout: builders.mutation({
      query: () => ({
        url: `${AUTH_URL}/logout`,
        method: "POST",
      })
    }),

    getUsers: builders.query({
      query: ()=> ({
        url: `${USER_URL}`,
        method: "GET",
        keepUnusedDataFor: 5
      })    
    }),

    getProfileImage: builders.query({
      query: id => ({
        url: `${PROFILE_URL}/${id}`,
        method: "GET",
      })
    }),

    UpdateUser: builders.mutation({
      query: (data, id) => ({
        url: `${USER_URL}/edit/${id}`,
        body: data,
        method: "PUT"
      }),
    })
  })
})

export const {
  useRegisterMutation,
  useLoginMutation,
  useLogoutMutation,
  useGetCurrentUserQuery,
  useGetUsersQuery,
  useGetCurrentUserQuery,
  useGetUserByIdQuery,
  useUpdateUserMutation,
  useGetProfileImageQuery,
  useGetCoursesQuery,
} = userApiSlice;