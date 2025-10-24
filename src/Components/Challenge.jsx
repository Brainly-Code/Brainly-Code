import React, { useState, useContext } from 'react';
import Header from './ui/Header';
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
import { ThemeContext } from '../Contexts/ThemeContext';

const Challenge = () => {
  const { theme } = useContext(ThemeContext);
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

      if (challenge.takesUrl) {
        try {
          await completeChallenge({ userId, challengeId, url: userSolution }).unwrap();
          toast.success("Thank you for your submission please wait for the mentor response the challenge!");
          navigate("/user/challenges");
          return;
        } catch (error) {
          if (error?.data?.message?.includes("Challenge already completed")) {
            toast.error("You have already completed this challenge!");
          }
          toast.error("Failed to complete challenge. Please try again.");
        }
      }

      try {
        await completeChallenge({ userId, challengeId, solution: userSolution }).unwrap();
        toast.success("🎉 Congratulations, you have completed the challenge!");
        navigate("/user/challenges");
      } catch (error) {
        if (error?.data?.message?.includes("Challenge already completed")) {
          toast.error("You have already completed this challenge!");
          return;
        }
        toast.error("Failed to complete challenge. Please try again.");
      }
    }
  };

  if (isInstructionsLoading) return <BgLoader />;

  return (
    <div
      className={`${
        theme === "light"
          ? "bg-gray-100"
          : "bg-gradient-to-r from-[#070045] via-[#0d0066] to-[#070045]"
      } opacity-90 h-full flex flex-col min-h-screen`}
    >
      <Header />

      <section className="px-4 sm:px-8 md:px-12 lg:px-20">
        <div className="mx-auto">
          <div className="flex">
            <Link to="/user/challenges" className="items">
              <button
                className={`px-5 py-3 mt-5 ml-[3rem] text-lg font-semibold rounded-lg ${
                  theme === "light"
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "bg-[#00ffee] text-white bg-opacity-20 hover:bg-opacity-30"
                }`}
              >
                Back
              </button>
            </Link>
            <h1
              className={`text-2xl sm:text-3xl mx-auto font-bold mt-6 mb-4 ${
                theme === "light" ? "text-gray-800" : "text-gray-200"
              }`}
            >
              {challenge?.title}
            </h1>
          </div>

          <div
            className={`mx-auto max-w-4xl p-4 sm:p-8 md:p-12 rounded-xl ${
              theme === "light" ? "bg-white shadow-md" : "bg-[#216FB8] bg-opacity-25"
            }`}
          >
            <h2
              className={`mb-4 text-left font-bold text-lg ${
                theme === "light" ? "text-gray-800" : "text-gray-300"
              }`}
            >
              Explanation
            </h2>
            <p
              className={`text-left mb-2 text-sm sm:text-base ${
                theme === "light" ? "text-gray-600" : "text-gray-400"
              }`}
            >
              {challenge?.description}
            </p>
            <p
              className={`text-sm sm:text-base ${
                theme === "light" ? "text-gray-500" : "text-gray-500"
              }`}
            >
              {challenge?.more}
            </p>

            <form onSubmit={handleContinueSubmit}>
              <h2
                className={`my-6 text-left font-bold text-lg ${
                  theme === "light" ? "text-gray-800" : "text-gray-300"
                }`}
              >
                Instructions:
              </h2>
              {instructions.map((instruction) => (
                <div
                  key={instruction?.id}
                  className={`mx-auto max-w-xl p-3 sm:p-4 rounded text-left ${
                    theme === "light" ? "bg-gray-50" : "bg-opacity-80"
                  }`}
                >
                  <label
                    className={`text-sm sm:text-base flex items-center ${
                      theme === "light" ? "text-gray-600" : "text-gray-400"
                    }`}
                  >
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
                    <p
                      className={`text-md my-10 ${
                        theme === "light" ? "text-gray-800" : "text-gray-200"
                      }`}
                    >
                      Provide your answer below:
                    </p>
                  </div>
                  <textarea 
                    value={userSolution}
                    onChange={(e) => setUserSolution(e.target.value)}
                    className={`rounded-lg w-full p-10 h-[10rem] ${
                      theme === "light"
                        ? "bg-gray-200 focus:bg-white text-gray-800 border-gray-300 focus:border-blue-500"
                        : "bg-[#00ffee] bg-opacity-10 text-white focus:bg-opacity-0 focus:border-[#00ffee]"
                    } focus:outline-none focus:ring-2`}
                  />
                </div>
              )}

              <div
                className={`mx-auto flex flex-col gap-2 w-full sm:w-[60%] md:w-[40%] py-6 px-6 sm:px-10 rounded-2xl mt-6 ${
                  theme === "light" ? "bg-gray-50" : "bg-[#0A1C2B]"
                }`}
              >
                <span
                  className={`text-center text-sm sm:text-base ${
                    theme === "light" ? "text-gray-800" : "text-white"
                  }`}
                >
                  If you have completed everything
                </span>
                <button
                  type="submit"
                  className={`py-2 px-6 sm:px-10 mt-5 rounded-xl text-sm sm:text-base font-semibold text-white ${
                    theme === "light"
                      ? "bg-blue-600 hover:bg-blue-700"
                      : "bg-[#6B5EDD] hover:bg-[#4d3eb0]"
                  }`}
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