import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';


const AdminRoutes = () => {

  return (
    <div>
      {/* {role === "ADMIN" ? <Outlet /> : <Navigate to="/login" replace />} */}
      <Outlet/>
    </div>
  );
};

export default AdminRoutes;
