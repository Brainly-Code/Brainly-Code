import React from 'react'
import Loader from '../../../Components/ui/Loader'
import { Link } from 'react-router-dom'
import { FaEdit, FaPlus, FaTrash, FaUser, FaStopwatch } from 'react-icons/fa'
import { CiUndo, CiRedo } from 'react-icons/ci'
import { HiOutlineAdjustmentsHorizontal } from 'react-icons/hi2'

import { useGetChallengesQuery } from '../../../redux/api/challengeSlice'

const Challenges = () => {
  const {data: challenges , isLoading, isError}=useGetChallengesQuery()
  
  if(isLoading){
    return <div className=' w-full h-full m-0'>
      <Loader />
    </div>
  }

  if(isError){
    return <div className='w-full h-full text-center font-bold text-3xl text-white'>Error loading Challenges</div>
  }

  return (
     <div className=" ">
       <div className="z-40 sticky  top-24  backdrop-blur-xl   flex place-items-start justify-between p-3 rounded-b-lg shadow-lg">
        <span className="md:text-2xl text-lg font-normal text-gray-100">
          Challenges
        </span>
        <div className="flex items-center gap-2">
          <button className="w-8 h-8 flex items-center justify-center cursor-pointer rounded-full border border-gray-300 text-white ">
            <CiUndo />
          </button>
          <button className="w-8 h-8 flex items-center justify-center cursor-pointer rounded-full border border-gray-300 text-white ">
            <CiRedo />
          </button>
          <button className="w-8 h-8 flex items-center justify-center cursor-pointer rounded-full border border-gray-300 text-white ">
            <HiOutlineAdjustmentsHorizontal />
          </button>
          <button className="flex items-center gap-1 px-4 py-2 bg-gradient-to-r  cursor-pointer bg-[#07032B] text-white rounded-full">
            <span>Add</span>
            <span>+</span>
          </button>
        </div>
      </div>
    


        <div className="flex-1 ">
          <h1 className='text-gray-300 font-bold my-8 text-xl text-center '>All Challenges {`(${challenges.length || "--"})`}</h1>
          <div className="grid lg:grid-cols-3 justify-center text-start md:grid-cols-2 gap-4">
            {challenges.map((challenge) => (
              <div key={challenge._id || challenge.id}>
              <div className="sm:min-w-[20rem] w-full bg-[#070045] min-h-[19rem] rounded-2xl border border-[#3A3A5A] p-6">
                <div className="flex justify-between items-center mb-4">
                  <span
                    className={`text-md font-bold px-2 py-1 rounded-md ${
                      challenge.difficulty === 'Easy'
                        ? 'bg-[rgba(63,101,58,0.69)] text-[#01FE01]'
                        : challenge.difficulty === 'Medium'
                        ? 'bg-[rgba(255,208,51,0.57)] text-[#FFA500]'
                        : challenge.difficulty === 'Hard'
                        ? 'bg-[#F59898] text-[rgba(255,0,0,0.89)]'
                        : 'bg-gray-200 text-gray-800'
                    }`}
                  >
                    {challenge.difficulty}
                  </span>
                  <span className='text-white '>{challenge.context}</span>

                </div>

               <div className="">
               <h1 className="text-xl sm:text-2xl font-bold text-neutral-300 dark:text-neutral-200">
                  {challenge.title}
                </h1>
                <p className="text-gray-400 text-sm sm:text-base">{challenge.description}</p>

               </div>
               <div className="flex items-center text-white my-4 justify-start">
                    <FaStopwatch/> <p className='ml-3'>Est. Time:{challenge.estimatedTime || "30 Minutes"}</p>
               </div>
                <div className="flex items-center justify-between h-1/6 mt-6">
                <div className="flex justify-between">
                  <span className="text-white">{challenge.likes} likes</span>
                  <span className="text-white ml-3">{challenge.completions} completions</span>
                </div>
                  <button className="rounded-md bg-[#06325B] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] px-6 py-2 text-white font-bold text-sm">
                    View
                  </button>

                </div>
              </div>
            </div>
            ))}
          </div>
        </div>

  
     </div>
  ) 
}

export default Challenges;
