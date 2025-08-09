

import React, { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { useGetCoursesQuery, useGetUserLikedCoursesQuery, useLikeCourseMutation } from '../redux/api/coursesSlice'
import { toast } from 'react-toastify';
import TextGenerateEffect from './ui/TextGenerate';
import { FloatingNav } from './ui/FloatingNav';
import Loader from './ui/Loader';
import like from '../assets/like.png';
import liked from '../assets/liked.png';

import {
  FaJs,
  FaReact,
  FaNodeJs,
  FaPython,
  FaHtml5,
  FaAccessibleIcon,
} from 'react-icons/fa';
import Footer from './ui/Footer';
import Header from './ui/Header';
import { useSelector } from 'react-redux';
import { jwtDecode } from 'jwt-decode';

export default function HomePage() {
  
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
  const userInfo = useSelector((state) => state.auth.userInfo);
  const decoded = jwtDecode(userInfo);
  if(userInfo){
    if(decoded.role !== "USER") {
      navigate('/admin')
    }
  }else{
    navigate('/login')
  }

  const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

  let { data: courses, error, isLoading } = useGetCoursesQuery();
  const [likesMap, setLikesMap] = React.useState({});
  const { data: likedCourses, refetch: refetchLikedCourses } = useGetUserLikedCoursesQuery();
  const [likeCourse] = useLikeCourseMutation();

  useEffect(() => {
  if (!courses || !likedCourses) return;

  const initialLikesMap = {};
  courses.forEach((course) => {
    initialLikesMap[course.id] = {
      liked: likedCourses.includes(course.id),
      count: course.likes,
    };
  });

  setLikesMap(initialLikesMap);
}, [courses, likedCourses]);
  
  if(error){
    toast.error(error);
  }

  const [filterLevel, setFilterLevel] = React.useState('ALL');

  const filteredCourses = filterLevel === 'ALL' 
  ? courses 
  : courses?.filter(course => course.level === filterLevel);


  if(isLoading) {
    return <Loader/>
  }

  

  const handleLike = async (courseId) => {
    try {
      const result = await likeCourse(courseId).unwrap();
      
      setLikesMap((prev) => ({
        ...prev,
        [courseId]: {
          liked: result.liked,
          count:
            (prev[courseId]?.count ?? 
              courses?.find((c) => c.id === courseId)?.likes ?? 0) +
            (result.liked ? 1 : -1),
        },
      }));
          refetchLikedCourses();

      toast.success(result.liked ? 'Course liked!' : 'Like removed!');
    } catch (error) {
      console.log(error);
      toast.error('Failed to update like.');
    }
  };
  return (
    <div className='bg-[#070045] opacity-90'>
      <Header />

      <section>
        <div className=' mt-[2rem] w-[50%] m-auto '>
          <div className='text-center md:flex md:flex-nowrap md:justify-center items-center gap-5 m-auto mb-4'>
            <span className='text-[#00ffee] lg:text-4xl text-xl font-bold'>Interactive</span>
            <TextGenerateEffect className="text-white lg:text-4xl text-xl font-bold align-middle whitespace-nowrap" words={' Coding Courses'} />
          </div>
          <div className="text-center text-white">
            <p>
              Learn to code through hands-on projects, interactive exercises, and real-world applications. 
              Start your programming journey today!
            </p>
        </div>
        </div>
      </section>
      
      <section className="mt-[3rem]">
        <div className="mb-7 text-gray-300 px-4 sm:px-10 md:px-20 lg:px-[15rem] flex flex-wrap justify-center gap-4">
          <button
            onClick={() => setFilterLevel('ALL')}
            className={`p-2 rounded-md ${
              filterLevel === 'ALL' ? 'border border-white' : 'border-none'
            }`}>
            All Courses
          </button>

          <button
            onClick={() => setFilterLevel('BEGINNER')}
            className={`p-2 rounded-md ${
              filterLevel === 'BEGINNER' ? 'border border-white' : 'border-none'
            }`}>
            Beginner
          </button>

          <button
            onClick={() => setFilterLevel('INTERMEDIATE')}
            className={`p-2 rounded-md ${
              filterLevel === 'INTERMEDIATE' ? 'border border-white' : 'border-none'
            }`}>
            Intermediate
          </button>

          <button
            onClick={() => setFilterLevel('ADVANCED')}
            className={`p-2 rounded-md ${
              filterLevel === 'ADVANCED' ? 'border border-white' : 'border-none'
            }`}>
            Advanced
          </button>
        </div>


        <div className="mt-14 mb-14 px-4 sm:px-8 lg:px-[5rem]">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10 lg:gap-14">
            {filteredCourses?.map((course) => (
              <div key={course._id || course.id}>
                <div className="h-full rounded-[22px] hover:shadow-[0_5px_5px_10px_rgba(33,111,184,0.75)] p-4 sm:p-6 lg:p-8 bg-opacity-0 shadow-[0_4px_4px_10px_rgba(33,111,184,0.25)]">
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
                    {capitalize(course.level)}
                  </span>
                  </div>

                  <h1 className="text-xl sm:text-2xl font-bold text-neutral-300 dark:text-neutral-200">
                    {course.title}
                  </h1>
                  <p className="text-gray-400 text-sm sm:text-base">{course.description}</p>

                  <div className="flex justify-center mt-6">
                    <Link to={`/user/module/${course.id}`}>
                      <button className="rounded-full hover:from-[#30c7bd] hover:to-purple-600 bg-gradient-to-r from-[#00ffee] to-purple-500 px-8 sm:px-10 py-2 sm:py-3 text-white font-bold text-sm">
                        Enroll now
                      </button>
                    </Link>
                    <button onClick={()=> handleLike(course.id)} className='ml-12 self-center'>
                    <img src={likesMap[course.id]?.liked ? liked : like} alt="Like" className='w-6 h-6'/>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  )
}
