import React from 'react'
import { Link } from 'react-router-dom'

const Introductory = () => {
  return (
    <div className='w-[100%] grid-cols-2'>
      <div className='inline w-[40%] m-10'>
        <h1 className='font-bold text-6xl'>Learn To <span className="text-purple-500"> Code<br></br></span> The Fun Way</h1>
        <p className='text-sm my-5'>Interactive lessons, fun challenges and Projects<br></br> designed for young coders and designer of young coders and beginners of all ages</p>
        <div className="mt-4">
          <button className="bg-gradient-to-r from-[#00ffff] to-purple-400 rounded mr-10 mb-5 px-3 py-2 hover:bg-gradient-to-r hover:from-[#4aeaff] hover:to-purple-500 rounded-3xl "><Link to="/register">Start Learning Free</Link></button>
          <button className="bg-[#1e145e] hover:bg-[#140e3f]  border-3 px-3 p-2 border border-white">Explore Features</button>
        </div>
      </div>
    </div>
  )
}

export default Introductory
