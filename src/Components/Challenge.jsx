import React, { useState } from 'react'
import Header from './ui/Header'
import { 
  useCompleteChallengeMutation, 
  useGetChallengeByIdQuery, 
  useGetChallengeInstructionsQuery, 
  useGetChallengeSolutionsQuery 
} from '../redux/api/challengeSlice';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Footer from './ui/Footer';
import ChallengeCodeEditor from './ChallengeCodeEditor';
import BgLoader from './ui/BgLoader';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import stringSimilarity from 'string-similarity';

const Challenge = () => {
  const [completedSteps, setCompletedSteps] = useState([]);
  const [userSolution, setUserSolution] = useState("");
  const id = useParams();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const { data: challenge } = useGetChallengeByIdQuery(id.id);
  const { data: instructions = [], isLoading: isInstructionsLoading } = useGetChallengeInstructionsQuery(id.id);
  const { data: solutions } = useGetChallengeSolutionsQuery(Number(id.id));

  const [completeChallenge] = useCompleteChallengeMutation();

  const toggleStepCompletion = (instructionId) => {
    setCompletedSteps((prev) =>
      prev.includes(instructionId)
        ? prev.filter((id) => id !== instructionId)
        : [...prev, instructionId]
    );
  };

  const normalize = (text) =>
    text
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, '') // remove punctuation
      .trim();

  const tokenSimilarity = (a, b) => {
    const wordsA = new Set(a.split(/\s+/));
    const wordsB = new Set(b.split(/\s+/));
    const intersection = new Set([...wordsA].filter((x) => wordsB.has(x)));
    return intersection.size / Math.max(wordsA.size, wordsB.size);
  };

  const handleContinueSubmit = async (e) => {
    e.preventDefault();

    const userId = user?.id;
    const challengeId = Number(id.id);

    if (!Number.isInteger(userId) || !Number.isInteger(challengeId)) {
      toast.error("Invalid user or challenge ID");
      return;
    }

    if (completedSteps.length !== instructions.length) {
      toast.error("Please complete all steps first!");
      return;
    }

    if (challenge.useInput) {
      if (!userSolution.trim()) {
        toast.error("Please enter your solution before submitting!");
        return;
      }

      const correctSolutions = Array.isArray(solutions)
        ? solutions.map((s) => normalize(s.solution))
        : [];

      const userAnswer = normalize(userSolution);

      let isSimilar = false;
      for (const correct of correctSolutions) {
        const ratio1 = stringSimilarity.compareTwoStrings(userAnswer, correct);
        const ratio2 = tokenSimilarity(userAnswer, correct);

        if (ratio1 >= 0.7 || ratio2 >= 0.6) {
          isSimilar = true;
          break;
        }
      }

      if (!isSimilar) {
        toast.error("Wrong answer. Try again!");
        return;
      }
    }

    try {
      await completeChallenge({ userId, challengeId }).unwrap();
      toast.success("🎉 Congratulations, you have completed the challenge!");
      navigate("/user/challenges");
    } catch (error) {
      if (error?.data?.message?.includes("Challenge already completed")) {
        toast.error("You have already completed this challenge!");
        return;
      }
      toast.error("Failed to complete challenge. Please try again.");
    }
  };

  if (isInstructionsLoading) return <BgLoader />;

  return (
    <div className='bg-[#070045] opacity-90 h-full'>
      <Header />

      <section className="px-4 sm:px-8 md:px-12 lg:px-20">
        <div className="mx-auto">
          <div className='flex'>
            <Link to="/user/challenges" className='items'>
              <button className='bg-[#00ffee] px-5 py-3 mt-5 ml-[3rem] text-lg font-semibold text-white rounded-lg bg-opacity-20'>
                Back
              </button>
            </Link>
            <h1 className="text-2xl sm:text-3xl mx-auto font-bold text-gray-200 mt-6 mb-4">
              {challenge?.title}
            </h1>
          </div>

          <div className="bg-[#216FB8] bg-opacity-25 mx-auto max-w-4xl p-4 sm:p-8 md:p-12 rounded-xl">
            <h2 className="text-gray-300 mb-4 text-left font-bold text-lg">Explanation</h2>
            <p className="text-gray-400 text-left mb-2 text-sm sm:text-base">{challenge?.description}</p>
            <p className="text-gray-500 text-sm sm:text-base">{challenge?.more}</p>

            <form onSubmit={handleContinueSubmit}>
              <h2 className="my-6 text-left text-gray-300 font-bold text-lg">Instructions:</h2>
              {instructions.map((instruction) => (
                <div key={instruction?.id} className="mx-auto max-w-xl p-3 sm:p-4 rounded bg-opacity-80 text-left">
                  <label className="text-gray-400 text-sm sm:text-base flex items-center">
                    <span>
                      Step {instruction?.number}: {instruction?.instruction}
                    </span>
                    <input
                      type="checkbox"
                      className="ml-3 hover:cursor-pointer"
                      checked={completedSteps.includes(instruction?.id)}
                      onChange={() => toggleStepCompletion(instruction?.id)}
                    />
                  </label>
                </div>
              ))}

              {challenge?.useInput && (
                <div>
                  <div>
                    <p className='text-md text-gray-200 my-10'>Provide your answer below:</p>
                  </div>
                  <textarea
                    value={userSolution}
                    onChange={(e) => setUserSolution(e.target.value)}
                    className="bg-[#00ffee] bg-opacity-10 focus:bg-opacity-0 focus:border rounded-lg focus:border-[#00ffee] w-full p-10 text-white h-[10rem]"
                  />
                </div>
              )}

              <div className="mx-auto flex flex-col gap-2 w-full sm:w-[60%] md:w-[40%] bg-[#0A1C2B] py-6 px-6 sm:px-10 rounded-2xl mt-6">
                <span className="text-white text-center text-sm sm:text-base">
                  If you have completed everything
                </span>
                <button
                  type="submit"
                  className="bg-[#6B5EDD] hover:bg-[#4d3eb0] text-sm sm:text-base py-2 px-6 sm:px-10 mt-5 rounded-xl text-white font-semibold"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>

        {challenge?.useEditor && <ChallengeCodeEditor />}
      </section>

      <Footer />
    </div>
  );
};

export default Challenge;
