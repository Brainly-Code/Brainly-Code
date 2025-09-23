import React, { useEffect, useState } from "react";
import { Navigate, Outlet, useNavigate } from "react-router-dom";
import DashboardHeader from "./Components/DashboardHeader.jsx";
import SideBar from "./Components/SideBar.jsx";
import { useSelector } from "react-redux";
import { jwtDecode } from "jwt-decode";
import { SearchContext } from "./../../Contexts/SearchContext.js";
import { userRoleContext } from "./../../Contexts/UserRoleContext.js";
import Footer from "../../Components/ui/Footer.jsx";
import { FiHome } from "react-icons/fi";
import { FaRegUser, FaStar } from "react-icons/fa";
import { MdContacts, MdOutlineReviews } from "react-icons/md";
import { BsGraphUp } from "react-icons/bs";

const DashboardLayout = () => {
  const { access_token, user } = useSelector((state) => state.auth);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  let role;
  try {
    role = user?.role;
  } catch (error) {
    console.error("Invalid token:", error);
    return <Navigate to="/login" replace />;
  }

  // if(isLoadingUser) {
  //   return <BgLoader />
  // }

  if (role === "USER") {
    return <Navigate to="/user" replace />;
  }

  return (
    <userRoleContext.Provider value={role}>
      <SearchContext.Provider value={{ searchQuery, setSearchQuery }}>
        <div className="w-full min-h-screen bg-[#0D0056] flex flex-col">
          <div className="sticky z-50 top-0">
            <DashboardHeader
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
            />
          </div>
          <div className="flex flex-1">
            <aside className="hidden md:block sticky top-0 left-0 md:w-[25%] lg:w-[20%] h-screen z-40">
              <SideBar />
            </aside>
            <aside className="md:hidden fixed bottom-0 left-0 w-full bg-[#120b46] text-white flex justify-around py-3 shadow-lg z-50">
              <button className="flex flex-col items-center" onClick={() => navigate("/admin")}>
                <span><FiHome size={22} /></span>
                <p className="text-xs">Dashboard</p>
              </button>
              <button className="flex flex-col items-center" onClick={() => navigate("/admin/users")}>
                <span><FaRegUser size={22} /></span>
                <p className="text-xs">Users</p>
              </button>
              <button className="flex flex-col items-center" onClick={() => navigate("/admin/courses")}>
                <span><MdContacts size={22} /></span>
                <p className="text-xs">Courses</p>
              </button>
              <button className="flex flex-col items-center" onClick={() => navigate("/admin/challenges")}>
                <span><BsGraphUp size={22} /></span>
                <p className="text-xs">Challenges</p>
              </button>
              <button className="flex flex-col items-center" onClick={() => navigate("/admin/reviews")}>
                <span><MdOutlineReviews size={22} /></span>
                <p className="text-xs">Reviews</p>
              </button>
            </aside>
            <div className="flex-1 w-full md:w-[75%] lg:w-[80%] min-h-screen pb-16 md:pb-0">
              <main className="p-2">
                <Outlet />
              </main>
              <Footer />
            </div>
          </div>
        </div>
      </SearchContext.Provider>
    </userRoleContext.Provider>
  );
};

export default DashboardLayout;