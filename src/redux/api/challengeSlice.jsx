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

    updateChallenge: builders.mutation({
      query: ({ id, data }) => ({
        url: `${CHALLENGE_URL}/${id}`,
        method: "PUT",
        body: data
      })
    }),

    toggleChallengeLike: builders.mutation({
      query: ({ id, userId }) => ({
        url: `${CHALLENGE_URL}/${id}/like`,
        method: "PATCH",
        body: { userId },
      }),
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

    deleteChallenge: builders.mutation({
      query: (id) => ({
        url: `${CHALLENGE_URL}/${id}`,
        method: "DELETE",
      }),
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

    challengeInstructionCompletion: builders.mutation({
      query: (instructionId) => ({
        url: `${CHALLENGE_URL}/${CHALLENGE_INSTRUCTIONS_URL}/${instructionId}`
      })
    }),

    completeChallenge: builders.mutation({
      query: (data) => ({
        url: `${CHALLENGE_URL}/challenge-completer`,
        method: "POST",
        body: data
      })
    })
  })
});

export const {
  useCreateChallengeMutation,
  useUpdateChallengeMutation,
  useToggleChallengeLikeMutation,
  useGetChallengesQuery,
  useGetChallengeByIdQuery,
  useGetChallengeInstructionsQuery,
  useCreateChallengeInstructionMutation,
  useUpdateChallengeInstructionMutation,
  useDeleteChallengeInstructionMutation,
  useChallengeInstructionCompletionMutation,
  useDeleteChallengeMutation,
  useCompleteChallengeMutation
} = challengeApiSlice;