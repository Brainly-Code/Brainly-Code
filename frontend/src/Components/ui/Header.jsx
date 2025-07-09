import React from 'react'
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { useLogoutMutation } from '../../redux/api/userSlice';
import { Logout } from '../../redux/Features/authSlice';
import { toast } from 'react-toastify';
import profile from '../../assets/profile.png';
import { FloatingNav } from './FloatingNav';
import BrainlyCodeIcon from '../BrainlyCodeIcon';

const Header = () => {

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

  return (
    <div>
      <div className=' border-gray-300 py-6 rounded-none border-b-[1px]'>
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
    </div>
  )
}

export default Header
