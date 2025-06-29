import React from 'react'
import moment from 'moment'
import { useGetUsersQuery } from '../redux/api/userSlice'
import Loader from '../Components/ui/Loader'
import { Link } from 'react-router-dom'
import { FaTrash } from 'react-icons/fa'

const AllUsers = () => {
  const {data: users , isLoading, isError}=useGetUsersQuery()
  
  if(isLoading){
    return <div className=' w-screen h-screen m-0 bg-blue-950'>
      <Loader />
    </div>
  }

  if(isError){
    return <div className='w-screen h-screen bg-blue-950'>Error loading products</div>
  }

  return (
     <div className="container w-screen h-screen bg-[#06022bf1]">
      <div className="flex flex-col md:flex-row">
        <div className="py-3">
          <div className="m-auto text-center mb-5 xl font-bold h-12">
            All Users ({users ? users.length : 0})
          </div>
          <div className="flex flex-wrap justify-around flex-col md:flex-row w-[160%]">
            {users?.map((user)=>(
               <Link
               key={user._id}
               to={`/admin/product/update/${user._id}`}
               >
                <div className='flex h-[10rem]'>
                  <img src={user.image} 
                  alt={user.name} 
                  className='w-[10rem] object-cover' />

                  <div className="p-4 flex flex-col justify-around">
                    <div className="flex justify-between">
                      <h5 className="text-xl font-semibold mb-2">
                        {user?.username}
                      </h5>
                      <p className="text-gray-400 text-sm">
                        {moment(user.createAt).format("MMMM Do YYYY")}
                      </p>
                    </div>

                    <p className="text-gray-400 xl:w-[30rem] md:w-[20rem] sm:w-[10rem] text-sm mb-4">
                      {user?.description?.substring(0, 160)}...
                    </p>

                    <div className="flex justify-between">
                      <Link to={`/admin/product/update/${user._id}`}
                        className='inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-pink-700 rounded-lg hover:bg-pink-800 focus:ring-4 focus:outline-none focus:ring-pink-300 dark:bg-pink-600 dark:hover:bg-pink-700 dark:focus:ring-pink-800 '
                      >
                        Delete User
                      <FaTrash />
                      </Link>
                      <p>$ {user?.price}</p>
                    </div>
                  </div>
                </div>
               </Link>
            ))}
          </div>
        </div>
        <div className="md-w-1/4 p-3 mt-2">
        </div>
      </div>
     </div>
  ) 
}

export default AllUsers;
