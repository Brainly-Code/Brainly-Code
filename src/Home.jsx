import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Navigate, Outlet, useSearchParams } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { setCredentials } from "./redux/Features/authSlice";

const Home = () => {
  // const { userInfo, accessToken, loading } = useSelector((state) => state.auth);
  // const dispatch = useDispatch();
  // const [searchParams] = useSearchParams();
  // const token = searchParams.get("token");

  // // Store token from URL (e.g., Google/GitHub login)
  // useEffect(() => {
  //   if (token) {
  //     console.log("Token from URL:", token);
  //     try {
  //       const decoded = jwtDecode(token);
  //       dispatch(setCredentials({ user: { role: decoded.role }, access_token: token }));
  //     } catch (error) {
  //       console.error("Invalid token from URL:", error);
  //     }
  //   }
  // }, [token, dispatch]);

  // if (loading) {
  //   return <div>Loading...</div>;
  // }

  // if (!userInfo || !accessToken) {
  //   console.log("No user info or access token found");
  //   return <Navigate to="/user" replace />;
  // }

  // let role;
  // try {
  //   const decoded = jwtDecode(accessToken);
  //   role = decoded.role;
  // } catch (error) {
  //   console.error("Invalid token:", error);
  //   return <Navigate to="/login" replace />;
  // }

  // if (!role) {
  //   return <Navigate to="/login" replace />;
  // }

  // if (role !== "USER") {
  //   return <Navigate to="/admin" replace />;
  // }

  return <Outlet />;
};

export default Home;