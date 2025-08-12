import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Navigate, Outlet, useSearchParams, useNavigate } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode'; // ✅ Correct import
import BgLoader from './Components/ui/BgLoader';
import { setCredentials } from './redux/Features/authSlice';

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
  if (role === 'ADMIN' || role === 'SUPERADMIN') {
    return <Navigate to="/admin" />;
  }

  // If role is something unexpected
  return <Navigate to="/login" />;
};

export default Home;
