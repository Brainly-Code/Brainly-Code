/* eslint-disable no-unused-vars */
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
  const [stepComplete, setStepComplete] = useState(true);
  const { id } = useParams();
  const navigate = useNavigate();
  const {userInfo} = useSelector(state => state.auth);
  // const [progress, setProgress] = useState(0);

  const token = jwtDecode(userInfo?.access_token);

  const { data: challenge } = useGetChallengeByIdQuery(id);
  const { data: instructions = [], isLoading: isInstructionsLoading, error } = useGetChallengeInstructionsQuery(id);
  
  const [completeChallenge] = useCompleteChallengeMutation();

  // const handleTimeUpdate = (e) => {
  //   const currentTime = e.target.currentTime;
  //   const duration = e.target.duration;
  //   const percent = duration ? Math.round((currentTime / duration) * 100) : 0;
  //   setProgress(percent);
  // };

  const handleInstructionCompletion = async (instructionId) => {
    try {
      const res = await handleInstructionCompletion(instructionId).unwrap();
      console.log(res)
    } catch (error) {
      // console.log(error)
    }
  }
  
  const handleContinueSubmit = async () => {
    if(challenge?.complete === true) {
      try {
        const res = await completeChallenge({ userId: token.sub, challengeId: challenge?.id })
        toast.success("Congratulations, you have completed the challenge🥳")
      } catch (error) {
        
      }
    }
    () => navigate(`/user/challenges`)
  }


  const handleContinueClickError = () => {
    toast.error("Complete all the steps first!")
  }

  if(isInstructionsLoading){
    return <BgLoader />
  }

  if(error) {
    console.log(error)
  }

  return (
    <div className='bg-[#070045] opacity-90 h-full'>
      <Header />

      <section>
        <div className="text-center">
          <h1 className='text-3xl font-bold text-gray-200 m-[1rem]'>{challenge?.title}</h1>
          <div className="bg-[#216FB8] pl-[10rem] bg-opacity-25  mx-[7rem] p-[3rem]">
            <h2 className="text-gray-300 mb-[1rem] text-start font-bold text-lg">Explaination</h2>
            <p className="text-gray-400 text-start ml-[3rem] text-md">{challenge?.description}</p>
            <p className="text-gray-500 text-md">{challenge?.more} </p>
            <div className='mb-[2rem]'>
              <h2 className="my-[2rem] text-start text-gray-300 font-bold text-lg">Instructions:</h2>
              {challenge?.useEditor ? instructions && 
                instructions?.map((instruction) => (
                  <div
                    key={instruction?.id}
                    className=" mx-auto w-[90%] p-[1rem] bg-opacity-80">
                    <p className="text-gray-400 text-md text-start">step {(instruction?.number)}:  {instruction?.instruction}</p>
                  </div>
                )) : 
                instructions && 
                instructions?.map((instruction) => (
                  <div
                    key={instruction?.id} 
                    className=" mx-auto w-[90%] p-[1rem] bg-opacity-80">
                    <p className="text-gray-400 text-md text-start">step {(instruction?.number)}:  {instruction?.instruction}
                      <button  onClick={handleInstructionCompletion(instruction?.id)}>
                      <input type="checkbox" className='ml-[1rem]' value={stepComplete} onChange={e => setStepComplete(e.target.value)} />
                      </button>
                    </p>
                  </div>
                ))
                }
            </div>
          </div>
        </div>

        {
        challenge?.useEditor ? <ChallengeCodeEditor /> :
        ""
      }

        <div>

          <div className="mx-auto flex flex-col gap-2 w-[40%] bg-[#0A1C2B] py-6 px-40 rounded-2xl">
            <span className="text-white text-center">You are almost there!</span>
            {
              challenge?.complete === true ? (
                <button
                  className="bg-[#6B5EDD] hover:bg-[#4d3eb0] text-sm py-2 px-6 sm:px-10 mt-5 rounded-xl"
                  onClick={handleContinueSubmit}
                >
                  Continue
                </button>
              ) : (
                <button
                  className="bg-[#4d3eb0] text-sm py-2 px-6 sm:px-10 mt-5 rounded-xl"
                  onClick={handleContinueClickError}
                > 
                  Continue
                </button>
              )
            }
          </div>
        </div>
      </section>

      <Footer />

    </div>
  )
}

export default Challenge
