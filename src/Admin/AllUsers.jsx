import React, { useContext } from 'react'
import { useGetUsersQuery } from '../redux/api/userSlice'
import Loader from '../Components/ui/Loader'
import { Link } from 'react-router-dom'
import { FaEdit, FaPlus, FaTrash, FaUser } from 'react-icons/fa'
import SideBar from './components/SideBar'
import Footer from '../Components/ui/Footer'
import Header from './components/AdminFloatingNavBar'
import { ThemeContext } from '../Contexts/ThemeContext'

const AllUsers = () => {
  const { theme } = useContext(ThemeContext);
  const { data: users, isLoading, isError } = useGetUsersQuery();

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
        <div className={`w-[70%] flex-1 rounded-lg m-8 p-[2rem] transition-all duration-500 ${theme === 'dark' ? 'bg-[#0D0056]' : 'bg-white shadow-md border border-gray-200'
          }`}>
          <h1 className={`font-bold m-[1rem] text-center text-xl ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'
            }`}>
            USER MANAGEMENT
          </h1>
          <button className={`px-5 py-2 text-md rounded-lg ml-[42%] font-semibold transition-all duration-300 ${theme === 'dark'
              ? 'bg-[#216FB8] text-gray-300 bg-opacity-25 hover:bg-opacity-40'
              : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}>
            Add Users
            <Link to={``}>
              <FaPlus className='inline ml-[1rem]' size={25} />
            </Link>
          </button>
          <h2 className={`text-lg font-bold m-5 text-center ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>
            All Users{`(${users.length})`}
          </h2>
          <div>
            {
              users.map((user) => (
                <div key={user.id} className={`w-[80%] rounded-lg p-[1rem] my-[0.5rem] flex mx-[3rem] transition-all duration-300 ${theme === 'dark'
                    ? 'bg-[#1074D2] bg-opacity-35 hover:bg-opacity-50'
                    : 'bg-gray-100 hover:bg-gray-200 border border-gray-200'
                  }`}>
                  <div>
                    <FaUser color={theme === 'dark' ? 'lightgray' : '#6b7280'} size={32} className='ml-2 mt-2' />
                  </div>
                  <div className=' ml-[3rem]'>
                    <h3 className={`text-md font-semibold ${theme === 'dark' ? 'text-gray-400' : 'text-gray-700'
                      }`}>
                      {user.username}
                    </h3>
                    <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                      {user.email}
                    </p>
                  </div>
                  <div className='items-end ml-auto'>
                    <FaEdit size={30} color={theme === 'dark' ? 'lightgray' : '#6b7280'} className='mt-1 hover:cursor-pointer hover:opacity-70 transition-opacity' />
                  </div>
                </div>
              ))
            }
          </div>
        </div>
      </div>

      <Footer />

    </div>
  )
}

export default AllUsers;
