import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const Home = () => {
  const { userInfo } = useSelector(state => state.auth);
  let role = null;

  if (userInfo && userInfo.access_token) {
    try {
      const decoded = jwtDecode(userInfo.access_token);
      role = decoded.role;
    } catch (error) {
      console.error("Invalid token", error);
    }
  }

  if (!role) {
    // Not authenticated
    return <Navigate to="/login" replace />;
  }

  if (role !== "USER") {
    // Logged in but not a normal user
    return <Navigate to="/user" replace />;
  }

  return <Outlet />;
};


export default Home;
