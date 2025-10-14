import React, { useContext } from 'react'
import Loader from '../Components/ui/Loader'
import { Link } from 'react-router-dom'
import { FaEdit, FaPlus, FaTrash, FaUser } from 'react-icons/fa'
import SideBar from './components/SideBar'
import Footer from '../Components/ui/Footer'
import Header from './components/AdminFloatingNavBar'
import { useGetChallengesQuery } from '../redux/api/challengeSlice'
import { ThemeContext } from '../Contexts/ThemeContext'

const AllChallenges = () => {
  const { theme } = useContext(ThemeContext);
  const { data: challenges, isLoading, isError } = useGetChallengesQuery()

  if (isLoading) {
    return <div className={`w-screen h-screen m-0 ${theme === 'dark' ? 'bg-blue-950' : 'bg-gray-100'}`}>
      <Loader />
    </div>
  }

  if (isError) {
    return <div className={`w-screen h-screen ${theme === 'dark' ? 'bg-blue-950' : 'bg-gray-100'}`}>Error loading Users</div>
  }

  return (
    <div className={`${theme === 'dark' ? 'bg-[#2b1edf] opacity-90' : 'bg-gray-50'} transition-all duration-500`}>
      <Header />

      <div className='flex flex-1'>
        <SideBar />

        <div className="flex-1 m-[4rem]">
          <h1 className={`font-bold text-xl text-center ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
            All Challenges {`(${challenges.length})`}
          </h1>

          <div className="flex gap-20 m-[5rem]">
            {challenges.map((challenge) => (
              <div key={challenge._id || challenge.id}>
                <div className={`h-full rounded-[22px] p-4 sm:p-6 lg:p-8 shadow-lg transition-all duration-500 ${theme === 'dark'
                    ? 'bg-[#070045] bg-opacity-60 shadow-[0_0px_4px_10px_rgba(33,111,184,0.25)]'
                    : 'bg-white shadow-md border border-gray-200'
                  }`}>
                  <div className="flex justify-between items-center mb-4">
                    <span
                      className={`text-md font-bold px-2 py-1 rounded-md ${challenge.difficulty === 'Easy'
                          ? 'bg-[rgba(63,101,58,0.69)] text-[#01FE01]'
                          : challenge.difficulty === 'Medium'
                            ? 'bg-[rgba(255,208,51,0.57)] text-[#FFA500]'
                            : challenge.difficulty === 'Hard'
                              ? 'bg-[#F59898] text-[rgba(255,0,0,0.89)]'
                              : theme === 'dark' ? 'bg-gray-200 text-gray-800' : 'bg-gray-200 text-gray-800'
                        }`}
                    >
                      {challenge.difficulty}
                    </span>
                  </div>

                  <h1 className={`text-xl sm:text-2xl font-bold ${theme === 'dark' ? 'text-neutral-300' : 'text-gray-800'
                    }`}>
                    {challenge.title}
                  </h1>
                  <p className={`text-sm sm:text-base ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                    {challenge.description}
                  </p>

                  <div className="flex justify-end h-1/6 mt-6">
                    <button className={`rounded-md shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] px-6 font-bold text-sm transition-all duration-300 ${theme === 'dark'
                        ? 'bg-[#06325B] text-white hover:bg-[#084a7a]'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                      }`}>
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
