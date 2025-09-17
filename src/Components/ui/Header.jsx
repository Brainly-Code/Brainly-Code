/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { useLogoutMutation, useUpgradeToProMutation, useGetProfileImageQuery } from '../../redux/api/userSlice';
import { Logout, setCredentials } from '../../redux/Features/authSlice';
import { toast } from 'react-toastify';
import { FloatingNav } from './FloatingNav';
import BrainlyCodeIcon from '../BrainlyCodeIcon';
import profileFallback from "../../assets/profile.png";
import {jwtDecode} from "jwt-decode";
import Loader from './Loader';

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

 const { userInfo } = useSelector((state) => state.auth);

const userId = userInfo?.sub;
  // // Update local isProMember state whenever userInfo changes
  // useEffect(() => {
  //   const decoded = jwtDecode(userInfo.access_token);
  //   console.log(decoded?.isPremium)
  //   if (decoded?.isPremium === true) {
  //     setIsProMember(true);
  //   } else {
  //     setIsProMember(false);
  //   }
  // }, [userInfo]);

  const { data: image, isLoading: loadingImage } = useGetProfileImageQuery(userId, {
    skip: !userId,
  });

  const imagePath =
    image?.path && image.path.startsWith("http")
      ? image.path
      : profileFallback;

  const [logoutApiCall] = useLogoutMutation();
  // const [upgradeToPro, { isLoading: isUpgrading }] = useUpgradeToProMutation();
  // const [showUpgradeMessage, setShowUpgradeMessage] = useState(false);

  const navItems = [
    { name: "Home", link: "/user", icon: "📚" },
    { name: "Courses", link: "/user/courses", icon: "📚" },
    { name: "Playground", link: "/user/playground", icon: "🎮" },
    { name: "Challenges", link: "/user/challenges", icon: "🏆" },
  ];

  const logoutHandler = async () => {
    try {
      await logoutApiCall().unwrap();
      dispatch(Logout());
      navigate('/login');
      toast.success('Logged out successfully');
    } catch (error) {
      toast.error(error?.data?.message || error.message);
    }
  };

  // const handleUpgrade = async () => {
  //   if (isProMember) {
  //     toast.info("You are already a Pro Member!");
  //     return;
  //   }
  //   try {
  //     const res = await upgradeToPro(userId).unwrap();
  //     // Important: res should contain { access_token, user }
  //     dispatch(setCredentials(userInfo?.access_token, res));
  //     toast.success("Congratulations! You are now a Pro Member!");
  //     setShowUpgradeMessage(true);
  //     setIsProMember(true); // Update local state immediately
  //   } catch (error) {
  //     toast.error(error?.data?.message || "Failed to upgrade membership.");
  //   }
  // };

  if(loadingImage) {
    return <Loader />
  }

  return (
    <div>
      <div className='py-6 rounded-none'>
        <header className="flex items-center mx-auto text-white w-5/6 justify-between">
          <FloatingNav navItems={navItems} className="" />
          <BrainlyCodeIcon className="ml-7 sm:ml-1" />

          <ul className="flex items-center h-1/4 gap-4">
            <li>
              <Link to="/user/profile">
                <img src={imagePath} className='rounded-full h-10 w-10 object-cover' alt="Profile" />
              </Link>
            </li>

            {/* Upgrade button only if NOT pro
            {!isProMember && (
              <li>
                <button
                  onClick={handleUpgrade}
                  disabled={isUpgrading}
                  className="bg-gradient-to-r from-[#2DD4BF] to-[#8A2BE2] text-white px-4 py-2 rounded-full font-semibold shadow-md hover:opacity-90 transition duration-300"
                >
                  {isUpgrading ? (
                    <span className="w-5 h-5 border-2 border-white border-b-transparent rounded-full animate-spin inline-block"></span>
                  ) : (
                    "Upgrade to Pro"
                  )}
                </button>
              </li>
            )}

            Show Pro badge if user is Pro 
            {isProMember && (
              <li className="text-sm font-semibold text-[#2DD4BF] bg-[#0a2c2d] px-3 py-1 rounded-full select-none">
                Pro
              </li>
            )}
              */}
            

            <li className="font-semibold inline bg-gradient-to-r from-[#00ffff] rounded-3xl ml-5 to-purple-400 px-5 py-2 text-gray-300">
              <button onClick={logoutHandler}>
                <Link to="">
                  Sign out
                </Link>
              </button>
            </li>
          </ul>
        </header>
      </div>
    </div>
  );
};

export default Header;
