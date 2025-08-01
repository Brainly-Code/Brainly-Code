/* eslint-disable no-unused-vars */
import React, { useState }  from "react"; 
import { Navigate, Outlet } from "react-router-dom";
import DashboardHeader from "./Components/DashboardHeader.jsx";
import SideBar from "./Components/SideBar.jsx";
import { useSelector } from "react-redux";
import { jwtDecode } from "jwt-decode";
import { SearchContext } from './../../Contexts/SearchContext.js'; 
import { userRoleContext } from './../../Contexts/UserRoleContext.js'; 
import Footer from "../../Components/ui/Footer.jsx";


const DashboardLayout = () => {
  const { userInfo } = useSelector(state => state.auth);

  const [searchQuery, setSearchQuery] = useState('');
  const token = jwtDecode(userInfo.access_token);
  const role = token.role;
  console.log(token);

  if (!userInfo || !userInfo.access_token) {
    return <Navigate to="/login" />;
  }

  if (role === "USER") {
    return <Navigate to="/login" />; 
  }

  return (
    <userRoleContext.Provider value={role}>
     
      <SearchContext.Provider value={{ searchQuery, setSearchQuery }}>
        <div className="w-full z-50 min-h-screen bg-[#0D0056]">
          <div className="flex">
            <aside className="sticky top-10 left-0 md:w-[25%] w-[5rem] lg:w-[20%] z-50">
              <SideBar />
            </aside>
            <div className="flex-1 w-[80%] md:w-[75%] lg:w-[80%] min-h-screen">
              <div className="sticky z-50 top-0">
                <DashboardHeader searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
              </div>
              <main className="p-2 -z-10">
            
                <Outlet />
              </main>
            </div>
          </div>
          <Footer />
        </div>
      </SearchContext.Provider>
    </userRoleContext.Provider>
  );
}

export default DashboardLayout;
