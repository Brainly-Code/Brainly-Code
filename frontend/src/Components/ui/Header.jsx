import React from 'react'
import { useDispatch,useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { useLogoutMutation } from '../../redux/api/userSlice';
import { Logout } from '../../redux/Features/authSlice';
import { toast } from 'react-toastify';
import { FloatingNav } from './FloatingNav';
import BrainlyCodeIcon from '../BrainlyCodeIcon';
import profileFallback from "../../assets/profile.png";
import { useGetProfileImageQuery } from "../../redux/api/userSlice";
import { jwtDecode } from "jwt-decode";

const Header = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const token = jwtDecode(userInfo.access_token);

    const { data: image, isLoading: loadingImage } = useGetProfileImageQuery(token.sub);

    const imagePath =
      image?.path && image.path.startsWith("http")
        ? image.path
        : profileFallback;


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
                    <img src={imagePath} className='rounded-full h-10 w-10 object-cover' alt="Profile" />
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
