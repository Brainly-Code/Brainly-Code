import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Navigate, Outlet, useSearchParams } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { setCredentials } from "./redux/Features/authSlice";

const Home = () => {
  return <Outlet />;
};

export default Home;