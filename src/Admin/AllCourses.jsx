import React, { useContext } from 'react'
import Loader from '../Components/ui/Loader'
import { Link, useNavigate } from 'react-router-dom'
import { FaEdit, FaPlus, FaTrash, FaUser } from 'react-icons/fa'
import SideBar from './components/SideBar'
import Footer from '../Components/ui/Footer'
import Header from './components/AdminFloatingNavBar'
import {
  FaJs,
  FaReact,
  FaNodeJs,
  FaPython,
  FaHtml5,
  FaAccessibleIcon,
} from 'react-icons/fa';
import { useGetCoursesQuery } from '../redux/api/coursesSlice'
import { ThemeContext } from '../Contexts/ThemeContext'

const AllCourses = () => {
  const { theme } = useContext(ThemeContext);

  const getIconForCourse = (title) => {
    const key = title.toLowerCase();
    if (key.includes("js")) return <FaJs color="orange" size={30} />;
    if (key.includes("react")) return <FaReact color="blue" size={30} />;
    if (key.includes("node")) return <FaNodeJs color="green" size={30} />;
    if (key.includes("python")) return <FaPython color="green" size={30} />;
    if (key.includes("html") || key.includes("css")) return <FaHtml5 color="red" size={30} />;
    if (key.includes("data structure") || key.includes("algorithm"))
      return <FaAccessibleIcon color="purple" size={30} />;
    return <FaAccessibleIcon color="gray" size={30} />; // Default icon
  };

  const navigate = useNavigate();

  const { data: courses, isLoading, isError } = useGetCoursesQuery()

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
          <h1 className={`font-bold text-xl text-center ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
            }`}>
            All Courses {`(${courses.length})`}
          </h1>

          <div className="grid grid-cols-2 gap-20 m-[5rem]">
            {courses.map((course) => (
              <div key={course._id || course.id} className=''>
                <div className={`h-full rounded-[22px] p-4 sm:p-6 lg:p-8 shadow-lg transition-all duration-500 ${theme === 'dark'
                    ? 'bg-[#070045] bg-opacity-30 shadow-[0_0px_4px_10px_rgba(33,111,184,0.25)]'
                    : 'bg-white shadow-md border border-gray-200'
                  }`}>
                  <div className="flex justify-between items-center mb-4">
                    {getIconForCourse(course.title)}
                    <span
                      className={`font-bold ${course.level === 'BEGINNER'
                          ? 'text-blue-400'
                          : course.level === 'INTERMEDIATE'
                            ? 'text-purple-400'
                            : course.level === 'ADVANCED'
                              ? 'text-green-400'
                              : theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                        }`}
                    >
                      {course.level}
                    </span>
                  </div>

                  <h1 className={`text-xl sm:text-2xl font-bold ${theme === 'dark' ? 'text-neutral-300' : 'text-gray-800'
                    }`}>
                    {course.title}
                  </h1>
                  <p className={`text-sm sm:text-base ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                    {course.description}
                  </p>

                  <div className="flex justify-center mt-6">
                    <Link to={`/user/module/${course.id}`}>
                      <button className={`rounded-full px-8 sm:px-10 py-2 sm:py-3 font-bold text-sm transition-all duration-300 ${theme === 'dark'
                          ? 'bg-gradient-to-r from-[#00ffee] to-purple-500 text-white hover:from-[#00ddd4] hover:to-purple-600'
                          : 'bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600'
                        }`} onClick={() => navigate(`/user/module/${course.id}`)}>
                        Check it out
                      </button>
                    </Link>
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

export default AllCourses;
