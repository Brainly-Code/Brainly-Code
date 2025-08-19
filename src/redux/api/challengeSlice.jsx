import { apiSlice } from "./apiSlice.jsx";

const CHALLENGE_URL = "challenges"
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

    updateChallenge: builders.mutation({
      query: ({ id, data }) => ({
        url: `${CHALLENGE_URL}/${id}`,
        method: "PUT",
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

    createChallengeInstruction: builders.mutation({
      query: (data) => ({
        url: `${CHALLENGE_INSTRUCTIONS_URL}`,
        method: "POST",
        body: data
      })
    }),

    updateChallengeInstruction: builders.mutation({
      query: ({ id, data }) => ({
        url: `${CHALLENGE_INSTRUCTIONS_URL}/${id}`,
        method: "PUT",
        body: data
      })
    }),

    deleteChallengeInstruction: builders.mutation({
      query: (id) => ({
        url: `${CHALLENGE_INSTRUCTIONS_URL}/${id}`,
        method: "DELETE"
      })
    }),
  })
});

export const {
  useCreateChallengeMutation,
  useUpdateChallengeMutation,
  useIncrementChallengeMutation,
  useGetChallengesQuery,
  useGetChallengeByIdQuery,
  useGetChallengeInstructionsQuery,
  useCreateChallengeInstructionMutation,
  useUpdateChallengeInstructionMutation,
  useDeleteChallengeInstructionMutation,
} = challengeApiSlice;