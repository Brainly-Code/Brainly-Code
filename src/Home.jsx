import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import BgLoader from './Components/ui/BgLoader';

const Home = () => {
  const { userInfo } = useSelector(state => state.auth);
  let role;

  
  if (userInfo?.access_token) {
    try {
      const decoded = jwtDecode(userInfo.access_token);
      console.log(decoded); 
      role = decoded?.role;
    } catch (error) {
      console.error("Invalid token", error);
    }
  }

  if(role === undefined){
    window.location.reload();
    return <BgLoader/>
  }
  
  console.log(role)
  if(role === "USER"){
    return <Outlet />
  }
  if(role === "ADMIN" || role === "SUPERADMIN"){
    return <Navigate to="/admin" />
  }
  
};

export default Home;
