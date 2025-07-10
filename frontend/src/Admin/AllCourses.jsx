import React from 'react'
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

const AllCourses = () => {

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

  const {data: courses , isLoading, isError}=useGetCoursesQuery()
  
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
        
        <div className="flex-1 m-[4rem]">
          <h1 className='text-gray-300 font-bold text-xl text-center '>All Challenges {`(${courses.length})`}</h1>

          <div className="grid grid-cols-2 gap-20 m-[5rem]">
            {courses.map((course) => (
              <div key={course._id || course.id} className=''>
              <div className="h-full rounded-[22px] p-4 sm:p-6 lg:p-8 bg-[#070045] bg-opacity-30 shadow-[0_0px_4px_10px_rgba(33,111,184,0.25)]">
                <div className="flex justify-between items-center mb-4">
                  {getIconForCourse(course.title)}
                  <span
                  className={`font-bold ${
                    course.level === 'BEGINNER'
                      ? 'text-blue-400'
                      : course.level === 'INTERMEDIATE'
                      ? 'text-purple-400'
                      : course.level === 'ADVANCED'
                      ? 'text-green-400'
                      : 'text-gray-400'
                  }`}
                >
                  {course.level}
                </span>
                </div>

                <h1 className="text-xl sm:text-2xl font-bold text-neutral-300 dark:text-neutral-200">
                  {course.title}
                </h1>
                <p className="text-gray-400 text-sm sm:text-base">{course.description}</p>

                <div className="flex justify-center mt-6">
                  <Link to={`/user/module/${course.id}`}>
                    <button className="rounded-full bg-gradient-to-r from-[#00ffee] to-purple-500 px-8 sm:px-10 py-2 sm:py-3 text-white font-bold text-sm"  onClick={()=>navigate(`/user/module/${course.id}`)}>
                      Enroll now
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
