import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import profileFallback from "../../../assets/profile.png";

import {
  useGetProfileImageQuery,
  useLogoutMutation,
  useUpgradeToProMutation,
} from "../../../redux/api/userSlice";
import { Logout, setCredentials } from "../../../redux/Features/authSlice";

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
  const [upgradeToPro, { isLoading: isUpgrading }] = useUpgradeToProMutation();
  const [showProModal, setShowProModal] = useState(false);

  // FIXED here: isPremium is inside user object!
  const isProMember = userInfo?.user?.isPremium;

  const proFeatures = [
    "Ad-free experience",
    "Priority customer support",
    "Exclusive content access",
    "Higher upload limits",
    "Early access to new features",
    "Custom profile badges",
  ];

  const logoutHandler = async () => {
    try {
      await logoutApiCall().unwrap();
      dispatch(Logout());
      navigate("/login");
    } catch (error) {
      toast.error(error?.data?.message || error.message);
    }
  };

  const handleUpgrade = async () => {
    if (!userInfo || !userId) {
      toast.error("Please provide a user ID");
      return;
    }

    if (isProMember) {
      toast.info("You are already a Pro Member!");
      return;
    }

    try {
      const res = await upgradeToPro(userId).unwrap();
      dispatch(setCredentials({ ...res }));
      toast.success("Congratulations! You are now a Pro Member!");
      setShowProModal(false);
    } catch (err) {
      toast.error(err?.data?.message || "Failed to upgrade membership.");
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

              {/* Show Upgrade button only if NOT Pro */}
              {!isProMember && (
                <button
                  onClick={() => setShowProModal(true)}
                  className="bg-gradient-to-r from-[#2DD4BF] to-[#8A2BE2] text-white text-sm px-4 py-2 rounded-full font-semibold shadow-md hover:opacity-90 transition duration-300 mr-3"
                >
                  Upgrade to Pro
                </button>
              )}
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

      {/* Pro Modal */}
      {showProModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
          <div className="relative w-full max-w-2xl bg-[#00052B] p-6 sm:p-8 rounded-lg border border-[#3A3A5A] animate-fadeIn">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-3xl font-bold text-center flex-grow">Go Pro!</h3>
              <button
                onClick={() => setShowProModal(false)}
                className="text-gray-400 hover:text-white transition duration-200 focus:outline-none"
                aria-label="Close"
              >
                <FaTimesCircle className="text-3xl" />
              </button>
            </div>

            <p className="text-gray-300 text-center mb-8">
              Experience the ultimate Brainly Code journey with these powerful features:
            </p>

            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              {proFeatures.map((feature, index) => (
                <li key={index} className="flex items-center text-lg text-gray-200">
                  <FaCheckCircle className="text-[#2DD4BF] mr-3 text-xl flex-shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            <button
              onClick={handleUpgrade}
              disabled={isUpgrading || isProMember}
              className="w-full py-4 rounded-full bg-gradient-to-r from-[#2DD4BF] to-[#8A2BE2] text-white font-bold text-xl shadow-lg hover:opacity-90 transition duration-300 flex items-center justify-center"
            >
              {isUpgrading ? (
                <span className="w-6 h-6 border-2 border-white border-b-transparent rounded-full animate-spin"></span>
              ) : isProMember ? (
                "Already Pro"
              ) : (
                "Upgrade Now!"
              )}
            </button>

            {!isProMember && (
              <p className="text-gray-400 mt-4 text-sm text-center">
                <a href="/membership-benefits" className="text-[#8A2BE2] hover:underline">
                  Learn more about Pro benefits
                </a>
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardHeader;
