import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Navigate, Outlet, useSearchParams, useNavigate } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode'; // ✅ Correct import
import BgLoader from './Components/ui/BgLoader';
import { setCredentials } from './redux/Features/authSlice';

const Home = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [role, setRole] = useState(null);
  const tokenFromURL = searchParams.get('token');

  useEffect(() => {
    let token;

    // 1️⃣ If token in URL, store it and clean up URL
    if (tokenFromURL) {
      token = tokenFromURL;
      
      dispatch(setCredentials({ access_token: token }));
      navigate('/user', { replace: true }); // Remove token from URL
    } 
    // 2️⃣ Else try Redux or localStorage
    else {
      token = userInfo?.access_token || localStorage.getItem('token');
    }

    // 3️⃣ Decode token safely
    if (token && token.split('.').length === 3) {
      try {
        const decoded = jwtDecode(token);
        setRole(decoded?.role);
      } catch (error) {
        console.error('Invalid token', error);
      }
    }else{
      window.reload();
    }
  }, [tokenFromURL, userInfo, dispatch, navigate]);

  // 4️⃣ Loader if role not known yet
  if (!role) {
    return <BgLoader />;
  }

  // 5️⃣ Role-based routing
  if (role === 'USER') {
    return <Outlet />;
  }
  if (role === 'ADMIN' || role === 'SUPERADMIN') {
    return <Navigate to="/admin" />;
  }

  // If role is something unexpected
  return <Navigate to="/login" />;
};

export default Home;
