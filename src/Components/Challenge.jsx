import React, { useState } from 'react'
import Header from './ui/Header'
import { useCompleteChallengeMutation, useGetChallengeByIdQuery, useGetChallengeInstructionsQuery } from '../redux/api/challengeSlice';
import { useNavigate, useParams } from 'react-router-dom';
import Footer from './ui/Footer';
import ChallengeCodeEditor from './ChallengeCodeEditor';
import Loader from './ui/Loader';
import BgLoader from './ui/BgLoader';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import { jwtDecode } from 'jwt-decode';

const Challenge = () => {
  const [completedSteps, setCompletedSteps] = useState([]);
  const id = useParams();
  const navigate = useNavigate();
  const { userInfo } = useSelector(state => state.auth);

  const token = jwtDecode(userInfo?.access_token);

  const { data: challenge } = useGetChallengeByIdQuery(id.id);
  const { data: instructions = [], isLoading: isInstructionsLoading, error } = useGetChallengeInstructionsQuery(id.id);

  const [completeChallenge, { isLoading: isCompleting }] = useCompleteChallengeMutation();

  const toggleStepCompletion = (instructionId) => {
    setCompletedSteps((prev) =>
      prev.includes(instructionId)
        ? prev.filter((id) => id !== instructionId) // uncheck
        : [...prev, instructionId] // check
    );
  };


  const handleContinueSubmit = async (e) => {
    e.preventDefault();
    const userId = token?.sub; 
    const challengeId = Number(id.id);

    if (!Number.isInteger(userId) || !Number.isInteger(challengeId)) {
      toast.error("IDs invalid — please try again");
      return;
    }
    if (completedSteps.length !== instructions.length) {
      toast.error("Please complete all steps first!");
      return;
    }
    try {
      await completeChallenge({ userId, challengeId }).unwrap();
      toast.success("Congratulations, you have completed the challenge 🥳");
      navigate(`/admin/completers/${challengeId}`);
    } catch (error) {
      console.log(error);
      toast.error(error?.data?.message || "Failed to complete challenge");
    }
  };
  

  if (isInstructionsLoading) return <BgLoader />;
  if (error) console.log(error);

  return (
    <div className='bg-[#070045] opacity-90 h-full'>
      <Header />

      <section>
        <div className="text-center">
          <h1 className='text-3xl font-bold text-gray-200 m-[1rem]'>{challenge?.title}</h1>
          <div className="bg-[#216FB8] pl-[10rem] bg-opacity-25  mx-[7rem] p-[3rem]">
            <h2 className="text-gray-300 mb-[1rem] text-start font-bold text-lg">Explanation</h2>
            <p className="text-gray-400 text-start ml-[3rem] text-md">{challenge?.description}</p>
            <p className="text-gray-500 text-md">{challenge?.more}</p>

            <form onSubmit={handleContinueSubmit}>
              <h2 className="my-[2rem] text-start text-gray-300 font-bold text-lg">Instructions:</h2>
              {instructions.map((instruction) => (
                <div key={instruction?.id} className="mx-auto w-[90%] p-[1rem] bg-opacity-80 text-start">
                  <label className="text-gray-400 text-md">
                    Step {instruction?.number}: {instruction?.instruction}
                    <input
                      type="checkbox"
                      className="ml-[1rem]"
                      checked={completedSteps.includes(instruction?.id)}
                      onChange={() => toggleStepCompletion(instruction?.id)}
                    />
                  </label>
                </div>
              ))}

              <div className="mx-auto flex flex-col gap-2 w-[40%] bg-[#0A1C2B] py-6 px-20 rounded-2xl mt-6">
                <span className="text-white text-center">You are almost there!</span>
                <button
                  type="submit"
                  className="bg-[#6B5EDD] hover:bg-[#4d3eb0] text-sm py-2 px-6 sm:px-10 mt-5 rounded-xl"
                >
                  Continue
                </button>
              </div>
            </form>
          </div>
        </div>

        {challenge?.useEditor && <ChallengeCodeEditor />}
      </section>

      <Footer />
    </div>
  )
}

export default Challenge
