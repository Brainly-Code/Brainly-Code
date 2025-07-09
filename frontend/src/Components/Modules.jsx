import React from 'react';
import { FloatingNav } from './ui/FloatingNav';
import BrainlyCodeIcon from './BrainlyCodeIcon';
import { Link, useNavigate } from 'react-router-dom';
import profile from '../assets/profile.png';
import paint from '../assets/paint.png';
import time from '../assets/time.png';
import star from '../assets/star.png';
import Footer from './ui/Footer';
import { toast } from 'react-toastify';
import { Logout } from '../redux/Features/authSlice';
import { useLogoutMutation } from '../redux/api/userSlice';
import { useDispatch } from 'react-redux';
import { ModuleItem } from './ModuleItem';
import { useGetModulesForCourseQuery } from '../redux/api/moduleSlice';

const Modules = () => {
  const navigate = useNavigate();
  const [logoutApiCall] = useLogoutMutation();
  const dispatch = useDispatch();

  // const [openSections, setOpenSections] = useState({
  //   intro: false,
  //   basic: true,
  //   intermediate: false,
  //   advanced: false,
  // });

  // const toggleSection = (section) => {
  //   setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  // };

  const { data: modules } = useGetModulesForCourseQuery(1);
  
  const navItems = [
    { name: "Courses", link: "/user", icon: "📚" },
    { name: "Playground", link: "/user/playground", icon: "🎮" },
    { name: "Challenges", link: "/user/challenges", icon: "🏆" },
    { name: "Community", link: "/user/community", icon: "👤" }
  ];

  const logoutHandler = async () => {
    try {
      await logoutApiCall().unwrap();
      dispatch(Logout());
      navigate('/login');
    } catch (error) {
      toast.error(error?.data?.message || error.message);
    }
  };

  return (
    <div className='bg-[#0D0056] min-h-screen text-white flex flex-col justify-between'>
      {/* Navbar */}
      <nav className='border-b-2 border-gray-300 py-6'>
        <header className="flex items-center mx-auto w-5/6 justify-between">
          <FloatingNav navItems={navItems} />
          <BrainlyCodeIcon className="ml-7" />
          <ul className="flex items-center">
            <li>
              <Link to="/user/profile">
                <img src={profile} alt="Profile" className='h-5 w-5 md:h-12 md:w-12 rounded-full' />
              </Link>
            </li>
            <li className="font-semibold bg-gradient-to-r from-[#00ffff] to-purple-400 rounded-3xl ml-5 px-5 py-2 text-gray-300">
              <button onClick={logoutHandler}>
                Sign out
              </button>
            </li>
          </ul>
        </header>
      </nav>

      {/* Course Header */}
      <h3 className='text-2xl font-bold mb-20 mt-12 text-center'>HTML & CSS Mastery</h3>

      <section className='bg-[#0A1C2B] mt-12 w-1/2 mx-auto rounded-xl border-8 border-[rgba(33,111,184,0.25)]'>

        <div className='bg-[#0A1C2B] w-full mx-auto p-6 rounded-xl border border-gray-400 flex flex-row sm:flex-col justify-between items-center gap-6'>
          <div className='flex flex-row sm:flex-col items-center gap-3'>
            <img src={paint} alt="Paint" className='w-6 h-6' />
            <span>Learn the basics of JavaScript programming with interactive Exercises</span>
          </div>
          <div className='flex  gap-5'>
            <div className='flex items-center gap-2'>
              <img src={time} alt="Time" className='w-5 h-5' />
              <span>6 Weeks</span>
            </div>
            <div className='flex items-center gap-2'>
              <img src={star} alt="Star" className='w-5 h-5' />
              <span>4.8</span>
            </div>
          </div>
        </div>

          <div className='w-full mx-auto mt-10'>
          <h5 className='text-xl font-semibold mb-4 text-center'>Modules</h5>
          </div>

        {/* Modules */}
       <div className='w-full mx-auto mt-10 space-y-4'>

  {/* Example Module */}
  <div className='w-full mx-auto mt-10 space-y-4'>
  {modules?.map((module) => { // <-- Check if miniModules exists
    return (
      <ModuleItem
        key={module.id}
        title={module.title}
        submodules={module.miniModules} // Could be undefined here
      />
    );
})}

</div>


</div>

      </section>

      <Footer />
    </div>
  );
};

export default Modules;
