import React, { useState } from 'react'
import Header from './ui/Header'
import { useGetChallengeByIdQuery, useGetChallengeInstructionsQuery } from '../redux/api/challengeSlice';
import { useNavigate, useParams } from 'react-router-dom';
import CodeEditor from './CodeEditor';
import Footer from './ui/Footer';

const Challenge = () => {
  const challengeId = useParams();
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);

  const {data: challenge} = useGetChallengeByIdQuery(challengeId?.id);
  const {data: instructions} = useGetChallengeInstructionsQuery(challenge?.id);

  const handleTimeUpdate = (e) => {
    const currentTime = e.target.currentTime;
    const duration = e.target.duration;
    const percent = duration ? Math.round((currentTime / duration) * 100) : 0;
    setProgress(percent);
  };
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
              {instructions && 
                instructions?.map((instruction) => (
                  <div
                    key={instruction?.id} 
                    className=" mx-auto w-[90%] p-[1rem] bg-opacity-80">
                    <p className="text-gray-400 text-md text-start">step {(instruction?.number)+1}:  {instruction?.instruction}</p>
                  </div>
                ))}
            </div>
          </div>
        </div>

        <CodeEditor onClick={handleTimeUpdate}/>

        <div>

          <div className="mx-auto flex flex-col gap-2 w-[40%] bg-[#0A1C2B] py-6 px-40 rounded-2xl">
            <span className="text-white text-center">You are {progress}% there!</span>
            <button
              className="bg-[#6B5EDD] hover:bg-[#4d3eb0] text-sm py-2 px-6 sm:px-10 mt-5 rounded-xl"
              onClick={() => navigate(`/user/challenges`)}
            >
              Continue
            </button>
          </div>
        </div>
      </section>

      <Footer />

    </div>
  )
}

export default Challenge
