import { apiSlice } from "./apiSlice.jsx";

const CHALLENGE_URL = "/challenges"

const challengeApiSlice = apiSlice.injectEndpoints({
  endpoints: builders => ({
    createChallenge: builders.mutation({
      query: data => ({
        url: `${CHALLENGE_URL}`,
        method: "POST",
        body: data
      })
    }),

    incrementChallenge: builders.mutation({
      query: id => ({
        url: `${CHALLENGE_URL}/like/${id}`,
        method: "POST"
      })
    }),

    getChallenges: builders.query({
      query: () => ({
        url: `${CHALLENGE_URL}`,
        method: "GET"
      })
    }),
  })
});

export const {
  useCreateChallengeMutation,
  useIncrementChallengeMutation,
  useGetChallengesQuery
} = challengeApiSlice;