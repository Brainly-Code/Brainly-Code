import { apiSlice } from "./apiSlice";

const COMPILER_URL = "/compiler";

export const userApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({

    runCode: builder.mutation({
      query: (data) => ({
        url: `${COMPILER_URL}/run`,
        method: "POST",
        body: data, // should be { code: string, languageId: number }
      }),
    }),

  }),
});

export const { 
  useRunCodeMutation,
 } = userApiSlice;
