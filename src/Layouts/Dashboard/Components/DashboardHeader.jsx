import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import profileFallback from "../../../assets/profile.png";

import {
  useGetProfileImageQuery,
  useGetUserByIdQuery,
  useLogoutMutation,
} from "../../../redux/api/userSlice";
import { Logout } from "../../../redux/Features/authSlice";

import { FiSearch } from "react-icons/fi";
import { IoMdNotificationsOutline } from "react-icons/io";
import { AiOutlineLogout } from "react-icons/ai";
import { jwtDecode } from "jwt-decode";
import { useGetUnreadCountsQuery } from "../../../redux/api/messageSlice";
import Chat from "../../../Components/Chat";
import BrainlyCodeIcon from "../../../Components/BrainlyCodeIcon";

const DashboardHeader = ({ searchQuery, setSearchQuery }) => {
  const [openChat, setOpenChat] = useState(false);
  const [searchActive, setSearchActive] = useState(false); 
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const searchRef = useRef(null);

  const { userInfo } = useSelector((state) => state.auth);
  const decoded = userInfo?.access_token ? jwtDecode(userInfo.access_token) : null;
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

  const [logoutApiCall] = useLogoutMutation();
  const { data: unreadNotifications } = useGetUnreadCountsQuery(userId);
  const { data: selectedUser } = useGetUserByIdQuery(
    unreadNotifications ? unreadNotifications?.[0]?.senderId : 1
  );

  const logoutHandler = async () => {
    try {
      await logoutApiCall().unwrap();
      dispatch(Logout());
      navigate("/login");
    } catch (error) {
      toast.error(error?.data?.message || error.message);
    }
  };

  const handleNotifications = async () => {
    setOpenChat(true);
  };

  if (loadingImage) return <div className="p-4 text-white">Loading...</div>;

  return (
    <div>
      <div className="backdrop-blur-xl w-full py-9 rounded-b-md">
        <header className="flex sm:flex-row flex-wrap items-center justify-between mx-auto text-white sm:w-[97%] w-5/6 gap-4">
          <BrainlyCodeIcon className="mx-auto" />
          <h1 className="text-center text-xl hidden lg:block font-bold mr-[3rem] text-white">
            ADMIN DASHBOARD
          </h1>

          {/* Profile + Logout + Notifications + Search */}
          <ul className="flex justify-between items-center order-2 gap-3 relative">
            {/* Notifications + Profile */}
            <li className="flex items-center">
              <div className="relative h-full flex-shrink-0 mr-3">
                <button
                  onClick={handleNotifications}
                  className="w-10 h-10 hover:border-gray-400 rounded-lg border border-gray-200 flex items-center justify-center shadow-sm"
                >
                  <IoMdNotificationsOutline className="text-xl hover:text-gray-400 text-gray-200" />
                </button>
                {unreadNotifications?.[0]?._count?.id > 0 && (
                  <div className="absolute -top-1 -right-1 bg-red-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                    {unreadNotifications?.[0]?._count?.id > 9
                      ? "9+"
                      : unreadNotifications?.[0]?._count?.id}
                  </div>
                )}
              </div>
              <img
                src={imagePath}
                className="rounded-full h-10 w-10 object-cover"
                alt="Profile"
                onClick={() => navigate("/admin/profile")}
                style={{ cursor: "pointer" }}
              />
            </li>

            {/* Search */}
            <li className="relative">
              <button
                onClick={() => setSearchActive(true)}
                className="p-2 rounded-md bg-gray-800 hover:bg-gray-700"
              >
                <FiSearch className="text-gray-200 text-xl" />
              </button>

              {searchActive && (
                <div
                  ref={searchRef} // <-- attach ref here
                  className="fixed inset-0 z-50 flex items-start justify-center bg-black/70 p-4"
                >
                  <div className="mt-20 w-full max-w-lg relative">
                    <input
                      type="text"
                      placeholder="Search anything here..."
                      autoFocus
                      className="w-full text-black pl-4 pr-10 py-2 text-sm rounded-md border bg-white border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <FiSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                  </div>
                </div>
              )}
            </li>



            {/* Logout */}
            <li className="font-semibold inline bg-gradient-to-r from-[#00ffff] rounded-full sm:rounded-3xl px-2 pt-1 to-purple-400 sm:px-5 sm:py-2 text-gray-300">
              <button
                onClick={logoutHandler}
                className="flex items-center gap-1 justify-center"
              >
                <span className="sm:block hidden">Sign out</span>
                <AiOutlineLogout className="sm:hidden block" size={23} />
              </button>
            </li>
          </ul>
        </header>
      </div>

      {/* Chat Modal */}
      {openChat && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 overflow-hidden">
          <div className="relative w-11/12 md:w-4/5 lg:w-3/4 xl:w-2/3 h-[90vh] bg-[#0D0056] rounded-xl shadow-2xl flex flex-col">
            <button
              className="absolute -top-8 text-3xl right-3 text-white text-xl font-bold hover:text-gray-300"
              onClick={() => setOpenChat(false)}
            >
              ✕
            </button>

            <Chat chatWith={selectedUser} />
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardHeader;
