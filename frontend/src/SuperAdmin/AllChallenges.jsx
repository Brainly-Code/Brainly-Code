import React from 'react'
import Loader from '../Components/ui/Loader'
import { Link } from 'react-router-dom'
import { FaEdit, FaPlus, FaTrash, FaUser } from 'react-icons/fa'
import SideBar from './components/SideBar'
import Footer from '../Components/ui/Footer'
import Header from './components/AdminFloatingNavBar'
import { useGetChallengesQuery } from '../redux/api/challengeSlice'

const AllChallenges = () => {
  const {data: challenges , isLoading, isError}=useGetChallengesQuery()
  
  if(isLoading){
    return <div className=' w-screen h-screen m-0 bg-blue-950'>
      <Loader />
    </div>
  }

  if(isError){
    return <div className='w-screen h-screen bg-blue-950'>Error loading Users</div>
  }

  return (
     <div className="bg-[#2b1edf] opacity-90">
      <Header />

      <div className='flex flex-1'>
        <SideBar />
        
        <div className="flex-1 m-[4rem]">
          <h1 className='text-gray-300 font-bold text-xl text-center '>All Challenges {`(${challenges.length})`}</h1>

          <div className="flex gap-20 m-[5rem]">
            {challenges.map((challenge) => (
              <div key={challenge._id || challenge.id}>
              <div className="h-full bg-[#070045] rounded-[22px] p-4 sm:p-6 lg:p-8 bg-opacity-60 shadow-[0_0px_4px_10px_rgba(33,111,184,0.25)]">
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
                </div>

                <h1 className="text-xl sm:text-2xl font-bold text-neutral-300 dark:text-neutral-200">
                  {challenge.title}
                </h1>
                <p className="text-gray-400 text-sm sm:text-base">{challenge.description}</p>

                <div className="flex justify-end h-1/6 mt-6">
                  <button className="rounded-md bg-[#06325B] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] px-6 text-white font-bold text-sm">
                    Start
                  </button>
                </div>
              </div>
            </div>
            ))}
          </div>
        </div>
      </div>

      <Footer />
     </div>
  ) 
}

export default AllChallenges;
