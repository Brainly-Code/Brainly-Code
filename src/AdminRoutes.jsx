import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const AdminRoutes = () => {
  
  return (
    <div>
      {role === "ADMIN" ? <Outlet /> : <Navigate to="/login" replace />}
    </div>
  );
};

export default AdminRoutes;
