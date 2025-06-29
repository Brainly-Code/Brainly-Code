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
    { name: "Courses", link: "/", icon: "📚" },
    { name: "Playground", link: "/playground", icon: "🎮" },
    { name: "Challenges", link: "/challenges", icon: "🏆" },
    { name: "Community", link: "/community", icon: "👤"}
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
        <div className=' mt-[2rem] w-[50%] ml-[24rem]'>
          <div className='text-center'>
            <span className='text-[#00ffee] ml-5 text-5xl font-bold'>Interactive </span>
            <TextGenerateEffect className="text-gray-500 text-4xl font-bold inline" words={' Coding Courses'} />
          </div>
          <div className="text-center text-gray-500">
            <p>
              Learn to code through hands-on projects, interactive exercises, and real-world applications. 
              Start your programming journey today!
            </p>
        </div>
        </div>
      </section>
      
      <section className='mt-[3rem]'>
        <div className='mb-7 text-gray-300 pl-[15rem]'>
          <button
            onClick={() => setFilterLevel('ALL')}
            className='p-2 border hover:border-green-200 mr-[10rem] grid-cols-3 border-gray-500 rounded-md'>
            All Courses
          </button>
          <button
            onClick={() => setFilterLevel('BEGINNER')}
            className='p-2 hover:border mr-[10rem] grid-cols-3 rounded-md'>
            Beginner
          </button>
          <button
            onClick={() => setFilterLevel('INTERMEDIATE')}
            className='p-2 hover:border mr-[10rem] grid-cols-3 rounded-md'>
            Intermediate
          </button>
          <button
            onClick={() => setFilterLevel('ADVANCED')}
            className='p-2 hover:border mr-[10rem] grid-cols-3 rounded-md'>
            Advanced
          </button>
        </div>

        {/* <AllCourses courses={filteredCourses} /> */}



        <div className=" mt-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 px-[5rem]">
            {filteredCourses?.map((course) => (
              <div className='' key={course._id || course.id}>
                <BackgroundGradient className="h-[40%] rounded-[22px] p-4 sm:p-8 bg-white dark:bg-zinc-900" animate="true">
                  <div className="flex justify-between items-center mb-4">
                    {getIconForCourse(course.title)}
                    <span className="text-[#A241E9] font-bold">{course.level}</span>
                  </div>

                  <h1 className="text-2xl font-bold text-neutral-300 dark:text-neutral-200">
                    {course.title}
                  </h1>
                  <p className="text-gray-600">{course.description}</p>

                  <button
                    className="rounded-full ml-[30%] bg-gradient-to-r from-[#00ffee] to-purple-500 px-5 py-2 text-white font-bold text-sm mt-4">
                    Enroll now
                  </button>
                </BackgroundGradient>
              </div>
            ))}
          </div>

        </div>
      </section>
      <Footer />
    </div>
  )
}
