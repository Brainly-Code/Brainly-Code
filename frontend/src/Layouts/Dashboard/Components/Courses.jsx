import React from "react";
import Loader from "../../../Components/ui/Loader";
import { Link, useNavigate } from "react-router-dom";

import { CiUndo, CiRedo } from "react-icons/ci";
import { HiOutlineAdjustmentsHorizontal } from "react-icons/hi2";

import {
  FaJs,
  FaReact,
  FaNodeJs,
  FaPython,
  FaHtml5,
  FaAccessibleIcon,
} from 'react-icons/fa';
import { useGetCoursesQuery } from '../../../redux/api/coursesSlice';

const Courses = () => {
  const getIconForCourse = (title) => {
    const key = title.toLowerCase();
    if (key.includes("js")) return <FaJs color="orange" size={30} />;
    if (key.includes("react")) return <FaReact color="blue" size={30} />;
    if (key.includes("node")) return <FaNodeJs color="green" size={30} />;
    if (key.includes("python")) return <FaPython color="green" size={30} />;
    if (key.includes("html") || key.includes("css"))
      return <FaHtml5 color="red" size={30} />;
    if (key.includes("data structure") || key.includes("algorithm"))
      return <FaAccessibleIcon color="purple" size={30} />;
    return <FaAccessibleIcon color="gray" size={30} />; // Default icon
  };

  const navigate = useNavigate();

  const {data: courses , isLoading, isError}=useGetCoursesQuery()
  
  if(isLoading){
    return <div className=' w-full h-full  '>
      <Loader />
    </div>
  }

  if(isError){
    return <div className='w-full h-full text-center text-white font-bold text-3xl'>Error loading courses</div>
  }

  return (
    <div className="  ">
      <div className="z-40 sticky  top-24  backdrop-blur-xl   flex place-items-start justify-between p-3 rounded-b-lg shadow-lg">
        <span className="md:text-2xl text-lg font-normal text-gray-100">
          Courses
        </span>
        <div className="flex items-center gap-2">
          <button className="w-8 h-8 flex items-center justify-center cursor-pointer rounded-full border border-gray-300 text-white ">
            <CiUndo />
          </button>
          <button className="w-8 h-8 flex items-center justify-center cursor-pointer rounded-full border border-gray-300 text-white ">
            <CiRedo />
          </button>
          <button className="w-8 h-8 flex items-center justify-center cursor-pointer rounded-full border border-gray-300 text-white ">
            <HiOutlineAdjustmentsHorizontal />
          </button>
          <button className="flex items-center gap-1 px-4 py-2 bg-gradient-to-r  cursor-pointer bg-[#07032B] text-white rounded-full">
            <span>Add</span>
            <span>+</span>
          </button>
        </div>
      </div>
      <div className="flex-1">
        <h1 className="text-gray-300 font-bold mb-8 text-xl text-center ">
          All Courses {`(${courses.length|| "--"})`}
        </h1>

        <div className="grid lg:grid-cols-3 justify-center text-start md:grid-cols-2 gap-4 ">
          {courses.map((course) => (
            <div key={course._id || course.id} className="">
              <div className="sm:min-w-[20rem] max-w-[20rem] bg-[#070045] h-[19rem] rounded-2xl border border-[#3A3A5A] p-6">
                <div className="flex justify-between items-center mb-4">
                  {getIconForCourse(course.title)}
                  <span
                    className={`font-bold ${
                      course.level === "BEGINNER"
                        ? "text-blue-400"
                        : course.level === "INTERMEDIATE"
                        ? "text-purple-400"
                        : course.level === "ADVANCED"
                        ? "text-green-400"
                        : "text-gray-400"
                    }`}
                  >
                    {course.level}
                  </span>
                </div>

                <div className="">
                  <h1 className="text-2xl font-bold text-neutral-300 dark:text-neutral-200">
                    {course.title}
                  </h1>
                  <p className="text-gray-400 text-base">
                    {course.description}
                  </p>
                </div>
                <div className="flex text-white my-2 justify-between">
                  <span className="flex text-white items-center">
                    {course.viewers} viewers
                  </span>
                  <span className="flex items-center">
                    {course.completions} completions
                  </span>
                  <span className="flex items-center">
                    {course.likes} likes
                  </span>
                </div>
                <div className="flex justify-center ">
                  <Link to={`/user/module/${course.id}`}>
                    <button
                      className="rounded-full bg-gradient-to-r from-[#00ffee] to-purple-500 px-6 sm:px-10 py-2 sm:py-3 text-white font-bold text-sm"
                      onClick={() => navigate(`/user/module/${course.id}`)}
                    >
                      View
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Courses;
