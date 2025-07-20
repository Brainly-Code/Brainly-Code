import React from 'react'
import { useGetUsersQuery } from '../redux/api/userSlice'
import Loader from '../Components/ui/Loader'
import { Link } from 'react-router-dom'
import { FaEdit, FaPlus, FaTrash, FaUser } from 'react-icons/fa'
import SideBar from './components/SideBar'
import Footer from '../Components/ui/Footer'
import Header from './components/AdminFloatingNavBar'

const AllUsers = () => {
  const {data: users , isLoading, isError}=useGetUsersQuery()
  
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
        <div className="w-[70%] flex-1 rounded-lg m-8 p-[2rem] bg-[#0D0056]">
          <h1 className="font-bold m-[1rem] text-gray-200 text-center text-xl">USER MANAGEMENT</h1>
          <button className="px-5 py-2 text-md rounded-lg ml-[42%] font-semibold bg-[#216FB8] text-gray-300 bg-opacity-25">
            Add Users 
            <Link to={``}>
              <FaPlus className='inline ml-[1rem]' size={25} />
            </Link>
          </button>
          <h2 className="text-lg font-bold m-5 text-gray-400 text-center">All Users{`(${users.length})`}</h2>
          <div>
            {
              users.map((user) => (
                <div className="w-[80%] rounded-lg bg-[#1074D2] bg-opacity-35 p-[1rem] my-[0.5rem] flex mx-[3rem]">
                  <div>
                    <FaUser color='lightgray' size={32} className='ml-2 mt-2' />
                  </div>
                  <div className=' ml-[3rem]'>
                    <h3 className="text-md text-gray-400 font-semibold">{user.username}</h3>
                    <p className="text-sm text-gray-400">{user.email}</p>
                  </div>
                  <div className='items-end ml-auto'>
                    <FaEdit size={30} color='lightgray' className='mt-1 hover:cursor-pointer' />
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
