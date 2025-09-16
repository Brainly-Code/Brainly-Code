import React from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const Home = () => {
  // const { userInfo } = useSelector((state) => state.auth);

  // const accessToken = userInfo?.accessToken;
  // if (!accessToken) {
  //   return <Navigate to="/login" replace />;
  // }

  // let role = null;
  // try {
  //   const decoded = jwtDecode(accessToken);
  //   role = decoded.role; 
  // } catch (error) {
  //   console.error("Invalid token:", error);
  //   // return <Navigate to="/login" replace />;
  // }

  // if (role === "ADMIN" || role === "SUPERADMIN") {
  //   return <Navigate to="/admin" replace />;
  // }

  return <Outlet />;
};

export default Home;