import React from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import profile from "../../../assets/profile.png";
import { useLogoutMutation } from "../../../redux/api/userSlice";
import { Logout } from "../../../redux/Features/authSlice";
import { FiSearch } from "react-icons/fi";
import { IoMdNotificationsOutline } from "react-icons/io";
import { AiOutlineLogout } from "react-icons/ai";

const DashboardHeader = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
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

  return (
    <div>
      <div className=" backdrop-blur-xl   w-full py-9 rounded-none ">
        <header className="flex items-center mx-auto  text-white   sm:w-[97%] w-5/6 justify-between">
          <h1 className="text-center text-xl hidden lg:block font-bold mr-[3rem] text-white ">
            ADMIN DASHBOARD
          </h1>
          <div className="flex gap-2 items-center">
            {/*middle search input*/}
            <div className="relative w-full md:flex-1 h-full items-center bg-transparent min-w-[180px]  block max-w-md">
              <input
                type="text"
                placeholder="Search anything here..."
                className="w-full pl-4 pr-10 py-2 text-sm rounded-md border bg-transparent border-gray-200 shadow-sm focus:outline-none"
              />
              <FiSearch className="absolute right-3 top-1/2  transform -translate-y-1/2 text-gray-200" />
            </div>
            {/* Right: Notification */}
            <div className="relative h-full  flex-shrink-0 ">
              <button className="w-10 h-10 rounded-lg border border-gray-200 flex items-center justify-center shadow-sm">
                <IoMdNotificationsOutline className="text-xl text-gray-200" />
                <span className="absolute top-2 right-2 block w-1 h-1 rounded-full bg-red-500  "></span>
              </button>
            </div>
          </div>

          <ul className=" flex items-center min-h-1/4">
            <li className="">
              <Link to="/admin/profile">
                <img
                  src={profile}
                  className=" h-1/2 w-1/2 md:h-3/4 sm:w-1/2 md:w-2/4"
                />
              </Link>
            </li>
            <li className="font-semibold inline bg-gradient-to-r  from-[#00ffff] rounded-full sm:rounded-3xl px-2 pt-1 to-purple-400 sm:px-5  sm:py-2 text-gray-300">
              <button
                onClick={logoutHandler}
                className="justify-center items-center"
              >
                <Link className="sm:block hidden" to="">
                  Sign out{" "}
                </Link>
                <Link className="sm:hidden block" to="">
                  <AiOutlineLogout size={23} />
                </Link>
              </button>
            </li>
          </ul>
        </header>
      </div>
    </div>
  );
};

export default DashboardHeader;
