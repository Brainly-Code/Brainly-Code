import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { ThemeContext } from '../../Contexts/ThemeContext'

const SideBar = () => {
  const { theme } = useContext(ThemeContext);

  return (
    <div>
      <div className={`h-[23rem] shadow-2xl rounded-xl ml-[2rem] mt-[10rem] w-[200px] flex flex-col items-center py-8 transition-all duration-500 ${theme === 'dark'
          ? 'bg-[#1e1285] bg-opacity-60'
          : 'bg-white shadow-md border border-gray-200'
        }`}>
        <ul>
          <Link to="/admin/users">
            <li className={`m-5 p-3 hover:shadow-xl font-semibold hover:cursor-pointer text-lg text-center rounded-lg transition-all duration-300 ${theme === 'dark'
                ? 'text-gray-200 hover:bg-white/10'
                : 'text-gray-700 hover:bg-gray-100'
              }`}>
              Users
            </li>
          </Link>
          <Link to="/admin/courses">
            <li className={`m-5 p-3 hover:shadow-xl font-semibold hover:cursor-pointer text-lg text-center rounded-lg transition-all duration-300 ${theme === 'dark'
                ? 'text-gray-200 hover:bg-white/10'
                : 'text-gray-700 hover:bg-gray-100'
              }`}>
              Courses
            </li>
          </Link>
          <Link to="/admin/challenges">
            <li className={`m-5 p-3 hover:shadow-xl font-semibold hover:cursor-pointer text-lg text-center rounded-lg transition-all duration-300 ${theme === 'dark'
                ? 'text-gray-200 hover:bg-white/10'
                : 'text-gray-700 hover:bg-gray-100'
              }`}>
              Challenges
            </li>
          </Link>
          <Link to="/admin/premium" className=''>
            <li className={`m-5 p-3 hover:shadow-xl font-semibold hover:cursor-pointer text-lg text-center rounded-lg transition-all duration-300 ${theme === 'dark'
                ? 'text-gray-200 hover:bg-white/10'
                : 'text-gray-700 hover:bg-gray-100'
              }`}>
              Premium Users
            </li>
          </Link>
        </ul>
      </div>

    </div>
  )
}

export default SideBar
