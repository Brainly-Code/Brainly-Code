import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Navigate, Outlet, useSearchParams } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';
import { setCredentials } from './redux/Features/authSlice';

const Home = () => {
  const { userInfo } = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const token = useSearchParams()[0].get("token"); // if token comes from URL param
  console.log("token", token);
  let role = null;

  
  // If token exists in URL, save to Redux
  useEffect(() => {
    if (token) {
      // console.log("Token from URL:", token);
      dispatch(setCredentials({ access_token: token }));
    }
  }, [token, dispatch]);

  const accessToken = token || userInfo?.access_token;

  if(!userInfo) {
    return <Navigate to="/login" replace />
  }
  if (!accessToken) {
    console.log("No access token found");
    return <Navigate to="/login" replace />;
  }

if(accessToken){
    try {
    const decoded = jwtDecode(accessToken);
    role = decoded.role;
  } catch (error) {
    console.error("Invalid token", error);
    return <Navigate to="/login" replace />;
  }
}

  if (!role) {
    return <Navigate to="/login" replace />;
  }

  if (role !== "USER") {
    return <Navigate to="/admin" replace />;
  }

  return <Outlet />;
};

export default Home;