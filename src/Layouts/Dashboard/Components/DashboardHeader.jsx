import React, { useEffect, useRef, useState, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import profileFallback from "../../../assets/profile.png";

import {
  useGetProfileImageQuery,
  useGetUserByIdQuery,
  useLogoutMutation,
} from "../../../redux/api/userSlice";

import { FiSearch } from "react-icons/fi";
import { IoMdNotificationsOutline } from "react-icons/io";
import { AiOutlineLogout } from "react-icons/ai";
import { jwtDecode } from "jwt-decode";
import { useGetUnreadCountsQuery } from "../../../redux/api/messageSlice";
import Chat from "../../../Components/Chat";
import BrainlyCodeIcon from "../../../Components/BrainlyCodeIcon";
import { logout } from "../../../redux/Features/authSlice";
import { ThemeContext } from '../../../Contexts/ThemeContext.jsx';
import { MdOutlineWbSunny } from 'react-icons/md';
import { BsMoonStars } from 'react-icons/bs';

const DashboardHeader = ({ searchQuery, setSearchQuery }) => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const [openChat, setOpenChat] = useState(false);
  const [searchActive, setSearchActive] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const searchRef = useRef(null);

  const { user, access_token: accessToken } = useSelector((state) => state.auth);
  const decoded = accessToken ? jwtDecode(accessToken) : null;
  const userId = decoded?.sub;

  const { data: image, isLoading: loadingImage } = useGetProfileImageQuery(userId, {
    skip: !userId,
  });

  const imagePath = image?.path ? image.path : profileFallback;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setSearchActive(false);
      }
    };
    if (searchActive) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [searchActive]);

  const [logoutApiCall, { isLoading: isLoggingOut }] = useLogoutMutation();

  const { data: unreadNotifications } = useGetUnreadCountsQuery(userId);

  const { data: selectedUser } = useGetUserByIdQuery(unreadNotifications ? unreadNotifications?.[0]?.senderId : 1);

  const logoutHandler = async () => {
    try {
      const res = await logoutApiCall().unwrap();
      dispatch(logout());
      navigate("/login");
      toast.success("Logout successful");
      window.location.reload();
    } catch (error) {
      toast.error("Logout failed");
    }
  };

  const handleNotifications = async () => {
    setOpenChat(true);
  };

  if (loadingImage) return <div className="p-4 text-white">Loading...</div>;


  return (
    <div>
      <div
  className={`w-full py-6 px-4 rounded-b-md transition-all duration-500 ${
    theme === "dark"
      ? "bg-[#0D0056]/90 backdrop-blur-xl text-white"
      : "bg-white shadow-md text-gray-800"
  }`}
>
  <header className="flex sm:flex-row flex-wrap items-center justify-between mx-auto sm:w-[97%] w-5/6 gap-4">
    {/* Brand */}
    <div className="flex items-center gap-3">
      <BrainlyCodeIcon />
      <h1
        className={`text-center text-xl hidden lg:block font-bold ${
          theme === "dark" ? "text-white" : "text-gray-700"
        }`}
      >
        ADMIN DASHBOARD
      </h1>
    </div>

    {/* Theme + Profile + Logout + Notifications + Search */}
    <ul className="flex justify-between items-center order-2 gap-3 relative">
      {/* Theme Toggle */}
      <li>
        <button
          aria-label="Toggle Theme"
          onClick={toggleTheme}
          className={`w-10 h-10 flex items-center justify-center rounded-lg border transition-all duration-300 ${
            theme === "dark"
              ? "border-white/20 hover:bg-white/10"
              : "border-gray-300 hover:bg-gray-100"
          }`}
          title={theme === "dark" ? "Switch to light" : "Switch to dark"}
        >
          {theme === "dark" ? (
            <MdOutlineWbSunny size={20} />
          ) : (
            <BsMoonStars size={18} />
          )}
        </button>
      </li>

      {/* Notifications */}
      <li className="flex items-center">
        <div className="relative h-full flex-shrink-0 mr-3">
          <button
            onClick={handleNotifications}
            className={`w-10 h-10 rounded-lg border flex items-center justify-center transition-all duration-300 shadow-sm ${
              theme === "dark"
                ? "border-gray-200/20 hover:border-gray-400"
                : "border-gray-300 hover:bg-gray-100"
            }`}
          >
            <IoMdNotificationsOutline
              className={`text-xl ${
                theme === "dark" ? "text-gray-200" : "text-gray-600"
              }`}
            />
          </button>
          {console.log(unreadNotifications)}
          {unreadNotifications?.[0]?._count?.id > 0 && (
            <div className="absolute -top-1 -right-1 bg-red-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
              {unreadNotifications?.[0]?._count?.id > 9
                ? "9+"
                : unreadNotifications?.[0]?._count?.id}
            </div>
          )}
        </div>
        <img
          src={user?.photo ? user?.photo : imagePath}
          className="rounded-full h-10 w-10 object-cover cursor-pointer border border-gray-300"
          alt="Profile"
          onClick={() => navigate("/admin/profile")}
        />
      </li>

      {/* Search */}
      <li className="relative">
        <button
          onClick={() => setSearchActive(true)}
          className={`p-2 rounded-md transition-all duration-300 ${
            theme === "dark"
              ? "bg-white/10 hover:bg-white/20 text-gray-200"
              : "bg-gray-100 hover:bg-gray-200 text-gray-700"
          }`}
        >
          <FiSearch className="text-xl" />
        </button>

        {searchActive && (
          <div
            ref={searchRef}
            className={`fixed inset-0 z-50 flex items-start justify-center ${
              theme === "dark" ? "bg-black/70" : "bg-black/30"
            } p-4`}
          >
            <div
              className={`mt-20 w-full max-w-lg relative ${
                theme === "dark" ? "" : "drop-shadow-lg"
              }`}
            >
              <input
                type="text"
                placeholder="Search anything here..."
                autoFocus
                className={`w-full pl-4 pr-10 py-2 text-sm rounded-md border shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  theme === "dark"
                    ? "bg-[#19179B] text-white border-gray-600"
                    : "bg-white text-gray-800 border-gray-300"
                }`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <FiSearch
                className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${
                  theme === "dark" ? "text-gray-300" : "text-gray-500"
                }`}
              />
            </div>
          </div>
        )}
      </li>

      {/* Logout */}
      <li>
        <button
          onClick={logoutHandler}
          className={`flex items-center gap-1 justify-center font-semibold rounded-full sm:rounded-3xl px-3 sm:px-5 sm:py-2 transition-all duration-300 ${
            theme === "dark"
              ? "bg-gradient-to-r from-[#00ffff] to-purple-400 text-gray-300"
              : "bg-gradient-to-r from-blue-400 to-purple-400 text-white"
          }`}
        >
          <span className="sm:block hidden">Sign out</span>
          <AiOutlineLogout className="sm:hidden block" size={23} />
        </button>
      </li>
    </ul>
  </header>
</div>

    </div>
  );
};

export default DashboardHeader;
