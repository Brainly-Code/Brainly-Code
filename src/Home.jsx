import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import Loader from './Components/ui/Loader';

const Home = () => {
  const { userInfo } = useSelector(state => state.auth);
  let role = null;

  if (userInfo && userInfo.access_token) {
    try {
      const decoded = jwtDecode(userInfo.access_token);
      role = decoded?.role;
    } catch (error) {
      console.error("Invalid token", error);
    }
  }

  if (!role) {
    return <div className = "bg-[#4444e4]">
       <h1 className='text-gray-400 text-xl text-center'>Try reloading...</h1>
       <Loader />
    </div>;
  }

  if (role !== "USER") {
    // Logged in but not a normal user
    return <Navigate to="/admin" replace />;
  }

  return <Outlet />;
};


export default Home;
