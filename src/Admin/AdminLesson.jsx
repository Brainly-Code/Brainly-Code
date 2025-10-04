import React from 'react'
import { toast } from 'react-toastify';
import { useLogoutMutation } from '../redux/api/userSlice';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import profile from '../assets/profile.png'
import { useGetLessonByIdQuery } from '../redux/api/LessonSlice';
import { Loader } from 'lucide-react';
import { FloatingNav } from '../Components/ui/FloatingNav';
import BrainlyCodeIcon from '../Components/BrainlyCodeIcon';
import CodeEditor from '../Components/CodeEditor';
import Progress from '../Components/ui/Progress';
import Footer from '../Components/ui/Footer';

const Lesson2 = () => {
  const { id } = useParams();

  const { data: lesson, error, isLoading } = useGetLessonByIdQuery(id);

  if(error){
    toast.error(error);
  }

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
    <div className='bg-[#0D0056] w-full'>
      <div className='py-6 rounded-none'>
        <header className="flex items-center mx-auto text-white w-5/6 justify-between">
            <FloatingNav navItems={navItems} className=""/>
            <BrainlyCodeIcon className="ml-7 sm:ml-1"/>
            <ul className=" flex items-center h-1/4">
              <li className="">
                  <Link to="/user/profile">
                    <img src={profile} className=' h-1/2 w-1/2 md:h-3/4 sm:w-1/2 md:w-2/4' />
                  </Link>
              </li>
              <li className="font-semibold inline bg-gradient-to-r from-[#00ffff] rounded-3xl ml-5 to-purple-400 px-5 py-2 text-gray-300">
                <button onClick={logoutHandler} className=''>
                  <Link to="">
                   Sign out
                   </Link>
                </button>
              </li>
            </ul>
        </header>
      </div> 

      <div className="text-center">
        <h1 className='text-3xl font-bold text-gray-200 m-[1rem]'>Basics of HTML</h1>
        <div className="bg-[#216FB8] bg-opacity-25  mx-[7rem] p-[3rem]">
          <h2 className="text-gray-300 mb-[1rem] font-bold text-lg">{lesson.id}. {lesson.title}</h2>
          <p className="text-gray-400 text-md">{lesson.explanation}</p>
          <p className="text-gray-500 text-md">{lesson.more} </p>
          <div className='ml-[10rem] mb-[2rem]'>
            <h2 className="my-[2rem] text-start text-gray-300 font-bold text-lg">An example:</h2>
            <div className="bg-[#1C2526] mx-auto w-[90%] p-[1rem] bg-opacity-80 text-sm">
              <p className="text-gray-50">{lesson.example}</p>
            </div>
          </div>
          <div className="grid grid-cols-12 gap-4 mx-auto w-[70%] text-start items-start mt-8">
            <h2 className="col-span-2 mt-2 text-gray-300 font-bold">Note:</h2>
            <div className="col-span-10 bg-[#1b1733] p-4">
              <p className="text-gray-500 text-sm">
                {lesson.note}
              </p>
            </div>
          </div>

        </div>
      </div>

      <div className="mt-[10rem] ml-[5rem]">
        <h2 className='text-gray-300 text-start ml-[10rem] mb-2 font-bold'>Assignment:</h2>
        <div className='mx-[10rem]'>
          <p className="text-gray-400 text-start font-md">
            {lesson.assignment}
          </p>
        </div>

      </div>

      <div className='mt-[6rem]'>
         <CodeEditor />
      </div>

      <Progress />

      <Footer />
    
    </div>
  )
}

export default Lesson2
