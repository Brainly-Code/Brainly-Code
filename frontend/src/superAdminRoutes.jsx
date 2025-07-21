import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const SuperAdminRoutes = () => {
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
  
  console.log(role);
 
  return (
    <div>
      {/* {role === "SUPERADMIN" ? <Outlet /> : <Navigate to="/login" replace />} */}
      <Outlet/>
    </div>
  );
};

export default SuperAdminRoutes;
