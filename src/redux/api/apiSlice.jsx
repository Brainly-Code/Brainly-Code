import { fetchBaseQuery, createApi } from "@reduxjs/toolkit/query/react";
import { Logout, updateAccessToken } from "../Features/authSlice";
const baseQuery = fetchBaseQuery({
  baseUrl: "http://localhost:3000",
  prepareHeaders: (headers, { getState }) => {
    const token = getState().auth?.userInfo?.access_token;
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  },
  credentials: "include", // cookie for refresh
});

const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    console.log("Access token expired, refreshing...");
    const refreshResult = await baseQuery(
      { url: "/auth/refresh", method: "POST" },
      api,
      extraOptions
    );

    if (refreshResult.data) {
      api.dispatch(updateAccessToken(refreshResult.data.access_token));
      result = await baseQuery(args, api, extraOptions);
    } else {
      api.dispatch(Logout());
    }
  }

  return result;
};

export const apiSlice = createApi({
  baseQuery: baseQueryWithReauth,
  tagTypes: ["User", "Videos", "Comment"],
  endpoints: () => ({}),
});
