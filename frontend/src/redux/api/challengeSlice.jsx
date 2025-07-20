import { apiSlice } from "./apiSlice.jsx";

const CHALLENGE_URL = "/challenges"
const CHALLENGE_INSTRUCTIONS_URL = "challenge-instructions"

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

    getChallengeById: builders.query({
      query: (id) => ({
        url: `${CHALLENGE_URL}/${id}`,
        method: "GET"
      })
    }),

    getChallengeInstructions: builders.query({
      query: (challengeId) => ({
        url: `${CHALLENGE_INSTRUCTIONS_URL}/${challengeId}`,
        method: "GET"
      })
    }),
  })
});

export const {
  useCreateChallengeMutation,
  useIncrementChallengeMutation,
  useGetChallengesQuery,
  useGetChallengeByIdQuery,
  useGetChallengeInstructionsQuery,
} = challengeApiSlice;