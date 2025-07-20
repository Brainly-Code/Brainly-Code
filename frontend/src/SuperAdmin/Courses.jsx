import React from 'react'
import { Link } from 'react-router-dom'

const Courses = () => {
  return (
    <div className='h-screen bg-[#300DF5] p-[1.5rem]'>
      <h1 className='text-3xl text-center text-gray-300 font-semibold'>Courses</h1>
      <div className="m-auto p-[1rem] w-[70%] shadow-lg hover:shadow-2xl  mt-[5rem]">
        <h2 className='text-center text-2xl font-semibold hover:text-[#8c7de0] cursor-pointer text-[#a799f3]'>
          <Link to="/admin/create">Create Course</Link>
        </h2>
      </div>
      <div className="m-auto p-[1rem] w-[70%] shadow-lg hover:shadow-2xl  mt-[5rem]">
        <h2 className='text-center text-2xl font-semibold hover:text-[#8c7de0] cursor-pointer text-[#a799f3]'>
          <Link to="/admin/create">Remove Course</Link>
        </h2>
      </div>
      <div className="m-auto p-[1rem] w-[70%] shadow-lg hover:shadow-2xl  mt-[5rem]">
        <h2 className='text-center text-2xl font-semibold hover:text-[#8c7de0] cursor-pointer text-[#a799f3]'>
          <Link to="/admin/create">Edit Course Information</Link>
        </h2>
      </div>
    </div>
  )
}

export default Courses
