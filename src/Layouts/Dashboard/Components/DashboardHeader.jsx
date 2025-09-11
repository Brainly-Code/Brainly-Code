import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import profileFallback from "../../../assets/profile.png";

import {
  useGetProfileImageQuery,
  useLogoutMutation,
} from "../../../redux/api/userSlice";
import { Logout } from "../../../redux/Features/authSlice";

import { FiSearch } from "react-icons/fi";
import { IoMdNotificationsOutline } from "react-icons/io";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { AiOutlineLogout } from "react-icons/ai";
import { jwtDecode } from "jwt-decode";

const DashboardHeader = ({ searchQuery, setSearchQuery }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { userInfo } = useSelector((state) => state.auth);
  const decoded = userInfo?.access_token ? jwtDecode(userInfo.access_token) : null;
  const userId = decoded?.sub;

  const { data: image, isLoading: loadingImage } = useGetProfileImageQuery(userId, {
    skip: !userId,
  });

  const imagePath = image?.path ? image.path : profileFallback;

  const [logoutApiCall] = useLogoutMutation();

  const logoutHandler = async () => {
    try {
      await logoutApiCall().unwrap();
      dispatch(Logout());
      navigate("/login");
    } catch (error) {
      toast.error(error?.data?.message || error.message);
    }
  };

  if (loadingImage) return <div className="p-4 text-white">Loading...</div>;

  return (
    <div>
      <div className="backdrop-blur-xl w-full py-9 rounded-b-md">
        <header className="flex items-center mx-auto text-white sm:w-[97%] w-5/6 justify-between">
          <h1 className="text-center text-xl hidden lg:block font-bold mr-[3rem] text-white">
            ADMIN DASHBOARD
          </h1>

          <div className="flex gap-2 items-center">
            <div className="relative w-full md:flex-1 h-full items-center bg-transparent min-w-[180px] block max-w-md">
              <input
                type="text"
                placeholder="Search anything here..."
                className="w-full pl-4 pr-10 py-2 focus:bg-opacity-20 hover:bg-[#4444e4] hover:bg-opacity-10 focus:bg-[#1e1ec9] focus:border-blue-500 text-sm rounded-md border bg-transparent border-gray-200 shadow-sm focus:outline-none"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <FiSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-200" />
            </div>

            <div className="relative h-full flex-shrink-0">
              <button className="w-10 h-10 rounded-lg border border-gray-200 flex items-center justify-center shadow-sm">
                <IoMdNotificationsOutline className="text-xl text-gray-200" />
                <span className="absolute top-2 right-2 block w-1 h-1 rounded-full bg-red-500"></span>
              </button>
            </div>
          </div>

          <ul className="flex items-center min-h-1/4">
            <li className="flex items-center">
              <img
                src={imagePath}
                className="rounded-full h-10 w-10 object-cover mr-3"
                alt="Profile"
                onClick={() => navigate("/admin/profile")}
                style={{ cursor: "pointer" }}
              />

            </li>

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
    </div>
  );
};

export default DashboardHeader;
