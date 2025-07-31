import React from 'react'
import { Link } from 'react-router-dom'

const RouteError = () => {


  return (
    <div className='w-screen p-[1rem] h-screen bg-[#1b1bf5] bg-opacity-90'>
      <div className='font-semibold'>
        <Link
          to={`/user`}
        >
          <button className="py-2 bg-[#1b1bf5] text-gray-300 hover:bg-opacity-40 hover:text-gray-400 px-5 rounded-lg">Go Back</button></Link>
      </div>
      <div
      className='flex '
      >
        <div className='mx-auto my-[10rem] p-[2rem] w-[20rem] h-[8rem] hover:opacity-60 hover:cursor-pointer hover:shadow-2xl hover:shadow-gray-800 bg-[#1b1bf5] opacity-70 rounded-xl  '>
          <h1 className='text-2xl text-center text-gray-200 font-bold'>Route Error:</h1>
          <div className='text-center'>
            <p className="text-xl text-gray-300 inline mr-3 font-semibold">400</p>
            <p className='text-xl  text-gray-500 inline'>Not Found Error</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RouteError
