import React, { createContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import DashboardHeader from "./Components/DashboardHeader.jsx";
import SideBar from "./Components/SideBar.jsx";
import { useSelector } from "react-redux";
import { jwtDecode } from "jwt-decode";
// eslint-disable-next-line react-refresh/only-export-components
export const userRoleContext = createContext("admin");

const DashboardLayout = () => {
  const { userInfo } = useSelector(state => state.auth);
  const token = jwtDecode(userInfo.access_token);

  const role = token.role;

  return (
    role && role !== "USER" ? (
    
    <userRoleContext.Provider value={role}>
    {/* use admin or superAdmin because in users i hardcoded it  */}
      <div className="w-full z-50 min-h-screen bg-[#0D0056] flex">
        <aside className="sticky  top-10 left-0 md:w-[25%] w-[5rem] lg:w-[20%] z-50">
          <SideBar />
        </aside>
        <div className="flex-1 w-[80%] md:w-[75%] lg:w-[80%]  min-h-screen">
          <div className="sticky z-50 top-0">
            <DashboardHeader />
          </div>
          <main className="p-2 -z-10">
            <Outlet />
          </main>
        </div>
      </div>
    </userRoleContext.Provider>
  ) : (<Navigate to="/login" />)
)}

export default DashboardLayout;
