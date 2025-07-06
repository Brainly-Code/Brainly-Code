import React from 'react'
import BrainlyCodeIcon from './BrainlyCodeIcon';
import { Link, useNavigate } from 'react-router-dom';
import { useGetCoursesQuery, useLogoutMutation } from '../redux/api/userSlice';
import { Logout } from '../redux/Features/authSlice';
import { toast } from 'react-toastify';
import TextGenerateEffect from './ui/TextGenerate';
import { FloatingNav } from './ui/FloatingNav';
import Loader from './ui/Loader';
import { useDispatch } from 'react-redux';
import { BackgroundGradient } from './ui/BgGradient';
import {
  FaJs,
  FaReact,
  FaNodeJs,
  FaPython,
  FaHtml5,
  FaAccessibleIcon,
} from 'react-icons/fa';
import Footer from './ui/Footer';

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
  

  let { data: courses, error, isLoading } = useGetCoursesQuery();
  console.log(courses);
  
  if(error){
    toast.error(error);
  }

  const [filterLevel, setFilterLevel] = React.useState('ALL');

  const filteredCourses = filterLevel === 'ALL' 
  ? courses 
  : courses?.filter(course => course.level === filterLevel);



   const navItems = [
    { name: "Courses", link: "/user", icon: "📚" },
    { name: "Playground", link: "/user/playground", icon: "🎮" },
    { name: "Challenges", link: "/user/challenges", icon: "🏆" },
    { name: "Community", link: "/user/community", icon: "👤"}
  ];

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [ logoutApiCall ] = useLogoutMutation();

  const logoutHandler = async () => {
    try {
      await logoutApiCall().unwrap();
      dispatch(Logout());
      navigate('/login');
    } catch (error) {
      toast.error(error?.data?.message || error.message);
    }
  }

  if(isLoading) {
    return <Loader/>
  }

  return (
    <div className='bg-[#070045] opacity-90'>
      <div className=' border-gray-300 py-6 rounded-none border-b-2'>
        <header className="flex text-white justify-between">
            <FloatingNav navItems={navItems} />
            <BrainlyCodeIcon className="ml-7"/>
                <div className="hidden md:flex lg:gap-20 gap-10 flex-wrap justify-center mx-auto">
                <Link to="/user">
                  <button className="text-sm text-gray-300 hover:text-white">Courses</button>
                </Link>
                <Link to="/user/playground">
                  <button className="text-sm text-gray-300 hover:text-white">Playground</button>
                </Link>
                <Link to="/user/challenges">
                  <button className="text-sm text-gray-300 hover:text-white">Challenges</button>
                </Link>
                <Link to="/user/community">
                  <button className="text-sm text-gray-300 hover:text-white">Community</button>
                </Link>
              </div>
            <ul className="ml-auto">
              <li className="font-semibold inline text-gray-300">
                  <Link to="/user/profile">
                    <button >Profile</button>
                  </Link>
              </li>
              <li className="font-semibold inline bg-gradient-to-r from-[#00ffff] rounded-md ml-5 to-purple-400 px-5 py-2 text-gray-300">
                <button onClick={logoutHandler}>
                  <Link to="">
                   Sign out
                   </Link>
                </button>
              </li>
            </ul>
        </header>
      </div>

            <section>
        <div className=' mt-[2rem] w-[50%] m-auto'>
          <div className='text-center md:flex md:flex-nowrap md:justify-center gap-5 m-auto mb-4'>
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
          <div className="h-full rounded-[22px] p-4 sm:p-6 lg:p-8 bg-opacity-0 shadow-[0_0px_4px_10px_rgba(33,111,184,0.25)]">
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
              <button className="rounded-full bg-gradient-to-r from-[#00ffee] to-purple-500 px-8 sm:px-10 py-2 sm:py-3 text-white font-bold text-sm">
                Enroll now
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
</section>
<Footer />
    </div>
  )
}
