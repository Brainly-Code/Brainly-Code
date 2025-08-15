import React from 'react'
import { Link } from 'react-router-dom'

const SideBar = () => {
  return (
    <div>
      <div className="bg-[#1e1285] h-[23rem] shadow-2xl rounded-xl bg-opacity-60 ml-[2rem] mt-[10rem] w-[200px] flex flex-col items-center py-8">
        <ul>
          <Link to="/admin/users">
            <li className="m-5 p-3 hover:shadow-xl  text-gray-200 font-semibold hover:cursor-pointer  text-lg text-center">Users</li>
          </Link>
          <Link to="/admin/courses">
            <li className="m-5 p-3 hover:shadow-xl  text-gray-200 font-semibold hover:cursor-pointer  text-lg text-center">Courses</li>
          </Link>
          <Link to="/admin/challenges">
            <li className="m-5 p-3 hover:shadow-xl  text-gray-200 font-semibold hover:cursor-pointer  text-lg text-center">Challenges</li>
          </Link>
          <Link to="/admin/premium" className=''>
            <li className="m-5 p-3 hover:shadow-xl  text-gray-200 font-semibold hover:cursor-pointer  text-lg text-center">Premium Users</li>
          </Link>
        </ul>
      </div>

    </div>
  )
}

export default SideBar
